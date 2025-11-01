import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return (
        <div className="gradient-bg" style={{ minHeight: '100vh', padding: '2rem 0' }}>
          <div className="container py-5">
            <div className="card-glow p-5 mx-auto text-center" style={{ maxWidth: '700px', backgroundColor: '#151a2d', borderRadius: '10px' }}>
              <h2 className="neon-text mb-4">⚠️ Something Went Wrong</h2>
              <p className="text-light mb-4">
                An error occurred while loading this component. Please try refreshing the page.
              </p>
              
              {this.state.error && (
                <div className="text-start mb-4 p-3" style={{ backgroundColor: '#1a1f3a', borderRadius: '8px', fontSize: '0.9rem' }}>
                  <strong className="text-danger">Error:</strong>
                  <pre className="text-light mt-2 mb-2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="text-muted" style={{ fontSize: '0.85rem' }}>
                      <summary style={{ cursor: 'pointer' }}>Stack Trace</summary>
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: '0.5rem' }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-neon px-4 py-3"
                >
                  🔄 Refresh Page
                </button>
                <button
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                  className="btn btn-outline-light px-4 py-3"
                >
                  🔙 Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

