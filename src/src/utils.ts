import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
} from 'date-fns'
import { twMerge } from 'tailwind-merge'

import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(delay: number) {
  return new Promise((res) => setTimeout(res, delay))
}



export function getTimeLeft(timestamp: Date | string | number): string {
  const currentTime = new Date()
  const endTime = new Date(timestamp)


  const diff = {
    days: differenceInDays(endTime, currentTime),
    weeks: differenceInWeeks(endTime, currentTime),
    months: differenceInMonths(endTime, currentTime),
    years: differenceInYears(endTime, currentTime),
  }

  if (diff.years) {
    return `${diff.years} year${diff.years > 1 ? 's' : ''}`
  }

  if (diff.months) {
    return `${diff.months} month${diff.months > 1 ? 's' : ''}`
  }

  if (diff.years) {
    return `${diff.weeks} week${diff.weeks > 1 ? 's' : ''}`
  }

  return `${diff.days} day${diff.days > 1 ? 's' : ''}`
}

export const getShortAddress = (address?: string, count = 4): string => {
  const charCount = Math.max(count, 4)

  const regexp = new RegExp(`(0x)([0-9a-f]{${charCount - 1}})(.+)([0-9a-f]{${charCount}})`, 'i')

  const result = `${address}`.replace(regexp, '$1$2…$4')
  return result
}
