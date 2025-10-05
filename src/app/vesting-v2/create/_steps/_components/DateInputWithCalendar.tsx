import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Indicator, Input, Popover, Tooltip } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import dayjs from 'dayjs'

import { useState, type Dispatch, type SetStateAction } from 'react'

import { cn } from '@/src/src/utils'

import { CalendarIcon } from '../../../_svg/CalendarIcon'
import { dateFormatter } from '../../../_utils/utils'

export type HighlightedDate = {
  isSelected: boolean
  date: Date
}

function DateInputWithCalendarInternal({
  valueDate,
  onMouseEnter,
  onClick,
  placeholder,
  selectedDates,
  highlighted,
  onHourClick,
  onMinuteClick,
}: {
  valueDate: Date | null
  onMouseEnter: (date: Date) => void
  onClick: (date: Date) => void
  selectedDates: HighlightedDate[]
  highlighted: Date[]
  placeholder?: string
  onHourClick: (date: Date, hour: number) => void
  onMinuteClick: (date: Date, minute: number) => void
}) {
  const [popoverOpened, setPopoverOpened] = useState(false)

  return (
    <Popover
      closeOnClickOutside
      position="bottom"
      withArrow
      shadow="md"
      opened={popoverOpened}
      onChange={setPopoverOpened}
      classNames={{
        arrow: 'hidden',
        dropdown: 'rounded-xl',
      }}>
      <Popover.Target>
        <Input
          readOnly
          rightSection={<CalendarIcon />}
          classNames={{
            input:
              'bg-transparent border-transparent text-white p-0 m-0 text-[16px] leading-[22.8571px]',
          }}
          value={!valueDate ? '' : dateFormatter(valueDate)}
          className="w-full rounded-xl border border-[#2C2F3A] bg-[#202228] px-[16px] py-[5px] h-[48px] text-white"
          placeholder={placeholder}
          onClick={() => {
            setPopoverOpened((prev) => !prev)
          }}
        />
      </Popover.Target>
      <Popover.Dropdown className="border-transparent bg-[#26282E]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <Calendar
              style={{
                '--mantine-color-gray-0': '#E0EDFF08',
              }}
              classNames={{
                month: 'text-[#C7C8C9]',
                day: "data-[selected='true']:bg-[#01EB5A29] data-[in-range='true']:bg-[#E0EDFF08] data-[selected='true']:text-[#01EB5A] text-[#C7C8C9]",
                weekday: 'text-[#757A8B]',
                calendarHeader: 'text-white',
                monthCell: "data-[selected='false']:hover:bg-[#E0EDFF08]",
                yearsListControl: 'text-[#C7C8C9]',
                monthsListControl: 'text-[#C7C8C9]',
              }}
              getDayProps={(date) => ({
                selected: selectedDates.some(
                  (s) => dayjs(date).isSame(s.date, 'date') && s.isSelected
                ),
                inRange: highlighted.some(
                  (s) => dayjs(date).isSame(s, 'date') && new Date(date) !== valueDate
                ),
                onMouseEnter: () => onMouseEnter(new Date(date)),
                onClick: () => onClick(new Date(date)),
                disabled: dayjs(date).isBefore(dayjs(), 'date'),
              })}
              renderDay={(date) => {
                const day = new Date(date).getDate()
                const isToday = dayjs(date).isSame(dayjs(), 'date')
                if (isToday) {
                  return (
                    <Indicator size={6} color="red" offset={-2}>
                      <div>{day}</div>
                    </Indicator>
                  )
                }
                return <div>{day}</div>
              }}
            />
            <div className="flex gap-2 p-2 min-w-full lg:min-w-[160px] border-t lg:border-t-0 lg:border-l border-[#2C2F3A]">
              <div className="flex flex-col items-center">
                <p className="text-[14px] text-[#757A8B] mb-2">Hours</p>
                <div className="h-[150px] lg:h-[200px] overflow-y-auto w-[60px] pr-1 scrollbar-thin scrollbar-thumb-[#2C2F3A] scrollbar-track-transparent">
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i
                    const isSelected = valueDate && valueDate.getHours() === hour

                    return (
                      <div
                        key={`hour-${hour}`}
                        className={`cursor-pointer py-2 px-3 text-center hover:bg-[#01EB5A29] rounded-md ${
                          isSelected
                            ? 'bg-[#01EB5A29] text-[#01EB5A] font-medium'
                            : 'text-[#C7C8C9]'
                        }`}
                        onClick={() => {
                          if (valueDate) {
                            onHourClick(valueDate, hour)
                          }
                        }}>
                        {hour.toString().padStart(2, '0')}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-[14px] text-[#757A8B] mb-2">Min</p>
                <div className="h-[150px] lg:h-[200px] overflow-y-auto w-[60px] pr-1 scrollbar-thin scrollbar-thumb-[#2C2F3A] scrollbar-track-transparent">
                  {Array.from({ length: 60 }, (_, i) => {
                    const minute = i
                    const isSelected = valueDate && valueDate.getMinutes() === minute

                    return (
                      <div
                        key={`min-${minute}`}
                        className={`cursor-pointer py-2 px-3 text-center hover:bg-[#01EB5A29] rounded-md ${
                          isSelected
                            ? 'bg-[#01EB5A29] text-[#01EB5A] font-medium'
                            : 'text-[#C7C8C9]'
                        }`}
                        onClick={() => {
                          if (valueDate) {
                            onMinuteClick(valueDate, minute)
                          }
                        }}>
                        {minute.toString().padStart(2, '0')}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* OK Button */}
            <div className="flex justify-center mt-2 lg:justify-end">
              <button
                className="px-4 py-2 rounded-md bg-[#01EB5A29] hover:bg-[#01EB5A40] text-[#01EB5A] font-medium transition-colors h-fit"
                onClick={(e) => {
                  e.stopPropagation()
                  setPopoverOpened(false)
                }}>
                OK
              </button>
            </div>
          </div>
        </div>
      </Popover.Dropdown>
    </Popover>
  )
}

function DateInputWithCalendarInternalReadonly({
  valueDate,
  placeholder,
}: {
  valueDate: Date | null
  placeholder?: string
}) {
  return (
    <Popover
      position="bottom"
      withArrow
      shadow="md"
      classNames={{
        arrow: 'hidden',
        dropdown: 'rounded-xl',
      }}>
      <Popover.Target>
        <Input
          readOnly
          rightSection={<CalendarIcon />}
          classNames={{
            input:
              'bg-transparent border-transparent text-white p-0 m-0 text-[16px] leading-[22.8571px]',
          }}
          value={!valueDate ? '' : dateFormatter(valueDate)}
          className="w-full rounded-xl border border-[#2C2F3A] bg-[#202228] px-[16px] py-[7px] h-[48px] text-white"
          placeholder={placeholder}
        />
      </Popover.Target>
    </Popover>
  )
}

function updateSelectedDates(
  date: Date,
  selectedDates: HighlightedDate[],
  setSelectedDates: Dispatch<SetStateAction<HighlightedDate[]>>,
  isClick: boolean,
  nonHighlighted: Date[]
) {
  if (isClick) {
    setSelectedDates([{ date, isSelected: true }])
  } else {
    if (selectedDates.length === 0 || nonHighlighted.length > 1) {
      return
    }
  }
}

export function DateInputWithCalendar({
  initialDate,
  selectedDates,
  setSelectedDates,
  placeholder,
  className,
  tooltip,
}: {
  initialDate: Date | null
  selectedDates: HighlightedDate[]
  setSelectedDates: Dispatch<SetStateAction<HighlightedDate[]>>
  placeholder?: string
  className?: string
  tooltip?: string
}) {
  const highlighted = selectedDates.filter((s) => !s.isSelected).map((s) => s.date)
  const nonHighlighted = selectedDates.filter((s) => s.isSelected).map((s) => s.date)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DateInputWithCalendarInternal
        valueDate={initialDate}
        selectedDates={selectedDates}
        highlighted={highlighted}
        placeholder={placeholder ?? 'Start Date'}
        onMouseEnter={(date) => {
          updateSelectedDates(date, selectedDates, setSelectedDates, false, nonHighlighted)
        }}
        onClick={(date) => {
          updateSelectedDates(date, selectedDates, setSelectedDates, true, nonHighlighted)
        }}
        onHourClick={(date, hour) => {
          setSelectedDates((prev) => {
            const newDate = new Date(date)
            newDate.setHours(hour)
            return [{ date: newDate, isSelected: true }]
          })
        }}
        onMinuteClick={(date, minute) => {
          setSelectedDates((prev) => {
            const newDate = new Date(date)
            newDate.setMinutes(minute)
            return [{ date: newDate, isSelected: true }]
          })
        }}
      />
      {tooltip && (
        <Tooltip
          label={tooltip}
          position="bottom"
          withArrow
          multiline
          classNames={{
            tooltip: 'bg-[#2A2C33] text-[#F0F2FB] border border-[#757A8B]/20 max-w-[250px]',
          }}>
          <div className="cursor-help text-[#757A8B] hover:text-[#F0F2FB] transition-colors">
            <QuestionMarkCircleIcon width={22} height={22} />
          </div>
        </Tooltip>
      )}
    </div>
  )
}

export function DateInputWithCalendarReadOnly({
  initialDate,
  placeholder,
  className,
  tooltip,
}: {
  initialDate: Date | null
  placeholder?: string
  className?: string
  tooltip?: string
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DateInputWithCalendarInternalReadonly
        valueDate={initialDate}
        placeholder={placeholder ?? 'Start Date'}
      />
      {tooltip && (
        <Tooltip
          label={tooltip}
          position="bottom"
          withArrow
          multiline
          classNames={{
            tooltip: 'bg-[#2A2C33] text-[#F0F2FB] border border-[#757A8B]/20 max-w-[250px]',
          }}>
          <div className="cursor-help text-[#757A8B] hover:text-[#F0F2FB] transition-colors">
            <QuestionMarkCircleIcon width={22} height={22} />
          </div>
        </Tooltip>
      )}
    </div>
  )
}
