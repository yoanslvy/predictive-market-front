
import clsx from "clsx";
import styles from "./ModalMessage.module.scss";

import IconClear from '@images/icons/cross.svg'
import IconOk from '@images/icons/ok.svg'
import IconDelete from '@images/icons/delete.svg'
import LogoSpinner from "../../spinners/logoSpinnerAnimated";
import { WalletStatus } from "@/src/stores/lockers-v2/useLockFormStore";

const icons: Record<WalletStatus, any> = {
  'Success': <IconOk />,
  'Error': <IconClear />,
  'Delete': <IconDelete />,
  'AwaitingConfirmation': undefined,
  'AwaitingSignature': undefined,
  'LockConfirmationDisplay': undefined
};

export default function ModalMessageIcon({ status}: { status: WalletStatus }) {
  if(status === WalletStatus.AwaitingConfirmation || status === WalletStatus.AwaitingSignature){
    return <div className="flex rounded-full bg-zinc-950/30 justify-center items-center h-28 w-28"><LogoSpinner /></div>
  }

  return <div className={clsx(styles.icon, styles[status.toLowerCase()])}>{icons[status]}</div>
}