"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Industrial-grade React Error Boundary.
 * Prevents client-side exceptions from crashing the entire application tree.
 * Gracefully renders a fallback UI when a child component throws.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.warn("[ErrorBoundary] Caught an exception - rendering fallback:", error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          style={{
            padding: "12px 16px",
            fontSize: 12,
            color: "rgba(26,25,21,0.5)",
            background: "#FAF9F5",
            border: "1px solid rgba(26,25,21,0.08)",
            borderRadius: 6,
            margin: 8,
          }}
        >
          ⚠ A temporary error occurred. Please refresh the page. If the issue persists, contact support.
        </div>
      );
    }
    return this.props.children;
  }
}
