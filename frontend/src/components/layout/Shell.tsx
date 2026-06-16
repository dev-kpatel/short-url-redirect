import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header, Navigation } from "./";

const useRouteTitle = (pathname: string) => {
  const rules: Array<{ pattern: RegExp; title: string }> = [
    { pattern: /^\/$/, title: "Dashboard Analytics" },
    { pattern: /^\/app\/redirect$/, title: "Redirect Management" },
    { pattern: /^\/app\/ab$/, title: "A/B Experimentation" },
    { pattern: /^\/app\/calendar$/, title: "Calendar Scheduling" },

    // dynamic public routes
    { pattern: /^\/ab\/[^/]+$/, title: "A/B Redirect" },
    { pattern: /^\/c\/[^/]+\/[^/]+$/, title: "Calendar Redirect" },
    { pattern: /^\/[^/]+$/, title: "Redirect" },
  ];

  const hit = rules.find(r => r.pattern.test(pathname));
  return hit?.title ?? "Short URL Redirect";
}

export const Shell = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const title = useRouteTitle(pathname);
  useEffect(() => { document.title = title; }, [title]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navigation />
      <Header title={title} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="fade-in duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
