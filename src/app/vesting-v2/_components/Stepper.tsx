function TickCircleFilled() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 15C11.625 15 15 11.625 15 7.5C15 3.375 11.625 0 7.5 0C3.375 0 0 3.375 0 7.5C0 11.625 3.375 15 7.5 15Z"
        fill="#2FFA81"
      />
      <path
        d="M4.3125 7.50141L6.435 9.62391L10.6875 5.37891"
        stroke="black"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TickCircle() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.78564 16C12.9106 16 16.2856 12.625 16.2856 8.5C16.2856 4.375 12.9106 1 8.78564 1C4.66064 1 1.28564 4.375 1.28564 8.5C1.28564 12.625 4.66064 16 8.78564 16Z"
        fill="#17181C"
        stroke="#2FFA81"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.59814 8.50141L7.72064 10.6239L11.9731 6.37891"
        stroke="#2FFA81"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Circle() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.35718 16C12.4822 16 15.8572 12.625 15.8572 8.5C15.8572 4.375 12.4822 1 8.35718 1C4.23218 1 0.857178 4.375 0.857178 8.5C0.857178 12.625 4.23218 16 8.35718 16Z"
        fill="#17181C"
        stroke="#30333C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Stepper({
  percentage,
  steps = 8,
}: {
  percentage: number;
  steps?: number;
}) {
  const activeStep = Math.floor((percentage / 100) * steps);

  return (
    <div className="relative flex w-full items-center justify-between">
      <div
        className="absolute left-0 top-[0.5em] w-full"
        style={{ height: "1px" }}
      >
        <svg width="100%" height="1" className="absolute">
          <line
            x1="0"
            y1="0.5"
            x2={`${Math.min(100, (activeStep / (steps - 1)) * 100)}%`}
            y2="0.5"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="4 10"
            style={{
              opacity: activeStep > 0 ? 1 : 0,
            }}
          />
          <line
            x1={`${Math.min(100, (activeStep / (steps - 1)) * 100)}%`}
            y1="0.5"
            x2="100%"
            y2="0.5"
            stroke="#30333C"
            strokeWidth="1"
            strokeDasharray="4 10"
            style={{
              opacity: activeStep < steps - 1 ? 1 : 0,
            }}
          />
        </svg>
      </div>
      <div className="relative z-10 flex w-full items-center justify-between">
        {Array.from({ length: steps }).map((_, index) => (
          <div key={index}>
            {index < activeStep ? (
              <TickCircleFilled />
            ) : index === activeStep ? (
              <TickCircle />
            ) : (
              <Circle />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
