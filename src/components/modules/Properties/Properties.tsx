import clsx from "clsx";
import { FC } from "react";
import List from "../List";
import styles from "./Properties.module.scss";
import Property from "./PropertiesProperty";
import {
  PropertyProps,
  PropertySize,
} from "./PropertiesProperty/PropertiesProperty";

type PropertiesProps = {
  size?: PropertySize;
  className?: string;
  items: PropertyProps[];
};

export const Properties: FC<PropertiesProps> = ({ className, items, size }) => {
  if (!items?.length) {
    return null;
  }

  return (
    <List className={clsx(styles.container, className)}>
      {items.map((item, idx) => {
        return (
          <Property
            {...item}
            size={size}
            className={clsx(styles.item, item.className)}
            key={idx}
          />
        );
      })}
    </List>
  );
};
