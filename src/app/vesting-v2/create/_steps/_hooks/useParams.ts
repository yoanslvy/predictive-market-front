import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";

export function useParams() {
  const searchParams = useSearchParams();

  const createQueryString = (
    name: string,
    value: string,
    existingParams?: ReadonlyURLSearchParams | string,
    resetExistingParams = false,
  ) => {
    const params = resetExistingParams
      ? new URLSearchParams()
      : new URLSearchParams(
          existingParams ? existingParams.toString() : searchParams.toString(),
        );
    params.set(name, value);
    return params.toString();
  };

  const removeQueryString = (
    name: string,
    existingParams?: ReadonlyURLSearchParams | string,
  ) => {
    const params = new URLSearchParams(
      existingParams ? existingParams.toString() : searchParams.toString(),
    );
    params.delete(name);
    return params.toString();
  };

  return {
    createQueryString,
    removeQueryString,
    searchParams,
  };
}
