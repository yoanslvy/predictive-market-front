// put me inside a component with set width / height
export default function Spinner() {
  return (
    <div className="flex bg-transparent items-center justify-center">
      <div className="relative opacity-80 items-center justify-center m-auto w-full h-full">
        {/* <div className="flex absolute top-0 m-auto left-0 w-3/5 h-3/5 justify-center items-center"> */}
        <div className="w-full stroke-gray-200 h-full opacity-60">
          <svg
            viewBox="0 0 24 24"
            className="top-0 left-0 w-full h-full "
            xmlns="http://www.w3.org/2000/svg">
            <g className="">
              <circle
                className=" "
                cx="12"
                cy="12"
                r="9.5"
                fill="none"
                strokeWidth="0.999999"
                strokeLinecap="round">
                <animate
                  attributeName="stroke-dasharray"
                  dur="1.5s"
                  calcMode="spline"
                  values="0 150;42 150;42 150;42 150"
                  keyTimes="0;0.475;0.95;1"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-dashoffset"
                  dur="1.5s"
                  calcMode="spline"
                  values="0;-16;-59;-59"
                  keyTimes="0;0.475;0.95;1"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  repeatCount="indefinite"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="2s"
                values="0 12 12;360 12 12"
                repeatCount="indefinite"
              />
            </g>
          </svg>
        </div>
        {/* </div> */}
      </div>
    </div>
  )
}
