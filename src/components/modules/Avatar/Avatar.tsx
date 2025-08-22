import clsx from "clsx";
import { FC } from "react";
import styles from "./Avatar.module.scss";
import JazzIcon from "./JazzIcon";
import { AvatarProps } from "./types";
import { jsNumberForAddress } from "./utils";

const Avatar: FC<AvatarProps> = ({ address, letters, className }) => {
  return (
    <div className={clsx(styles.container, className)} data-letters={letters}>
      {!!address && (
        <JazzIcon
          size={32}
          seed={jsNumberForAddress(address)}
          className={styles.icon}
        />
      )}
    </div>
  );
};

export default Avatar;
