import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSessionUIStore } from '@/sync/session-ui-store';
import { useSessions } from '@/sync/sync-context';
import { useDirectoryStore } from '@/stores/useDirectoryStore';
import { cn } from '@/lib/utils';

interface SidebarContextSummaryProps {
    className?: string;
}

const formatSessionTitle = (title?: string | null, untitled = 'Untitled Session') => {
    if (!title) {
        return untitled;
    }
    const trimmed = title.trim();
    return trimmed.length > 0 ? trimmed : untitled;
};

const formatDirectoryPath = (path?: string) => {
    if (!path || path.length === 0) {
        return '/';
    }
    return path;
};

export const SidebarContextSummary: React.FC<SidebarContextSummaryProps> = ({ className }) => {
    const { t } = useTranslation();
    const currentSessionId = useSessionUIStore((state) => state.currentSessionId);
    const sessions = useSessions();
    const { currentDirectory } = useDirectoryStore();

    const activeSessionTitle = React.useMemo(() => {
        if (!currentSessionId) {
            return t('No active session');
        }
        const session = sessions.find((item) => item.id === currentSessionId);
        return session ? formatSessionTitle(session.title, t('Untitled Session')) : t('No active session');
    }, [currentSessionId, sessions]);

    const directoryFull = React.useMemo(() => {
        return formatDirectoryPath(currentDirectory);
    }, [currentDirectory]);

    const directoryDisplay = React.useMemo(() => {
        if (!directoryFull || directoryFull === '/') {
            return directoryFull;
        }
        const segments = directoryFull.split('/').filter(Boolean);
        return segments.length ? segments[segments.length - 1] : directoryFull;
    }, [directoryFull]);

    return (
        <div className={cn('hidden min-h-[48px] flex-col justify-center gap-0.5 border-b bg-sidebar/60 px-3 py-2 backdrop-blur md:flex md:pb-2', className)}>
            <span className="typography-meta text-muted-foreground">{t('Session')}</span>
            <span className="typography-ui-label font-semibold text-foreground truncate" title={activeSessionTitle}>
                {activeSessionTitle}
            </span>
            <span className="typography-meta text-muted-foreground truncate" title={directoryFull}>
                {directoryDisplay}
            </span>
        </div>
    );
};
