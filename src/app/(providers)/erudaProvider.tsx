"use client";


import { useEffect } from 'react';
import { ReactNode } from 'react';

export default function ErudaProvider({ children }: { children: ReactNode }) {
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     (async () => {
  //       const eruda = await import('eruda');
  //       eruda.default.init();
  //     })();
  //   }
  // }, []);

  return <>{children}</>;
}