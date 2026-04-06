import React from 'react';
import { useTranslation } from 'react-i18next';
import { RiGitCommitLine, RiArrowDownLine, RiLoader4Line } from '@remixicon/react';
import { Button } from '@/components/ui/button';

interface GitEmptyStateProps {
  behind: number;
  onPull: () => void;
  isPulling: boolean;
}

export const GitEmptyState: React.FC<GitEmptyStateProps> = ({
  behind,
  onPull,
  isPulling,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <RiGitCommitLine className="size-10 text-muted-foreground/70 mb-4" />
      <p className="typography-ui-label font-semibold text-foreground mb-1">
        {t('Working tree clean')}
      </p>
      <p className="typography-meta text-muted-foreground mb-4">
        {t('All changes have been committed')}
      </p>

      {behind > 0 && (
        <Button
          variant="outline"
          onClick={onPull}
          disabled={isPulling}
        >
          {isPulling ? (
            <RiLoader4Line className="size-4 animate-spin" />
          ) : (
            <RiArrowDownLine className="size-4" />
          )}
          {t('Pull {{count}} commit', { count: behind })}
        </Button>
      )}
    </div>
  );
};
