import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const RedirectPage = () => {
  const { slug, t } = useParams<{ slug: string; t?: string }>();

  useEffect(() => {
    if (!slug) return;

    const origin = import.meta.env.VITE_RESOLVER_ORIGIN || window.location.origin;

    // If you use /t/:t/:slug for calendar; otherwise use `/${slug}`
    const target = t
      ? `${origin}/c/${encodeURIComponent(t)}/${encodeURIComponent(slug)}`
      : `${origin}/${encodeURIComponent(slug)}`;

    // Top-level navigation (replaces history entry)
    window.location.replace(target);
    // or: window.location.assign(target);
  }, [slug, t]);

  return <p>Redirecting…</p>;
};
