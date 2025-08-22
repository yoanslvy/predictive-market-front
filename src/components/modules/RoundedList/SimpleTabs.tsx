"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import styles from "./Tabs.module.scss";
import { Button, ButtonProps, ButtonSize } from "../Button/Button";
import { clsx } from "clsx";

export type TabProps = ButtonProps & { value: string };

export type TabsProps = {
  items: TabProps[];
  className?: string;
  buttonClassName?: string;
  type?: "section" | "switch";
  size?: ButtonSize;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (item: TabProps) => void;
};

export const SimpleTabs: FC<TabsProps> = ({
  className,
  buttonClassName,
  type = "section",
  size,
  items,
  value,
  defaultValue,
  disabled,
  onChange,
}) => {
  const [currentItem, setCurrentItem] = useState<TabProps>();

  useEffect(() => {
    const newCurrentItem = items.find(
      (item) => item.value === (value || defaultValue || items[0]?.value)
    );

    setCurrentItem(newCurrentItem);
  }, [value, defaultValue]);

  const handleItemClick = (item: TabProps): void => {
    setCurrentItem(item);
    onChange?.(item);
  };

  return (
    <nav
      className={clsx(styles.container, { [styles[type]]: !!type }, className)}
    >
      <ul className={styles.list}>
        {items.map((item, idx) => {
          const {
            isActive,
            value: itemValue,
            className: itemClassName,
            ...props
          } = item;

          const classProp = clsx(
            styles.tab,
            { [styles.active]: isActive || currentItem?.value === itemValue },
            buttonClassName,
            itemClassName
          );

          return (
            <li className={styles.item} key={idx}>
              <Button
                type="link"
                size={size}
                {...props}
                isActive={currentItem?.value === item.value}
                isDisabled={disabled || item.isDisabled}
                className={classProp}
                onClick={(e): void => {
                  handleItemClick(item);
                }}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
