import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Component boundary caught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="bg-[#171614] text-[#F7F4EF] px-6 py-16 text-center border-y border-[#D8D0C5]">
          <p className="text-xs tracking-[0.18em] uppercase text-[#B89F7D] mb-2">
            Villa Vérone · Cap Ferrat
          </p>
          <p className="font-serif text-2xl font-light">
            Interactive view temporarily unavailable. Please scroll to explore the residence photography below.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
