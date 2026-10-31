"use client";

import { useState } from "react";

interface BrandLogoImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback: React.ReactNode;
}

/**
 * Renders an uploaded brand logo image with automatic fallback to the
 * typography-based logo when the image fails to load (e.g. 404, broken URL).
 * Resets the error state whenever the `src` prop changes.
 */
export function BrandLogoImage({
  src,
  alt,
  className,
  fallback,
}: BrandLogoImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
