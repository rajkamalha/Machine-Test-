import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // You can log the error to an external service here
    console.error("Error caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#f2dede', color: '#a94442' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error ? this.state.error.message : 'An unknown error occurred'}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
