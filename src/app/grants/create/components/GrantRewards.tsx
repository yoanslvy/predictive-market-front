import styles from '@/src/components/modules/GrantForm/GrantForm.module.scss'
import Heading from '@/src/components/modules/Heading'
import Input from '@/src/components/modules/Input'
import { useGrantFormStore } from '@/src/stores/grants/useGrantFormStore'

export function GrantRewards() {
  const { grantFormData, updateForm, updateBooleans, clearForm, isFormValid } = useGrantFormStore()

  return (
    <>
      <div className={styles.section}>
        <Heading size="md" className="mb-2">
          Reward Token
        </Heading>
        <Input
          placeholder="0x..."
          value={grantFormData.collateralToken.value}
          onValueChange={(value) => updateForm({ name: 'collateralToken', input: value })}
          className={styles.input}
        />
        {grantFormData.collateralToken.message && (
          <div className={styles.error}>{grantFormData.collateralToken.message}</div>
        )}
      </div>

      <div className={styles.section}>
        <Heading size="md" className="mb-2">
          Reward Amount
        </Heading>
        <Input
          placeholder="0.0"
          type="number"
          value={grantFormData.amount.value}
          onValueChange={(value) => updateForm({ name: 'amount', input: value })}
          className={styles.input}
        />
        {grantFormData.amount.message && (
          <div className={styles.error}>{grantFormData.amount.message}</div>
        )}
      </div>
    </>
  )
}
