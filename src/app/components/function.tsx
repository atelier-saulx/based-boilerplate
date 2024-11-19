type FunctionModuleProps = {
  name: string
  children: React.ReactNode
}

export const FunctionModule = ({ name, children }: FunctionModuleProps) => {
  const background: string =
    'linear-gradient(112.33deg,#ff1f85 -11.53%,#4b41ff 93.86%)'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        border: '1px solid #ffffff',
        padding: '32px',
        borderRadius: '16px',
        position: 'relative',
        minWidth: '500px',
        minHeight: '150px',
        margin: '32px',
      }}
    >
      <span
        style={{
          position: 'absolute',
          color: '#ffffff',
          top: '-16px',
          left: '16px',
          background,
          fontWeight: 900,
          fontSize: '16px',
          padding: '8px',
          paddingLeft: '16px',
          paddingRight: '16px',
          borderRadius: '16px',
        }}
      >
        {name}
      </span>
      {children}
    </div>
  )
}
