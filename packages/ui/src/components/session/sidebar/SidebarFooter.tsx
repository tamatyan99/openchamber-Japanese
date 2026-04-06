import React from 'react';
import { useTranslation } from 'react-i18next';
import { RiInformationLine, RiQuestionLine, RiSettings3Line } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
  onOpenUpdate: () => void;
  showRuntimeButtons?: boolean;
  showUpdateButton?: boolean;
};

const footerButtonClassName = 'inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-interactive-hover/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50';

export function SidebarFooter({
  onOpenSettings,
  onOpenShortcuts,
  onOpenAbout,
  onOpenUpdate,
  showRuntimeButtons = true,
  showUpdateButton = true,
}: Props): React.ReactNode {
  const { t } = useTranslation();
  return (
    <div className="flex shrink-0 items-center justify-start gap-1 px-2.5 py-2">
      {showRuntimeButtons ? (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={onOpenSettings} className={footerButtonClassName} aria-label={t('Settings')}>
                <RiSettings3Line className="h-4.5 w-4.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}><p>{t('Settings')}</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={onOpenShortcuts} className={footerButtonClassName} aria-label={t('Shortcuts')}>
                <RiQuestionLine className="h-4.5 w-4.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}><p>{t('Shortcuts')}</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={onOpenAbout} className={footerButtonClassName} aria-label={t('About OpenChamber')}>
                <RiInformationLine className="h-4.5 w-4.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}><p>{t('About OpenChamber')}</p></TooltipContent>
          </Tooltip>
        </>
      ) : null}
      {showUpdateButton ? (
        <Button
          type="button"
          variant="default"
          size="xs"
          className="ml-auto border-[var(--status-info-border)] bg-[var(--status-info-background)] text-[var(--status-info)] hover:bg-[var(--status-info-background)]/80 hover:text-[var(--status-info)]"
          onClick={onOpenUpdate}
        >
          {t('Update')}
        </Button>
      ) : null}
    </div>
  );
}
