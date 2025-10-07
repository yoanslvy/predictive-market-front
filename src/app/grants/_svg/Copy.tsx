export function Copy({
  className,
  color = "white",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.23356 15.5H14.0791C14.5889 15.5 15.0021 15.0867 15.0021 14.5768V6.72982C15.0021 6.21996 14.5889 5.80664 14.0791 5.80664H6.23356C5.72379 5.80664 5.31055 6.21996 5.31055 6.72982V14.5768C5.31055 15.0867 5.72379 15.5 6.23356 15.5Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12.7318V4.42318C3 4.17833 3.09725 3.94352 3.27034 3.77039C3.44344 3.59726 3.67821 3.5 3.92301 3.5H12.2301"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
