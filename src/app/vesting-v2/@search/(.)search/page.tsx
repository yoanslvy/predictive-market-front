'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SearchPage() {

	const router = useRouter();


	useEffect(() => {
		router.replace('/vesting-v2/search/tokens');
	}, [router]);


	return null

	// redirect('/lockers/explore/pools')
}


