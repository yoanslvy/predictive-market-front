"use client";

import { prominent } from "color.js";
import Image from "next/image";
import { FC, useEffect, useRef } from "react";
import styles from "./MediaBanner.module.scss";

export type MediaBannerImageProps = {
  img: string;
};

export const MediaBannerImage: FC<MediaBannerImageProps> = ({ img }) => {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const doColor = async () => {
      if (!ref.current) {
        return;
      }

      const palette = await prominent(ref.current, {
        amount: 3,
        format: "array",
        group: 30,
        sample: 20,
      });

      const paletteArr = Array.isArray(palette) ? palette : [palette];

      paletteArr?.forEach((color, idx) => {
        document.documentElement.style.setProperty(
          `--page-decoration-color-${idx + 1}`,
          `${(color as number[]).join(" ")}`,
        );
      });
    };

    if (ref.current.complete) {
      doColor();
    } else {
      ref.current.addEventListener("load", doColor);
    }

    return ref.current.removeEventListener("load", doColor);
  }, [ref.current]);

  return (
    <Image
      src={img}
      alt=""
      className={styles.illustration}
      ref={ref}
      width={640}
      height={240}
    />
  );
};
