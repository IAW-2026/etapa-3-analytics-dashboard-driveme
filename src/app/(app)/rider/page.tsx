export default function RiderPage() {
  return (
    <div style={{ padding: '32px' }}>
      <div
        style={{
          maxWidth: '480px',
          margin: '80px auto',
          textAlign: 'center',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          borderRadius: '8px',
          padding: '48px 32px',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <span style={{ color: '#34d399', fontSize: '20px' }}>●</span>
        </div>
        <h1
          style={{
            color: '#34d399',
            fontSize: '20px',
            fontWeight: 600,
            margin: '0 0 8px',
            letterSpacing: '-0.01em',
          }}
        >
          Rider Analytics
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
          Próximamente — integración pendiente
        </p>
      </div>
    </div>
  )
}
