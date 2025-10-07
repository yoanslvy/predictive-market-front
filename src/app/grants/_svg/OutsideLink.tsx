export function OutsideLink({
  arrowColor = "white",
  arrowOpacity = 0.4,
  size = 24,
  className = "",
}) {
  const isColoredArrow = arrowColor !== "white" || arrowOpacity !== 0.4;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {isColoredArrow ? (
        <>
          <path
            d="M13 11L21.2 2.80005"
            stroke={arrowColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22.0002 6.8V2H17.2002"
            stroke={arrowColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <path
          d="M13 11.0008L21.2 2.80078M21.9992 6.8V2H17.1992M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
          stroke="white"
          strokeOpacity={arrowOpacity}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
