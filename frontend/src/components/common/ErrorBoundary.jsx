import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
          <div className="glass-panel rounded-3xl p-8 text-center">
            <h1 className="font-heading text-3xl font-bold">WeatherFlow hit a rendering problem.</h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
              Refresh the page or return to the forecast home screen.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
