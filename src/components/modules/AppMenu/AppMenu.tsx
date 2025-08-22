'use client'

import clsx from "clsx";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import styles from "./AppMenu.module.scss";
import { AppMenuSections } from "./constants";
import { useAccount } from 'wagmi'
import { UrlObject } from "url";

export type AppMenuProps = {
  className?: string;
  searchParams?: Record<string, string>;
};

export const AppMenu: FC<AppMenuProps> = ({ className, searchParams = {} }) => {
  const { address, chain } = useAccount();

  const [getAddress, setAddress] = useState<string | undefined>();
  const [getNetwork, setNetwork] = useState<string | undefined>();

  useEffect(() => {
    setAddress(address);
    setNetwork(chain?.id.toString());
  }, [address, chain]);

  const menuSections = AppMenuSections(getAddress, getNetwork);

  return (
    <div className={clsx(styles.container, className)}>
      {menuSections.map((section, sectionIndex) => (
        <nav className={styles.section} key={`section-${sectionIndex}`}>
          <strong className={styles.sectionTitle}>{section.title}</strong>
          <ul className={styles.list}>
            {section.items.map((item, itemIndex) => {
              const href: UrlObject = {
                pathname: item.pathname,
                query: {
                  ...searchParams,
                  ...(item.query || {}),
                },
              };

              return (
                <li className={styles.item} key={`item-${itemIndex}`}>
                  <Link href={href} className={styles.link}>
                    <span className={styles.linkIcon}>{item.icon}</span>
                    <span className={styles.linkContent}>
                      <strong className={styles.linkTitle}>{item.title}</strong>
                      <span className={styles.linkDescription}>{item.description}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ))}
    </div>
  );
};

export default AppMenu;