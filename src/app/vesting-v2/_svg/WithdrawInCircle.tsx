export function WithdrawInCircle({ stroke = '#17181C', size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M18 35C26.753 35 34 27.7373 34 19C34 10.2471 26.7373 3 17.9843 3C9.24707 3 2 10.2471 2 19C2 27.7373 9.26276 35 18 35Z" />
      <path
        d="M13.7168 14.5547L18.0025 10.269L22.2882 14.5547"
        stroke={stroke}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 23.4453V10.5882"
        stroke={stroke}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 27H23"
        stroke={stroke}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
