export function Caret({ stroke = "#F0F2FB" }: { stroke?: string }) {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.92578 17.0984L13.3591 11.6651C14.0008 11.0234 14.0008 9.97344 13.3591 9.33177L7.92578 3.89844"
        stroke={stroke}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
