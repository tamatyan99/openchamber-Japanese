import React from 'react';
import { useTranslation } from 'react-i18next';
import { RiChat3Line, RiRestartLine } from '@remixicon/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ChatErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ChatErrorBoundaryProps {
  children: React.ReactNode;
  sessionId?: string;
}

interface ChatErrorFallbackProps {
  error?: Error;
  sessionId?: string;
  onReset: () => void;
}

const ChatErrorFallback: React.FC<ChatErrorFallbackProps> = ({ error, sessionId, onReset }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-destructive">
            <RiChat3Line className="h-5 w-5" />
            {t('Chat Error')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {t('The chat interface encountered an error. This might be due to a temporary network issue or corrupted message data.')}
          </p>

          {sessionId && (
            <div className="text-xs text-muted-foreground text-center">
              {t('Session')}: {sessionId}
            </div>
          )}

          {error && (
            <details className="text-xs font-mono bg-muted p-3 rounded">
              <summary className="cursor-pointer hover:bg-interactive-hover/80">{t('Error details')}</summary>
              <pre className="mt-2 overflow-x-auto">
                {error.toString()}
              </pre>
            </details>
          )}

          <div className="flex gap-2">
            <Button onClick={onReset} variant="outline" className="flex-1">
              <RiRestartLine className="h-4 w-4 mr-2" />
              {t('Reset Chat')}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            {t('If the problem persists, try refreshing the page.')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export class ChatErrorBoundary extends React.Component<ChatErrorBoundaryProps, ChatErrorBoundaryState> {
  constructor(props: ChatErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ChatErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });

    if (process.env.NODE_ENV === 'development') {
      console.error('Chat error caught by boundary:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ChatErrorFallback
          error={this.state.error}
          sessionId={this.props.sessionId}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
