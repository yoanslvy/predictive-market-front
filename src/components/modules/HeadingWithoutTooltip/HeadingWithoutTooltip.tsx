import clsx from "clsx";
import { createElement, FC, ReactNode } from "react";
import styles from "./HeadingWithoutTooltip.module.scss";
import Tooltip from '@images/icons/tooltip.svg'

type HeadingSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl";

type HeadingProps = {
  className?: string;
  title?: ReactNode;
  children?: ReactNode;
  subtitle?: ReactNode;
  size?: HeadingSize;
  tooltip?: string
  gap?: string
};

const HeadingElement: Record<HeadingSize, string> = {
  xxs: "strong",
  xs: "h6",
  sm: "h5",
  md: "h4",
  lg: "h3",
  xl: "h2",
};

export const HeadingWithoutTooltip: FC<HeadingProps> = ({
  className,
  title,
  subtitle,
  size = "sm",
  tooltip,
  gap = "xxs",
  children,
}) => {
  return (
    <div className={clsx(styles.container, styles[size], className)}>
      {createElement(
        HeadingElement[size],
        { className: styles.title },
        title || children,
      )}
      {tooltip && (
        <div data-tooltip-id="app-tooltip" data-tooltip-html={tooltip} className={styles.tooltip}>
          <Tooltip />
        </div>
      )}
      {!!subtitle && <span className={styles.subtitle}>{subtitle}</span>}
    </div>
  );
};
