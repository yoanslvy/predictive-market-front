'use client'

import { CalendarDate } from '@internationalized/date'


import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  Heading as CalendarHeading,
  DateInput,
  DatePicker,
  DatePickerProps,
  DateSegment,
  DateValue,
  Dialog,
  Group,
  Popover,
} from 'react-aria-components'
import { useDidMount } from 'rooks'

import { ReactNode, useState } from 'react'

import { clsx } from 'clsx'

import Preset from '@modules/Button'

import IconCalendar from '@images/icons/calendarAdd.svg'

import { ButtonProps } from '../Button/Button'
import styles from './DateTimePicker.module.scss'

export type DatetimePickerType = 'date' | 'time' | 'datetime'

type DateTimePickerProps<T extends DateValue> = DatePickerProps<T> & {
  type?: DatetimePickerType
  title?: string
  footer?: ReactNode
  onValueChange?: (value: Date | null) => void

  presets?: ButtonProps[]
}

export function DateTimePicker<T extends DateValue>({
  title,
  type = 'datetime',
  footer,
  onValueChange,
  presets,
  ...props
}: DateTimePickerProps<T>) {
  const [isMounted, setIsMounted] = useState(false)
  useDidMount(() => {
    setIsMounted(true)
  })

  const granularity = ['time', 'datetime'].includes(type) ? 'minute' : 'day'

  const today = new Date()

  const todayDate = new CalendarDate(
    today.getUTCFullYear(),
    today.getUTCMonth() + 1,
    today.getUTCDate()
  )

  return (
    <DatePicker
      granularity={granularity}
      hideTimeZone={false}
      hourCycle={24}
      {...props}
      className={clsx(styles.container, props.className)}
      onChange={(value) => {
        onValueChange?.(value?.toDate('UTC') || null)
        props?.onChange?.(value)
      }}>
      {!!title && (
        <div className={styles.header}>
          <strong className={styles.title}>{title}</strong>
        </div>
      )}
      <Group className={styles.combo}>
        {isMounted && (
          <DateInput className={styles.input}>
            {(segment) => {
              return (
                <DateSegment
                  className={clsx(styles.segment, styles[segment.type])}
                  segment={segment}
                />
              )
            }}
          </DateInput>
        )}
        {type !== 'time' && (
          <Button className={clsx(styles.action, styles.toggle)}>
            <IconCalendar className={styles.icon} />
          </Button>
        )}
      </Group>

      {!!presets && (
        <div className={styles.presets}>
          {presets.map((preset, idx) => (
            <Preset key={idx} {...preset} size="xxs" className={styles.preset} />
          ))}
        </div>
      )}

      {!!footer && <div className={styles.footer}>{footer}</div>}

      <Popover shouldFlip={false}>
        <Dialog>
          <Calendar className={styles.calendar}>
            <div className={styles.nav}>
              <Button className={styles.step} slot="previous">
                ◀
              </Button>
              <CalendarHeading />
              <Button className={styles.step} slot="next">
                ▶
              </Button>
            </div>
            <CalendarGrid className={styles.grid}>
              {(date) => {
                return (
                  <CalendarCell
                    className={clsx(styles.cell, { [styles.past]: date.compare(todayDate) < 0 })}
                    date={date}
                  />
                )
              }}
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  )
}
