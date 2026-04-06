import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RiCheckboxBlankLine, RiCheckboxLine } from '@remixicon/react';
import type { Session } from '@opencode-ai/sdk/v2';

export type DeleteSessionConfirmState = {
  session: Session;
  descendantCount: number;
  archivedBucket: boolean;
} | null;

export function SessionDeleteConfirmDialog(props: {
  value: DeleteSessionConfirmState;
  setValue: (next: DeleteSessionConfirmState) => void;
  showDeletionDialog: boolean;
  setShowDeletionDialog: (next: boolean) => void;
  onConfirm: () => Promise<void> | void;
}): React.ReactNode {
  const { value, setValue, showDeletionDialog, setShowDeletionDialog, onConfirm } = props;
  const { t } = useTranslation();

  return (
    <Dialog open={Boolean(value)} onOpenChange={(open) => { if (!open) setValue(null); }}>
      <DialogContent showCloseButton={false} className="max-w-sm gap-5">
        <DialogHeader>
          <DialogTitle>{value?.archivedBucket ? t('Delete session?') : t('Archive session?')}</DialogTitle>
          <DialogDescription>
            {value && value.descendantCount > 0
              ? value.archivedBucket
                ? t('"{{title}}" and its {{count}} sub-task{{s}} will be permanently deleted.', { title: value.session.title || t('Untitled Session'), count: value.descendantCount, s: value.descendantCount === 1 ? '' : 's' })
                : t('"{{title}}" and its {{count}} sub-task{{s}} will be archived.', { title: value.session.title || t('Untitled Session'), count: value.descendantCount, s: value.descendantCount === 1 ? '' : 's' })
              : value?.archivedBucket
                ? t('"{{title}}" will be permanently deleted.', { title: value?.session.title || t('Untitled Session') })
                : t('"{{title}}" will be archived.', { title: value?.session.title || t('Untitled Session') })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setShowDeletionDialog(!showDeletionDialog)}
            className="inline-flex items-center gap-1.5 typography-ui-label text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
            aria-pressed={!showDeletionDialog}
          >
            {!showDeletionDialog ? <RiCheckboxLine className="h-4 w-4 text-primary" /> : <RiCheckboxBlankLine className="h-4 w-4" />}
            {t('Never ask')}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setValue(null)}
              className="inline-flex h-8 items-center justify-center rounded-md border border-border px-3 typography-ui-label text-foreground hover:bg-interactive-hover/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {t('Cancel')}
            </button>
            <button
              type="button"
              onClick={() => void onConfirm()}
              className="inline-flex h-8 items-center justify-center rounded-md bg-destructive px-3 typography-ui-label text-destructive-foreground hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50"
            >
              {value?.archivedBucket ? t('Delete') : t('Archive')}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type DeleteFolderConfirmState = {
  scopeKey: string;
  folderId: string;
  folderName: string;
  subFolderCount: number;
  sessionCount: number;
} | null;

export function FolderDeleteConfirmDialog(props: {
  value: DeleteFolderConfirmState;
  setValue: (next: DeleteFolderConfirmState) => void;
  onConfirm: () => void;
}): React.ReactNode {
  const { value, setValue, onConfirm } = props;
  const { t } = useTranslation();

  return (
    <Dialog open={Boolean(value)} onOpenChange={(open) => { if (!open) setValue(null); }}>
      <DialogContent showCloseButton={false} className="max-w-sm gap-5">
        <DialogHeader>
          <DialogTitle>{t('Delete folder?')}</DialogTitle>
          <DialogDescription>
            {value && (value.subFolderCount > 0 || value.sessionCount > 0)
              ? t('"{{name}}" will be deleted{{sub}}. Sessions inside will not be deleted.', { name: value.folderName, sub: value.subFolderCount > 0 ? t(' along with {{count}} sub-folder{{s}}', { count: value.subFolderCount, s: value.subFolderCount === 1 ? '' : 's' }) : '' })
              : t('"{{name}}" will be permanently deleted.', { name: value?.folderName })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            type="button"
            onClick={() => setValue(null)}
            className="inline-flex h-8 items-center justify-center rounded-md border border-border px-3 typography-ui-label text-foreground hover:bg-interactive-hover/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {t('Cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-8 items-center justify-center rounded-md bg-destructive px-3 typography-ui-label text-destructive-foreground hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50"
          >
            {t('Delete')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
