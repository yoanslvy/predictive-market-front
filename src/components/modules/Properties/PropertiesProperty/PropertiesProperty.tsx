import clsx from "clsx";
import { FC, ReactNode } from "react";
import styles from "../Properties.module.scss";

export type PropertySize = "sm" | "md" | "lg";

export type PropertyProps = {
  size?: PropertySize;
  title: ReactNode;
  value?: ReactNode;
  className?: string;
  children?: ReactNode | ReactNode[];
};

export const Property: FC<PropertyProps> = ({
  size = "md",
  className,
  title,
  value,
  children,
}) => {
  return (
    <div className={clsx(styles.property, styles[size], className)}>
      <strong className={styles.title}>{title}</strong>{" "}
      <span className={styles.value}>{value || children}</span>
    </div>
  );
};
