"use client";

import { OverlayProvider } from "@react-aria/overlays";
import React from "react";

export default function AdobeAriaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OverlayProvider>{children}</OverlayProvider>
      {/* </OverlayContainer> */}
    </>
  );
}
