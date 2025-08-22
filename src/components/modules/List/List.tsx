import clsx from "clsx";
import { FC, ReactNode } from "react";
import styles from "./List.module.scss";

type ListProps = {
  className?: string;
  children?: ReactNode | ReactNode[];
};

export const List: FC<ListProps> = ({ className, children }) => {
  if (!children) {
    return null;
  }

  const childrenArr = Array.isArray(children) ? children : [children];

  return (
    <div className={clsx(styles.container, className)}>
      <ul className={styles.list}>
        {childrenArr.map((child, idx) => {
          return (
            <li className={styles.item} key={idx}>
              {child}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
