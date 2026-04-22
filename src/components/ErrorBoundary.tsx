import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error && parsed.operationType) {
          errorMessage = `Firestore ${parsed.operationType} error: ${parsed.error}`;
        }
      } catch (e) {
        errorMessage = this.state.error?.message || "An unexpected error occurred.";
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-bg p-6">
          <div className="max-w-md w-full editorial-card p-12 text-center">
            <h2 className="font-serif text-3xl text-brand mb-4">System Anomaly</h2>
            <p className="text-muted mb-10 font-light leading-relaxed">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-brand text-white py-4 rounded-sm micro-label hover:bg-brand/90 transition-all"
            >
              Restart Platform
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
