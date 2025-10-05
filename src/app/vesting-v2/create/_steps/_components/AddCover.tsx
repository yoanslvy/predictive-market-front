/* eslint-disable @next/next/no-img-element */

import { CoverPreview } from "../../../_components/CoverPreview";

export function AddCover({
  coverUrl,
  setCoverUrl,
  logoUrl,
  setLogoUrl,
}: {
  coverUrl: string | null;
  setCoverUrl: (url: string) => void;
  logoUrl: string | null;
  setLogoUrl: (url: string) => void;
}) {
  return (
    <div className="w-full max-w-[700px]">
      <CoverPreview
        coverUrl={coverUrl}
        setCoverUrl={setCoverUrl}
        logoUrl={logoUrl}
        setLogoUrl={setLogoUrl}
        floatingElement={
          <div className="absolute left-0 py-[2px] top-0 m-[1rem] rounded-xl bg-black px-[16px] text-white">
            Preview Image
          </div>
        }
      />
    </div>
  );
}
