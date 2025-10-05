import { cn } from '@/src/src/utils'

export function Title({
  className,
  title,
  subtitle,
  isOptional,
}: {
  className?: string
  title: string
  subtitle?: string
  isOptional?: boolean
}) {
  return (
    <div className={cn('flex items-start gap-x-[1rem]', className)}>
      <div className="mt-[0.3rem]">
        <svg
          width="27"
          height="27"
          viewBox="0 0 27 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M25 13.5C25 19.8513 19.8513 25 13.5 25C7.14873 25 2 19.8513 2 13.5C2 7.14873 7.14873 2 13.5 2C19.8513 2 25 7.14873 25 13.5ZM4.3 13.5C4.3 18.581 8.41898 22.7 13.5 22.7C18.581 22.7 22.7 18.581 22.7 13.5C22.7 8.41898 18.581 4.3 13.5 4.3C8.41898 4.3 4.3 8.41898 4.3 13.5Z"
            fill="#202228"
          />
          <path
            d="M13.5 3.15C13.5 2.51487 14.0162 1.99403 14.6481 2.05743C16.7744 2.27072 18.8 3.07273 20.496 4.37276C21.0001 4.75915 21.0198 5.49219 20.5851 5.95517C20.1503 6.41816 19.4261 6.43424 18.9125 6.06058C17.6563 5.14661 16.1884 4.56543 14.6471 4.37176C14.0169 4.29258 13.5 3.78513 13.5 3.15Z"
            fill="#2FFA81"
          />
        </svg>
      </div>
      <div className="flex flex-col items-start justify-start gap-y-[1rem]">
        <span className="flex items-center gap-x-[0.6rem]">
          <p className="text-[26px] text-white font-bold">{title}</p>
          {isOptional && (
            <>
              <p className="text-[26px] text-[#F0F2FB52]">(optional)</p>
            </>
          )}
        </span>
        {subtitle && <p className="text-[14px] text-[#757A8B]">{subtitle}</p>}
      </div>
    </div>
  )
}
