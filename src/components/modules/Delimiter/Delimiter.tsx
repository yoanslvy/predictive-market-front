import clsx from "clsx";
import { FC } from "react";
import styles from "./Delimeter.module.scss";

export type DelimiterProps = {
  className?: string;
  title?: string;
};

export const Delimiter: FC<DelimiterProps> = ({ className, title }) => {
  return <div className={clsx(styles.container, className)}>{title}</div>;
};
