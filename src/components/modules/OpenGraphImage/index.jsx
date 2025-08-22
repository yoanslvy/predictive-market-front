import { ImageResponse } from 'next/og'

export default async function OpenGraphImage(content, bg, size = { width: 1200, height: 630 }) {
  const fontDataRegular = await fetch(
    new URL('./fonts/Inter/Inter-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())
  const fontDataBold = await fetch(new URL('./fonts/Inter/Inter-Bold.ttf', import.meta.url)).then(
    (res) => res.arrayBuffer()
  )

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0e1015',
          color: '#fff',
          fontFamily: 'Inter',
          fontSize: '48px',
          display: 'flex',
          width: size.width,
          height: size.height,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        {!!bg && (
          <img
            style={{
              objectFit: 'cover',
              objectPosition: 'right bottom',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
            }}
            src={bg}
            alt=""
          />
        )}
        {content}
      </div>
    ),
    {
      ...size,
      emoji: 'twemoji',
      fonts: [
        {
          name: 'Inter',
          data: fontDataRegular,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Inter',
          data: fontDataBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
