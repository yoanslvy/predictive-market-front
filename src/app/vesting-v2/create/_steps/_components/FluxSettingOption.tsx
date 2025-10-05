'use client'

import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Checkbox, Tooltip } from '@mantine/core'

type FluxSettingOptionProps = {
  checked: boolean
  onChange: (checked: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  tooltip?: string
}

export function FluxSettingOption({ checked, onChange, label, tooltip }: FluxSettingOptionProps) {
  return (
    <div className="flex h-[46px] gap-[0.8em] items-center justify-between rounded-xl border border-[#2C2F3A] px-[12px] py-[10px] hover:bg-[#202228] transition-all">
      <Checkbox
        checked={checked}
        onChange={onChange}
        size="xs"
        classNames={{
          input:
            'bg-transparent border-[#757A8B9E] border-2 bg-[#757A8B52] checked:bg-[#2FFA8129] checked:border-transparent disabled:bg-[#757A8B52] disabled:border-[#757A8B9E]',
          icon: 'text-[#2FFA81]',
          label: 'w-full',
          body: 'flex justify-between items-center',
          labelWrapper: 'w-full',
        }}
        labelPosition="left"
        className="w-full"
        label={
          <div className="flex items-center gap-[0.5em] w-full">
            <p className="text-[14px] text-[#757A8BB8]">{label}</p>
            {tooltip && (
              <Tooltip label={tooltip} position="top">
                <div className="cursor-help text-[#757A8B] hover:text-[#F0F2FB] transition-colors text-[14px]">
                  <QuestionMarkCircleIcon width={18} height={18} />
                </div>
              </Tooltip>
            )}
          </div>
        }
      />
    </div>
  )
}
