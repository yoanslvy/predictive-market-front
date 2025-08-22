import clsx from "clsx";
import { CSSProperties, FC, ReactNode } from "react";
import { XAxisProps, YAxisProps } from "recharts";
import Heading from "../Heading";
import styles from "./ChartTooltip.module.scss";

export type ChartTooltipEntry = {
  title: ReactNode;
  value: ReactNode;
  color?: string;
  icon?: ReactNode;
};

export type ChartTooltipProps = {
  title?: ReactNode;
  entries?: ChartTooltipEntry[];
  children?: ReactNode;
};

const ChartTooltip: FC<ChartTooltipProps> = ({ title, entries, children }) => {
  if (!entries && !children) {
    return null;
  }

  return (
    <div className={styles.container}>
      {!!title && <Heading size="xs" title={title} className={styles.title} />}
      {!!entries?.length && (
        <table className={styles.values}>
          <tbody className={styles.list}>
            {entries.map((item, idx) => {
              return (
                <tr
                  key={idx}
                  className={styles.item}
                  style={{ "--color": item.color } as CSSProperties}
                >
                  <td
                    className={clsx(styles.indicator, {
                      [styles.hasColor]: !!item.color,
                      [styles.hasIcon]: !!item.icon,
                    })}
                  >
                    {!!item.icon && (
                      <span className={styles.icon}>{item.icon}</span>
                    )}
                  </td>
                  <td className={styles.value}>{item.value}</td>
                  <td className={styles.key}>{item.title}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {children}
    </div>
  );
};

export default ChartTooltip;
