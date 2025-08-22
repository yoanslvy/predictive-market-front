import { FC, ReactNode } from 'react'

import { Logo } from './Logo'

type OGPSectionProps = {
  children: ReactNode | ReactNode[]
}

export const OGPSection: FC<OGPSectionProps> = ({ children }) => {
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
          width: '1000px',
          display: 'flex',
          flexDirection: 'column',
        }}>
        {childrenArr.map((item, idx) => (
          <span key={idx}>{item}</span>
        ))}
      </h1>
    </div>
  )
}
