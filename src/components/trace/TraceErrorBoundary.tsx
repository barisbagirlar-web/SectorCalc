"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type TraceErrorBoundaryProps = {
  readonly children: ReactNode;
  readonly onRetry?: () => void;
  readonly fallback?: ReactNode;
};

type TraceErrorBoundaryState = {
  readonly hasError: boolean;
  readonly error?: Error;
};

export class TraceErrorBoundary extends Component<
  TraceErrorBoundaryProps,
  TraceErrorBoundaryState
> {
  constructor(props: TraceErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): TraceErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[TraceErrorBoundary]", error, info.componentStack);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
    this.props.onRetry?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="sc-trace__error-boundary"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="sc-trace__error-boundary-title">
            Trace temporarily unavailable
          </p>
          <p className="sc-trace__error-boundary-desc">
            Something went wrong. Please try again.
          </p>
          <button
            type="button"
            className="sc-trace__error-boundary-btn"
            onClick={this.handleRetry}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
