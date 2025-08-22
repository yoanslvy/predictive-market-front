import { clsx } from "clsx";
import { FC, HTMLProps, ReactNode } from "react";
import styles from "./Grid.module.scss";

type GridProps = HTMLProps<HTMLDivElement> & {
  className?: string;
  children?: ReactNode | ReactNode[];
};

export const Grid: FC<GridProps> = ({ className, children }) => {
  return <div className={clsx(styles.container, className)}>{children}</div>;
};
