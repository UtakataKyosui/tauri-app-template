import { Button } from "@/components/ui/button";
import { type Note, createNote, deleteNote, listNotes } from "@/lib/api/notes";
import { type TaskProgress, cancelLongTask, onTaskProgress, startLongTask } from "@/lib/api/tasks";
import { checkForUpdate, installUpdate } from "@/lib/api/updater";
import { isDesktop } from "@/lib/platform";
import { useToastStore } from "@/stores/toast-store";
import { createFileRoute } from "@tanstack/react-router";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
});

/**
 * Phase 3 の基盤機能（APP-01〜03, RS-09, RS-10）を実演するページ。
 * 実プロジェクトでは不要になった機能ごとこのファイルを削除できる（リスク R-7）。
 */
function DemoPage() {
  const { t } = useTranslation();
  const pushToast = useToastStore((s) => s.push);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8">
      <h1 className="text-2xl font-semibold">{t("demo.title")}</h1>
      <FileDemo onError={(m) => pushToast({ title: m, variant: "destructive" })} />
      <NotificationDemo onError={(m) => pushToast({ title: m, variant: "destructive" })} />
      <OpenLinkDemo onError={(m) => pushToast({ title: m, variant: "destructive" })} />
      <LongTaskDemo onError={(m) => pushToast({ title: m, variant: "destructive" })} />
      <NotesDemo onError={(m) => pushToast({ title: m, variant: "destructive" })} />
      {isDesktop() && (
        <UpdaterDemo onError={(m) => pushToast({ title: m, variant: "destructive" })} />
      )}
    </div>
  );
}

interface DemoSectionProps {
  onError: (message: string) => void;
}

// APP-01: ファイル選択ダイアログ / ファイル読み書き
function FileDemo({ onError }: DemoSectionProps) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">{t("demo.file.title")}</h2>
      <Button
        variant="outline"
        onClick={async () => {
          try {
            const path = await openDialog({
              multiple: false,
              // #34 で画像プレビューが入るまではテキストしか扱えないため、
              // 選択できる拡張子を絞る（#44）。
              filters: [
                { name: "Text", extensions: ["txt", "md", "json", "toml", "yaml", "csv", "log"] },
              ],
            });
            if (!path || Array.isArray(path)) return;
            // フロントから受け取ったパスをそのまま渡すが、これはダイアログが返した
            // 検証済みの値であり、ユーザー入力の任意文字列ではない点に注意
            // （レビュー観点 §1、任意文字列を渡す場合は別途検証すること）。
            const content = await readTextFile(path);
            setPreview(content.slice(0, 200));
          } catch (e) {
            onError(String(e));
          }
        }}
      >
        {t("demo.file.open")}
      </Button>
      <p className="text-xs text-muted-foreground">{t("demo.file.hint")}</p>
      {preview && (
        <pre className="whitespace-pre-wrap text-xs text-muted-foreground">{preview}</pre>
      )}
    </section>
  );
}

// APP-02: ネイティブ通知
export function NotificationDemo({ onError }: DemoSectionProps) {
  const { t } = useTranslation();
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    isPermissionGranted().then(setPermissionGranted);
  }, []);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">{t("demo.notification.title")}</h2>
      <Button
        variant="outline"
        onClick={async () => {
          try {
            let granted = await isPermissionGranted();
            if (!granted) {
              // モバイルでは要求フローがデスクトップと異なる（OS のダイアログに委譲される）
              granted = (await requestPermission()) === "granted";
            }
            setPermissionGranted(granted);
            if (granted) {
              sendNotification({
                title: t("demo.notification.title"),
                body: t("demo.notification.body"),
              });
            } else {
              onError(t("demo.notification.denied"));
            }
          } catch (e) {
            onError(String(e));
          }
        }}
      >
        {t("demo.notification.send")}
      </Button>
      <p className="text-xs text-muted-foreground">
        {permissionGranted === null
          ? t("demo.notification.permissionChecking")
          : permissionGranted
            ? t("demo.notification.permissionGranted")
            : t("demo.notification.permissionNotGranted")}
      </p>
      <p className="text-xs text-muted-foreground">{t("demo.notification.devNote")}</p>
    </section>
  );
}

