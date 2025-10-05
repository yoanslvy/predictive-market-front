'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SearchPage() {

  const router = useRouter();

  useEffect(() => {
    if (window?.history?.length >= 1) {
      router.back();
    } else {
      router.push("/vesting-v2/explore/tokens");
    }
  }, [router]);


  return null
}


