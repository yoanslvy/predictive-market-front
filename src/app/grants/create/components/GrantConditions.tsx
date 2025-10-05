import { CalendarDateTime } from '@internationalized/date'

import DateTimePicker from '@/src/components/modules/DateTimePicker'
import styles from '@/src/components/modules/GrantForm/GrantForm.module.scss'
import Heading from '@/src/components/modules/Heading'
import Input from '@/src/components/modules/Input'
import { useGrantFormStore } from '@/src/stores/grants/useGrantFormStore'

export function GrantConditions() {
  const { grantFormData, updateForm, updateBooleans, clearForm, isFormValid } = useGrantFormStore()

  return (
    <>
      <div className={styles.section}>
        <Heading size="md" className="mb-2">
          Condition
        </Heading>
        <Input
          placeholder="What condition must be met for this grant to be released?"
          value={grantFormData.condition.value}
          onValueChange={(value) => updateForm({ name: 'condition', input: value })}
          className={styles.input}
        />
        {grantFormData.condition.message && (
          <div className={styles.error}>{grantFormData.condition.message}</div>
        )}
      </div>
      <div className={styles.openingTimeContainer}>
        <Heading size="md" className="mb-2">
          Grant Opening Time (UTC)
        </Heading>
        <DateTimePicker
          title="Grant Opening Time (UTC)"
          type="datetime"
          value={
            grantFormData.openingTime.value
              ? new CalendarDateTime(
                  new Date(parseInt(grantFormData.openingTime.value) * 1000).getUTCFullYear(),
                  new Date(parseInt(grantFormData.openingTime.value) * 1000).getUTCMonth() + 1,
                  new Date(parseInt(grantFormData.openingTime.value) * 1000).getUTCDate(),
                  new Date(parseInt(grantFormData.openingTime.value) * 1000).getUTCHours(),
                  new Date(parseInt(grantFormData.openingTime.value) * 1000).getUTCMinutes(),
                  new Date(parseInt(grantFormData.openingTime.value) * 1000).getUTCSeconds()
                )
              : undefined
          }
          onValueChange={(value: Date | null) => {
            updateForm({
              name: 'openingTime',
              input: value ? Math.floor(value.getTime() / 1000).toString() : '',
            })
          }}
          presets={[
            {
              caption: '+7 days',
              onClick: () => {
                const oneWeekFromNow = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
                updateForm({ name: 'openingTime', input: oneWeekFromNow.toString() })
              },
            },
          ]}
        />
      </div>
      <div className={styles.section}>
        <Heading size="md" className="mb-2">
          Grant Minimum Bond
        </Heading>
        <Input
          placeholder="0.0"
          type="number"
          value={grantFormData.minBond.value}
          onValueChange={(value) => updateForm({ name: 'minBond', input: value })}
          className={styles.input}
        />
      </div>
      {/*  <div className={styles.section}>
        <Heading size="md" className="mb-2">
          Grant Recipient Address
        </Heading>
        <Input
          placeholder="0x..."
          value={grantFormData.recipient.value}
          onValueChange={(value) => updateForm({ name: 'recipient', input: value })}
          className={styles.input}
        />
        {grantFormData.recipient.message && (
          <div className={styles.error}>{grantFormData.recipient.message}</div>
        )}
      </div> */}
    </>
  )
}
