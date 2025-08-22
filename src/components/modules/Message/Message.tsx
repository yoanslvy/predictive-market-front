import IconInfo from "@images/emoji/bulb.svg";
import IconDanger from "@images/emoji/danger.svg";
import IconPrompt from "@images/emoji/gear.svg";
import IconSuccess from "@images/emoji/lock.svg";
import IconWarn from "@images/emoji/warn.svg";
import clsx from "clsx";
import { FC, ReactNode } from "react";
import styles from "./Message.module.scss";

type MessageType = "success" | "danger" | "warn" | "prompt" | "info";

type MessageProps = {
  title?: ReactNode;
  text?: ReactNode;
  type?: MessageType;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
};

const MessageIcons: Record<MessageType, ReactNode> = {
  success: <IconSuccess />,
  danger: <IconDanger />,
  warn: <IconWarn />,
  prompt: <IconPrompt />,
  info: <IconInfo />,
};

export const Message: FC<MessageProps> = ({
  title,
  text,
  type = "info",
  icon,
  children,
  className,
}) => {
  const textDisplay = text || children;
  return (
    <div
      className={clsx(styles.container, { [styles[type]]: !!type }, className)}
    >
      <span className={styles.icon}>{icon || MessageIcons[type]}</span>
      {!!title && <h5 className={styles.title}>{title}</h5>}
      {!!textDisplay && <span className={styles.text}>{text || children}</span>}
    </div>
  );
};
