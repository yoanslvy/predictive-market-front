import { FC, ReactNode } from 'react'

import { Logo } from './Logo'

type OGPTvlProps = {
  children: ReactNode | ReactNode[]
}

export const OGPTvl: FC<OGPTvlProps> = ({ children }) => {
  const childrenArr = Array.isArray(children) ? children : [children]

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column',
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
      }}>
      <Logo
        style={{
          position: 'absolute',
          left: '48px',
          top: '48px',
        }}
      />
      <h1
        style={{
          position: 'absolute',
          left: '48px',
          bottom: '48px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '64px',
          lineHeight: '92px',
          fontWeight: '700',
          margin: 0,
          padding: 0,
          width: '460px',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <div
          style={{
            flexGrow: 1,
            flexBasis: '0',
            display: 'flex',
            gap: '0px',
            flexDirection: 'column',
            padding: '48px',
            borderRadius: '48px',
            background: '#14161d',
          }}>
          {childrenArr.map((item, idx) => (
            <span key={idx}>{item}</span>
          ))}
        </div>
      </h1>
    </div>
  )
}
