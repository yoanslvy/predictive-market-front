import clsx from "clsx";
import { CSSProperties, FC, ReactElement, ReactNode } from "react";
import styles from "./Asided.module.scss";

export type AsidedPops = {
  className?: string;
  children: ReactElement | [ReactElement, ReactNode];
};

export const Asided: FC<AsidedPops> = ({ className, children }) => {
  const main = Array.isArray(children) ? children[0] : children;
  const aside = Array.isArray(children) && children[1] ? children[1] : null;

  return (
    <div className={clsx(styles.container, className)}>
      <main className={styles.main}>{main}</main>
      <aside className={styles.aside}>{aside}</aside>
    </div>
  );
};
