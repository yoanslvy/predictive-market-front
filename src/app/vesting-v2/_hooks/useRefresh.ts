import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function useRefresh() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const refresh = () =>
    startTransition(() => {
      router.refresh();
    });

  return { isPending, refresh };
}
