export function Clock({ stroke = "#5BC0FE" }: { stroke?: string }) {
  return (
    <svg
      width="15"
      height="16"
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.75 8C13.75 11.45 10.95 14.25 7.5 14.25C4.05 14.25 1.25 11.45 1.25 8C1.25 4.55 4.05 1.75 7.5 1.75C10.95 1.75 13.75 4.55 13.75 8Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.81953 9.98857L7.88203 8.83232C7.54453 8.63232 7.26953 8.15107 7.26953 7.75732V5.19482"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
