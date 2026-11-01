import Image from "next/image";
import { cn } from "@/lib/utils";

/** 官方 main 透明標誌；位元組原樣保留，維持既有顯示尺寸與樣式。 */
export function LotusMark({ className }: { className?: string }) {
  return (
    <Image src="/lotus-approved.png" width={597} height={597}
      alt="" aria-hidden="true" unoptimized className={cn("object-contain", className)} />
  );
}

export function LotusMarkCompact({ className }: { className?: string }) {
  return (
    <Image src="/lotus-favicon.png" width={192} height={192}
      alt="" aria-hidden="true" unoptimized className={cn("object-contain", className)} />
  );
}

export function LotusDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden="true">
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary/45 sm:w-14" />
      <LotusMarkCompact className="h-4 w-4 shrink-0" />
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary/45 sm:w-14" />
    </div>
  );
}
