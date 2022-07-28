import Link from "next/link";
import React, { ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props> {
  public state: State = {
    hasError: false,
  };
  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log({ error, errorInfo });
  }
  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col">
          <h2>Oops, there is an error!</h2>
          <Link href="/">
            <a>Go back to the homepage</a>
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
