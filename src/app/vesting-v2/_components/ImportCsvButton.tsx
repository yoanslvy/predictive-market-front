import { useRef, type Dispatch, type SetStateAction } from 'react'

import { Upload } from '../_svg/Upload'
import { Btn } from './Btn'

export function ImportCsvButton({
  csvFile,
  setCsvFile,
}: {
  csvFile: File | null
  setCsvFile: Dispatch<SetStateAction<File | null>>
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Btn
      type="button"
      onClick={() => {
        fileInputRef.current?.click()
      }}
      className="w-full  hover:!bg-[#26282E]"
      variant="transparent">
      <input
        className="hidden"
        type="file"
        accept=".csv"
        onChange={(e) => {
          const file = e.currentTarget.files?.[0]
          if (!file) return
          setCsvFile(file)
        }}
        ref={fileInputRef}
      />
      <Upload />
      <span className="ml-[0.7em] text-[16px] font-bold text-white">
        {csvFile?.name ?? 'Import CSV'}
      </span>
    </Btn>
  )
}
