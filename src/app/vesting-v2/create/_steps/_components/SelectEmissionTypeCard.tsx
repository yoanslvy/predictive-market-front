export function SelectEmissionTypeCard({
  description,
  bottomText,
  title,
  svg,
}: {
  description: string
  title: string
  bottomText: string
  svg: JSX.Element
}) {
  return (
    <div className="flex h-auto lg:h-[580px] w-full lg:w-[540px] items-start justify-between rounded-xl bg-[#202228]">
      <div className="flex flex-col justify-between w-full h-full">
        <div className="flex flex-col gap-[18px] p-4 lg:p-[20px] flex-wrap">
          <p className="text-[28px] lg:text-[42px] font-[500] leading-[28px] lg:leading-[42px] text-white">
            {title}
          </p>
          <p className="gap-[4px] text-[14px] lg:text-[18px] text-[#757A8B]">
            {description}
          </p>
        </div>
        <div className="flex items-center w-full p-4 lg:p-[20px]">
          <div className="flex items-center justify-center w-full border border-[#06c68d] rounded-lg py-4 lg:py-[2em] shadow-lg bg-gradient-to-br from-[#06c68d]/5 to-transparent backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#06c68d]/5 to-transparent"></div>
            <div className="relative z-10 scale-75 lg:scale-100">{svg}</div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-[18px] p-4 lg:p-[20px]">
          <p className="text-[12px] lg:text-[16px]">{bottomText}</p>
        </div>
      </div>
    </div>
  )
}
