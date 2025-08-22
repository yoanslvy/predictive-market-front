import { FC, ReactNode } from 'react'

import { Logo } from './Logo'
import TokenIcon from './TokenIcon'

type Value = {
  title: string
  prefix?: string
  value?: string
  suffix?: string
}

export type TokenData = {
  address: string
  symbol: string
  iconUrl?: string | null
}

type OGPStatProps = {
  chainId: string
  tokens: TokenData[]
  metric: {
    percent?: number
  } & Value
  stats?: (Value & { title: string })[]
}

export const OGPStats: FC<OGPStatProps> = ({ chainId, tokens, metric, stats }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        padding: '48px',
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          justifyContent: 'space-between',
        }}>
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse' }}>
            {tokens.reverse().map((token, idx) => (
              <TokenIcon
                key={idx}
                src={token.iconUrl || ''}
                style={{ marginLeft: idx === tokens.length - 1 ? 0 : '-32px' }}
              />
            ))}
          </div>
          <span style={{ color: '#fff', fontSize: '48px', fontWeight: 400 }}>
            {tokens.map((token) => token.symbol).join('/')}
          </span>
        </div>

        <Logo style={{ height: '82px', width: '300' }} />
      </div>

      <div style={{ flexGrow: 1, flexShrink: 0, flexBasis: 0, display: 'flex', gap: '48px' }}>
        <div
          style={{
            flexGrow: 1,
            flexBasis: '0',
            display: 'flex',
            gap: '48px',
            flexDirection: 'column',
            padding: '40px',
            borderRadius: '48px',
            background: '#14161d',
          }}>
          {typeof metric.percent !== 'undefined' && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '40px',
              }}>
              <strong
                style={{
                  fontSize: '40px',
                  fontWeight: 400,
                  lineHeight: '48px',
                  color: '#80838f',
                  textTransform: 'uppercase',
                }}>
                {metric.title}
              </strong>
              <span
                style={{
                  fontSize: '140px',
                  lineHeight: '160px',
                  fontWeight: 700,
                  color: '#fff',
                }}>
                {metric.percent}%
              </span>
              <span
                style={{
                  flexBasis: '100%',
                  background: '#2d313d',
                  borderRadius: '20px',
                  display: 'flex',
                }}>
                <span
                  style={{
                    flexBasis: 'auto',
                    width: `${metric.percent}%`,
                    background: metric.percent > 30 ? '#15ff00' : '#ff9900',
                    height: '40px',
                    borderRadius: '20px',
                  }}
                />
              </span>
            </div>
          )}

          {typeof metric.percent === 'undefined' && (
            <div style={{ display: 'flex', flexFlow: 'column', gap: '48px' }}>
              <strong
                style={{
                  fontSize: '40px',
                  fontWeight: 400,
                  lineHeight: '48px',
                  color: '#80838f',
                  textTransform: 'uppercase',
                }}>
                {metric.title}
              </strong>
              <span
                style={{
                  fontSize: '140px',
                  lineHeight: '160px',
                  fontWeight: 700,
                  color: '#fff',
                  marginLeft: 'auto',
                }}>
                {!!metric.prefix && (
                  <span style={{ color: '#80838f', fontWeight: 400 }}>{metric.prefix}</span>
                )}
                {metric.value}
                {!!metric.suffix && (
                  <span style={{ color: '#80838f', fontWeight: 400 }}>{metric.suffix}</span>
                )}
              </span>
            </div>
          )}
        </div>

        {!!stats?.length && (
          <div
            style={{
              flexShrink: 0,
              flexGrow: 0,
              flexBasis: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              padding: '40px',
              borderRadius: '48px',
              background: '#14161d',
            }}>
            {stats.map((stat, idx) => {
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} key={idx}>
                  <strong
                    style={{
                      fontSize: '32px',
                      fontWeight: 400,
                      lineHeight: '32px',
                      color: '#80838f',
                      textTransform: 'uppercase',
                    }}>
                    {stat.title}
                  </strong>
                  <span
                    style={{
                      fontSize: '56px',
                      fontWeight: 700,
                      lineHeight: '68px',
                      color: '#fff',
                    }}>
                    {!!stat.prefix && (
                      <span style={{ color: '#80838f', fontWeight: 400 }}>{stat.prefix}</span>
                    )}
                    {stat.value || 0}
                    {!!stat.suffix && (
                      <span style={{ color: '#80838f', fontWeight: 400 }}>{stat.suffix}</span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
