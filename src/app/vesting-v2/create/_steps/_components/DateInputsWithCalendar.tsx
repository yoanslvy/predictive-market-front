import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Indicator, Input, Popover, Tooltip } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import dayjs from 'dayjs'

import { useState, type Dispatch, type SetStateAction } from 'react'

import { CalendarIcon } from '../../../_svg/CalendarIcon'
import { dateFormatter } from '../../../_utils/utils'

export type HighlightedDate = {
  isSelected: boolean
  date: Date
}

type DateInputWithCalendarProps = {
  valueDate: Date | null
  onMouseEnter: (date: Date) => void
  onClick: (date: Date) => void
  selectedDates: HighlightedDate[]
  highlighted: Date[]
  placeholder?: string
  onHourClick: (date: Date, hour: number) => void
  onMinuteClick: (date: Date, minute: number) => void
  isOpen: boolean
  onOpenChange: (opened: boolean) => void
}

function DateInputWithCalendar({
  valueDate,
  onMouseEnter,
  onClick,
  placeholder,
  selectedDates,
  highlighted,
  onHourClick,
  onMinuteClick,
  isOpen,
  onOpenChange,
}: DateInputWithCalendarProps) {
  return (
    <Popover
      closeOnClickOutside
      position="bottom"
      withArrow
      shadow="md"
      opened={isOpen}
      onChange={onOpenChange}
      classNames={{
        arrow: 'hidden',
        dropdown: 'rounded-xl',
      }}>
      <Popover.Target>
        <Input
          readOnly
          rightSection={<CalendarIcon className="ml-[0.5em]" />}
          classNames={{
            input:
              'bg-transparent border-transparent text-white p-0 m-0 text-[16px] leading-[22.8571px]',
          }}
          value={!valueDate ? '' : dateFormatter(valueDate)}
          className="w-full rounded-xl border border-[#2C2F3A] bg-[#202228] px-[16px] py-[5px] h-[48px] text-white"
          placeholder={placeholder}
          onClick={() => {
            onOpenChange(true)
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
                  (s) => dayjs(date).isSame(s.date, 'day') && s.isSelected
                ),
                inRange: highlighted.some((s) => {
                  return (
                    new Date(date).getFullYear() === s.getFullYear() &&
                    new Date(date).getMonth() === s.getMonth() &&
                    new Date(date).getDate() === s.getDate()
                  )
                }),
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
                        data-hour={hour}
                        className={`cursor-pointer py-2 px-3 text-center rounded-md ${
                          isSelected
                            ? 'bg-[#01EB5A29] text-[#01EB5A] font-medium'
                            : 'text-[#C7C8C9] hover:bg-[#01EB5A29]'
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
                        data-minute={minute}
                        className={`cursor-pointer py-2 px-3 text-center rounded-md ${
                          isSelected
                            ? 'bg-[#01EB5A29] text-[#01EB5A] font-medium'
                            : 'text-[#C7C8C9] hover:bg-[#01EB5A29]'
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
                  onOpenChange(false)
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

function updateSelectedDates(
  date: Date,
  selectedDates: HighlightedDate[],
  setSelectedDates: Dispatch<SetStateAction<HighlightedDate[]>>,
  isClick: boolean,
  highlighted: Date[],
  nonHighlighted: Date[]
) {
  if (isClick) {
    if (selectedDates.length === 0) {
      setSelectedDates([{ date, isSelected: true }])
    } else if (selectedDates.length > 1 && nonHighlighted.length > 1) {
      setSelectedDates([])
    } else if (nonHighlighted.length === 1) {
      let currentDate = dayjs(date)
      const dates: HighlightedDate[] = []

      if (currentDate.isBefore(dayjs(selectedDates[0]?.date), 'day')) {
        setSelectedDates([{ date, isSelected: true }])
        return
      }

      // Allow same day selection for start and end date
      while (
        currentDate.isAfter(dayjs(selectedDates[0]?.date), 'day') ||
        currentDate.isSame(dayjs(selectedDates[0]?.date), 'day')
      ) {
        dates.push({ date: currentDate.toDate(), isSelected: true })
        currentDate = currentDate.subtract(1, 'day')
      }

      const currentSet = selectedDates.map((s) => s.date.toString())
      const newSet = dates.map((s) => s.date.toString())
      const mergedSet = [...new Set([...currentSet, ...newSet])]

      setSelectedDates(mergedSet.map((d) => ({ date: new Date(d), isSelected: true })))
    }
  } else {
    if (selectedDates.length === 0 || nonHighlighted.length > 1) {
      return
    }

    let currentDate = dayjs(date)
    const highlightedDates: HighlightedDate[] = []

    const lastHighlightedDay = highlighted.sort((a, b) => (a > b ? 1 : -1)).at(-1)

    if (currentDate.isBefore(dayjs(lastHighlightedDay), 'day')) {
      // Allow same day selection for start and end date
      while (
        currentDate.isSame(dayjs(selectedDates[0]?.date), 'day') ||
        currentDate.isAfter(dayjs(selectedDates[0]?.date), 'day')
      ) {
        highlightedDates.push({
          date: currentDate.toDate(),
          isSelected: false,
        })
        currentDate = currentDate.subtract(1, 'day')
      }

      const currentSet = [selectedDates[0]!].map((s) => s.date.toString())
      const highlightedSet = highlightedDates.map((s) => s.date.toString())
      const mergedSet = [...new Set([...currentSet, ...highlightedSet])]
      const mergedArray = mergedSet.map((d) => ({
        date: new Date(d),
        isSelected: false,
      }))
      if (mergedArray[0]) {
        mergedArray[0].isSelected = true
      }
      setSelectedDates(mergedArray)
      return
    }

    // Allow same day selection for start and end date
    while (
      currentDate.isAfter(dayjs(selectedDates[0]?.date), 'day') ||
      currentDate.isSame(dayjs(selectedDates[0]?.date), 'day')
    ) {
      highlightedDates.push({
        date: currentDate.toDate(),
        isSelected: false,
      })
      currentDate = currentDate.subtract(1, 'day')
    }

    const currentSet = selectedDates.map((s) => s.date.toString())
    const highlightedSet = highlightedDates.map((s) => s.date.toString())
    const mergedSet = [...new Set([...currentSet, ...highlightedSet])]
    const mergedArray = mergedSet.map((d) => ({
      date: new Date(d),
      isSelected: false,
    }))
    if (mergedArray[0]) {
      mergedArray[0].isSelected = true
    }
    setSelectedDates(mergedArray)
  }
}

export function DateInputsWithCalendar({
  initialDate,
  finalDate,
  selectedDates,
  setSelectedDates,
  placeHolderStartDate = 'Start Date',
  placeHolderEndDate = 'End Date',
  startDateTooltip,
  endDateTooltip,
}: {
  initialDate: Date | null
  finalDate: Date | null
  selectedDates: HighlightedDate[]
  setSelectedDates: Dispatch<SetStateAction<HighlightedDate[]>>
  placeHolderStartDate?: string
  placeHolderEndDate?: string
  startDateTooltip?: string
  endDateTooltip?: string
}) {
  const highlighted = selectedDates.filter((s) => !s.isSelected).map((s) => s.date)
  const nonHighlighted = selectedDates.filter((s) => s.isSelected).map((s) => s.date)
  const [activePopover, setActivePopover] = useState<'start' | 'end' | null>(null)

  return (
    <div className="flex gap-[1rem] lg:flex-row flex-col w-full">
      <div className="relative flex items-center w-full gap-2">
        <DateInputWithCalendar
          valueDate={initialDate}
          selectedDates={selectedDates}
          highlighted={highlighted}
          placeholder={placeHolderStartDate}
          isOpen={activePopover === 'start'}
          onOpenChange={(opened) => setActivePopover(opened ? 'start' : null)}
          onMouseEnter={(date) => {
            updateSelectedDates(
              date,
              selectedDates,
              setSelectedDates,
              false,
              highlighted,
              nonHighlighted
            )
          }}
          onClick={(date) => {
            updateSelectedDates(
              date,
              selectedDates,
              setSelectedDates,
              true,
              highlighted,
              nonHighlighted
            )
          }}
          onHourClick={(date, hour) => {
            setSelectedDates((prev) => {
              return prev.map((s, idx) => {
                const selectedDateIdx = prev.findIndex((d) => d.date.getTime() === date.getTime())
                if (idx === selectedDateIdx) {
                  const newDate = new Date(date)
                  newDate.setHours(hour)
                  return { date: newDate, isSelected: true }
                }
                return s
              })
            })
          }}
          onMinuteClick={(date, minute) => {
            setSelectedDates((prev) => {
              return prev.map((s, idx) => {
                const selectedDateIdx = prev.findIndex((d) => d.date.getTime() === date.getTime())
                if (idx === selectedDateIdx) {
                  const newDate = new Date(date)
                  newDate.setMinutes(minute)
                  return { date: newDate, isSelected: true }
                }
                return s
              })
            })
          }}
        />
        {startDateTooltip && (
          <Tooltip
            label={startDateTooltip}
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
      <div className="relative flex items-center w-full gap-2">
        <DateInputWithCalendar
          valueDate={finalDate}
          selectedDates={selectedDates}
          highlighted={highlighted}
          placeholder={placeHolderEndDate}
          isOpen={activePopover === 'end'}
          onOpenChange={(opened) => setActivePopover(opened ? 'end' : null)}
          onMouseEnter={(date) => {
            updateSelectedDates(
              date,
              selectedDates,
              setSelectedDates,
              false,
              highlighted,
              nonHighlighted
            )
          }}
          onClick={(date) => {
            updateSelectedDates(
              date,
              selectedDates,
              setSelectedDates,
              true,
              highlighted,
              nonHighlighted
            )
          }}
          onHourClick={(date, hour) => {
            setSelectedDates((prev) => {
              const newDate = new Date(date)
              newDate.setHours(hour)
              return [...prev, { date: newDate, isSelected: true }]
            })
          }}
          onMinuteClick={(date, minute) => {
            setSelectedDates((prev) => {
              const newDate = new Date(date)
              newDate.setMinutes(minute)
              return [...prev, { date: newDate, isSelected: true }]
            })
          }}
        />
        {endDateTooltip && (
          <Tooltip
            label={endDateTooltip}
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
    </div>
  )
}
