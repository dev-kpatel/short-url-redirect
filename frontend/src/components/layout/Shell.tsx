import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header, Navigation } from "./";

 const useRouteTitle = (pathname: string) => {
  const rules: Array<{ pattern: RegExp; title: string }> = [
    { pattern: /^\/$/, title: "Dashboard" },
    { pattern: /^\/app\/redirect$/, title: "Redirect" },
    { pattern: /^\/app\/ab$/, title: "A/B Link" },
    { pattern: /^\/app\/calendar$/, title: "Calendar Link" },

    // dynamic public routes
    { pattern: /^\/ab\/[^/]+$/, title: "A/B Redirect" },
    { pattern: /^\/c\/[^/]+\/[^/]+$/, title: "Calendar Redirect" },
    { pattern: /^\/[^/]+$/, title: "Redirect" }, // generic fallback for /:slug
  ];

  const hit = rules.find(r => r.pattern.test(pathname));
  return hit?.title ?? "Short URL Redirect";
}

export const Shell = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const title = useRouteTitle(pathname);
  useEffect(() => { document.title = title; }, [title]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <Header title={title} />
      <main className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