// APP-03: 外部リンクを OS 既定ブラウザで開く
function OpenLinkDemo({ onError }: DemoSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">{t("demo.openLink.title")}</h2>
      <Button
        variant="outline"
        onClick={async () => {
          try {
            await openUrl("https://tauri.app");
          } catch (e) {
            onError(String(e));
          }
        }}
      >
        {t("demo.openLink.open")}
      </Button>
    </section>
  );
}

// RS-10: 進捗イベントを伴う長時間処理
function LongTaskDemo({ onError }: DemoSectionProps) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<TaskProgress | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  useEffect(() => {
    const unlisten = onTaskProgress((p) => setProgress(p));
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">{t("demo.longTask.title")}</h2>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={async () => {
            try {
              setTaskId(await startLongTask(10));
            } catch (e) {
              onError(String(e));
            }
          }}
        >
          {t("demo.longTask.start")}
        </Button>
        <Button
          variant="ghost"
          disabled={!taskId}
          onClick={async () => {
            if (!taskId) return;
            try {
              await cancelLongTask(taskId);
            } catch (e) {
              onError(String(e));
            }
          }}
        >
          {t("demo.longTask.cancel")}
        </Button>
      </div>
      {progress && (
        <p className="text-xs text-muted-foreground">
          {progress.status}: {progress.completed}/{progress.total}
        </p>
      )}
    </section>
  );
}

// RS-09: SQLite 永続化のサンプル
function NotesDemo({ onError }: DemoSectionProps) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      setNotes(await listNotes());
    } catch (e) {
      onError(String(e));
    }
  }, [onError]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">{t("demo.notes.title")}</h2>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("demo.notes.placeholder")}
        />
        <Button
          disabled={adding}
          onClick={async () => {
            if (!title.trim()) return;
            setAdding(true);
            try {
              await createNote(title, "");
              setTitle("");
              await refresh();
            } catch (e) {
              onError(String(e));
            } finally {
              setAdding(false);
            }
          }}
        >
          {t("demo.notes.add")}
        </Button>
      </div>
      <ul className="flex flex-col gap-1">
        {notes.map((note) => (
          <li key={note.id} className="flex items-center justify-between text-sm">
            <span>{note.title}</span>
            <button
              type="button"
              disabled={deletingId === note.id}
              className="text-xs text-muted-foreground underline disabled:opacity-50"
              onClick={async () => {
                setDeletingId(note.id);
                try {
                  await deleteNote(note.id);
                  await refresh();
                } catch (e) {
                  onError(String(e));
                } finally {
                  setDeletingId(null);
                }
              }}
            >
              {t("demo.notes.delete")}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// APP-08: 自動アップデート（デスクトップ専用）
function UpdaterDemo({ onError }: DemoSectionProps) {
  const { t } = useTranslation();
  const [checking, setChecking] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [available, setAvailable] = useState<string | null>(null);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">{t("demo.updater.title")}</h2>
      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={checking}
          onClick={async () => {
            setChecking(true);
            try {
              const info = await checkForUpdate();
              setAvailable(info.available ? (info.version ?? null) : null);
            } catch (e) {
              onError(String(e));
            } finally {
              setChecking(false);
            }
          }}
        >
          {t("demo.updater.check")}
        </Button>
        {available && (
          <Button
            disabled={installing}
            onClick={async () => {
              setInstalling(true);
              try {
                await installUpdate();
              } catch (e) {
                onError(String(e));
              } finally {
                setInstalling(false);
              }
            }}
          >
            {t("demo.updater.install", { version: available })}
          </Button>
        )}
      </div>
      {!checking && available === null && (
        <p className="text-xs text-muted-foreground">{t("demo.updater.upToDate")}</p>
      )}
    </section>
  );
}
