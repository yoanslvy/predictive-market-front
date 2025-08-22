import { Fragment } from 'react'

import styles from './FormattedDescription.module.scss'

interface FormattedDescriptionProps {
  text: string
}

export const FormattedDescription: React.FC<FormattedDescriptionProps> = ({ text }) => {
  const formattedText = text
    .split('\n')
    .map((line, index) => (
      <Fragment key={index}>
        {line.trim() ? <p className={styles.descriptionLine}>{line.trim()}</p> : <br />}
      </Fragment>
    ))

  return <div className={styles.projectDescription}>{formattedText}</div>
}
