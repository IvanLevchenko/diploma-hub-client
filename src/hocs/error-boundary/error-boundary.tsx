import React, { ErrorInfo } from "react";

interface State {
  hasError: boolean;
  errorMessage: string;
}

interface Props {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(error, errorInfo, "<-----");
  }

  render() {
    if (this.state.hasError) {
      return <>Hello, you've got an error!</>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
