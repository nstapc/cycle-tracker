import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.error) {
      const isEnvError =
        this.state.error.message?.includes('NOCODB') ||
        this.state.error.message?.includes('fetch') ||
        this.state.error.message?.includes('Failed to load')

      return (
        <div style={{
          maxWidth: '640px',
          margin: '4rem auto',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            ⚠️ Something went wrong
          </h1>

          {isEnvError ? (
            <>
              <p style={{ marginBottom: '0.75rem' }}>
                The app could not connect to the NocoDB API. This usually means
                the required environment variables are missing or misconfigured.
              </p>
              <h2 style={{ fontSize: '1.1rem', margin: '1.25rem 0 0.5rem' }}>
                How to fix:
              </h2>
              <ol style={{ paddingLeft: '1.25rem', lineHeight: 1.7 }}>
                <li>
                  Copy <code style={codeStyle}>.env.example</code> to{' '}
                  <code style={codeStyle}>.env.local</code>
                </li>
                <li>
                  Fill in <code style={codeStyle}>VITE_NOCODB_BASE_URL</code>,{' '}
                  <code style={codeStyle}>VITE_NOCODB_API_TOKEN</code>, and the table
                  IDs from your NocoDB instance
                </li>
                <li>Restart the dev server</li>
              </ol>
              <p style={{ marginTop: '1rem', color: '#6b6375', fontSize: '0.9rem' }}>
                See the{' '}
                <a
                  href="https://github.com/nstapc/cycle-tracker#nocodb-setup"
                  style={{ color: '#4f46e5' }}
                >
                  README → NocoDB Setup
                </a>{' '}
                for full instructions.
              </p>
            </>
          ) : (
            <pre style={{
              ...codeStyle,
              padding: '1rem',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
            }}>
              {this.state.error.message}
            </pre>
          )}

          <button
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: '1.5rem',
              padding: '0.5rem 1.25rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

const codeStyle = {
  backgroundColor: '#f4f3ec',
  padding: '0.15rem 0.4rem',
  borderRadius: '0.25rem',
  fontSize: '0.9em',
}
