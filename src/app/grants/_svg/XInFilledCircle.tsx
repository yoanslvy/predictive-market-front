export function XInFilledCircle({
  stroke = '#17181C',
  fill = '#FA2F54',
  width = 36,
  height = 36,
}: {
  stroke?: string
  fill?: string
  width?: number
  height?: number
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 33C26.2059 33 33 26.1913 33 18C33 9.79413 26.1913 3 17.9853 3C9.79413 3 3 9.79413 3 18C3 26.1913 9.80884 33 18 33Z"
        fill={fill}
      />
      <path
        d="M22.4333 23L13 13"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 23L22.4333 13"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
