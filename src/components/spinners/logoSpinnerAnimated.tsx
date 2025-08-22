// put me inside a component with set width / height
export default function LogoSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div
        style={{
          animation: `customAnimation 0.3s ease-in-out forwards`,
          // animationDelay: '300ms',
          animationFillMode: 'forwards',
          // position: 'absolute',
          // inset: 0,
          // backgroundColor: 'black',
          // borderRadius: '1rem',
          // width: '100%',
          // height: '100%',
        }}
        className="relative items-center justify-center m-auto w-full h-full">
        {/* <div className="flex absolute top-0 m-auto left-0 w-3/5 h-3/5 justify-center items-center"> */}
        <div className="absolute text-green-500 duration-300 top-0 animate-growShrink left-0 flex m-auto justify-center items-center w-full h-full z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 1000"
            className="animate-logoFade flex w-3/6 h-3/6 m-auto justify-center items-center"
            //  h-auto
          >
            <g>
              <path
                id="head"
                fill="transparent"
                className="stroke-current stroke-[54px]"
                d="m973,326.46s-.01,0-.02,0c-21.3-12.97-45.19-5.39-70.08,3.23,7.37-14.8,33.4-43.18,18.32-54.43-36.04-26.89-90.26-46.88-152.04-37.02,6.45-14.74,37.37-44.8,16.6-56.21-39.77-21.85-106.48-47.09-167.09-15.54l-7.06-82.4c-.55-5.89-7.24-8.9-11.97-5.4l-94.8,70.06-25.11-45.62c-2.82-5.28-10.32-5.28-13.2,0l-31.93,58.08c-33.46,10.81-64.1,29.47-90.32,57.59L38.27,98.94c-7.68-3.01-13.32,7.37-6.69,12.16,82.64,59.5,250.45,180.21,251.8,181.25,0,.06-171.24,269.92-171.24,269.98-26.4,42.24-12.22,78.1,31.81,101,24.87,12.83,52.8,17.56,80.31,14.74,38.68-3.99,115.31-17.81,232.58-56.8h.06c2.15-.61,54.83-15.1,84.43-53.48.12
            -.37.43-.61.61-1.04,12.16-17.44,23.64-71.41-.18-123.91-3.19-6.88,4.05-14.12,11.05-10.81,35.8,17.19,106.53,58.94,150.06,137.54,2.76,5.03"
                style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
              />
              <path
                id="neck"
                fill="transparent"
                className="stroke-current stroke-[54px]"
                d="m731.48,642.33l-217.36,284.34c-9.39,12.28-20.08,22.72-31.74,31.25,23.39-104.81,24.19-252.17-25.54-336.66"
                style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
              />

              <rect id="border-guide" className="fill-none" width="1000" height="1000" />
            </g>
          </svg>
        </div>
        <div className="w-full stroke-green-500 h-full backdrop-blur-md">
          <svg
            viewBox="2 2 20 20"
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
      <style>{`
      @keyframes customAnimation {
        0% { 
          transform: scale(0.95);
           filter: blur(10px); Starting with a higher blur value */


        }
        100% { 
          transform: scale(1.0); 
          filter: blur(0px);  No blur at the end */

        }
      }
    `}</style>
    </div>
  )
}
