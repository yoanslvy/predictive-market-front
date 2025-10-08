import styles from '@/src/components/modules/GrantForm/GrantForm.module.scss'
import Heading from '@/src/components/modules/Heading'
import Input from '@/src/components/modules/Input'
import { useGrantFormStore } from '@/src/stores/grants/useGrantFormStore'

export function Grantee() {
  const { grantFormData, updateForm, updateBooleans, clearForm, isFormValid } = useGrantFormStore()

  return (
    <>
      {/*  <div className={styles.section}>
        <Heading size="md" className="mb-2">
          Chain
        </Heading>
      </div> */}
      <div className={styles.section}>
        <Heading size="md" className="mb-2">
          Grant Recipient Address
        </Heading>
        <Input
          placeholder="0x..."
          value={grantFormData.recipient.value}
          onValueChange={(value) => updateForm({ name: 'recipient', input: value })}
          className={styles.input}
        />
      </div>
    </>
  )
}
