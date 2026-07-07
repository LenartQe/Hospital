import { useState } from "react";

/**
 * Renders an img that steps through `sources` on load error.
 */
export default function FallbackImage({ sources, alt, className, loading = "lazy" }) {
  const list = Array.isArray(sources) ? sources.filter(Boolean) : [sources].filter(Boolean);
  const [idx, setIdx] = useState(0);

  if (list.length === 0) return null;

  return (
    <img
      src={list[Math.min(idx, list.length - 1)]}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (idx < list.length - 1) setIdx((i) => i + 1);
      }}
    />
  );
}
