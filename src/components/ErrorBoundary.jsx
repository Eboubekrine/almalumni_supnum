import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-red-200">
                        <h1 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <p className="text-slate-600 mb-4">The application encountered an error. Please try refreshing the page.</p>
                        <details className="bg-slate-100 p-4 rounded text-xs font-mono overflow-auto max-h-64">
                            <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
