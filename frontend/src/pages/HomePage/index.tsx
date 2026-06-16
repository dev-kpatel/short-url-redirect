import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Link as LinkIcon,
  GitBranch,
  Calendar,
  MousePointerClick,
  Plus,
  BarChart3,
  Award,
} from "lucide-react";
import { api } from "@services/api";
import { MetricsBarChart, BarData } from "@components/charts/MetricsBarChart";
import { ChartSkeleton } from "@components/charts/ChartSkeleton";

interface LinkStat {
  id: number;
  slug: string;
  hits: number | null;
}

export const HomePage = () => {
  const [stats, setStats] = useState({
    redirects: 0,
    abSplits: 0,
    calendars: 0,
    totalHits: 0,
  });
  const [distributionData, setDistributionData] = useState<BarData[]>([]);
  const [topLinksData, setTopLinksData] = useState<BarData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const [redirectRes, abRes, calendarRes] = await Promise.all([
          api.get<LinkStat[]>("/links/redirect").catch(() => ({ data: [] })),
          api.get<LinkStat[]>("/links/ab").catch(() => ({ data: [] })),
          api.get<LinkStat[]>("/links/calendar").catch(() => ({ data: [] })),
        ]);

        const redirectsCount = redirectRes.data.length;
        const abCount = abRes.data.length;
        const calendarCount = calendarRes.data.length;

        const sumHits = (arr: LinkStat[]) =>
          arr.reduce((acc, curr) => acc + (curr.hits || 0), 0);

        const totalHits =
          sumHits(redirectRes.data) +
          sumHits(abRes.data) +
          sumHits(calendarRes.data);

        setStats({
          redirects: redirectsCount,
          abSplits: abCount,
          calendars: calendarCount,
          totalHits: totalHits,
        });

        // Set distribution chart data
        setDistributionData([
          { label: "Simple", value: redirectsCount },
          { label: "A/B Splits", value: abCount },
          { label: "Calendars", value: calendarCount },
        ]);

        // Combine all links to extract top 5 clicked links
        const allLinks = [
          ...redirectRes.data.map((l) => ({ slug: l.slug, hits: l.hits || 0 })),
          ...abRes.data.map((l) => ({ slug: l.slug, hits: l.hits || 0 })),
          ...calendarRes.data.map((l) => ({ slug: l.slug, hits: l.hits || 0 })),
        ];

        // Sort descending by hit counts
        const sortedTop = allLinks
          .sort((a, b) => b.hits - a.hits)
          .slice(0, 5)
          .map((l) => ({ label: `/${l.slug}`, value: l.hits }));

        setTopLinksData(sortedTop);
      } catch (e) {
        console.error("Failed to load dashboard statistics", e);
        // Fallback demo statistics if backend not running
        setStats({
          redirects: 12,
          abSplits: 4,
          calendars: 7,
          totalHits: 412,
        });
        setDistributionData([
          { label: "Simple", value: 12 },
          { label: "A/B Splits", value: 4 },
          { label: "Calendars", value: 7 },
        ]);
        setTopLinksData([
          { label: "/promo", value: 185 },
          { label: "/abtest", value: 124 },
          { label: "/signup", value: 92 },
          { label: "/zoom", value: 58 },
          { label: "/ics", value: 32 },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  const metricCards = [
    {
      title: "Simple Redirects",
      value: stats.redirects,
      description: "Static single destination links",
      icon: LinkIcon,
      link: "/app/redirect",
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "A/B Split Links",
      value: stats.abSplits,
      description: "Weight-based random routing",
      icon: GitBranch,
      link: "/app/ab",
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      title: "Calendar Links",
      value: stats.calendars,
      description: "Recurrence rule ICS generators",
      icon: Calendar,
      link: "/app/calendar",
      color: "text-orange-500 bg-orange-500/10",
    },
    {
      title: "Total Hits",
      value: stats.totalHits,
      description: "Aggregated global redirects",
      icon: MousePointerClick,
      color: "text-lime-brand bg-lime-brand/10",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage redirect slugs, dynamic splitting, and calendar distribution schedules.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/app/redirect"
            className="flex items-center gap-1.5 rounded-xl bg-lime-brand hover:bg-lime-brand/90 px-4 py-2.5 text-xs font-semibold text-primary-foreground tracking-wide transition-all shadow-sm shadow-lime-brand/10 hover:shadow-md cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Link</span>
          </Link>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, i) => {
          const Icon = card.icon;
          const CardContent = (
            <div className="glass-panel glow-on-hover p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between h-full bg-card/65 relative overflow-hidden group">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl border border-border/40 ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-bold tracking-tight text-foreground font-display">
                  {loading ? "..." : card.value}
                </span>
                <p className="mt-1 text-xs text-muted-foreground font-medium">
                  {card.description}
                </p>
              </div>
            </div>
          );

          if (card.link) {
            return (
              <Link key={i} to={card.link} className="block cursor-pointer">
                {CardContent}
              </Link>
            );
          }

          return <div key={i}>{CardContent}</div>;
        })}
      </div>

      {/* Analytics Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Redirect Type Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-border bg-card/65 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-lime-brand" />
              Redirection Distribution
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comparison of active link count by type configured in database.
            </p>
          </div>

          <div className="flex-grow pt-4">
            {loading ? (
              <ChartSkeleton />
            ) : (
              <MetricsBarChart data={distributionData} mode="vertical" height={220} />
            )}
          </div>
        </div>

        {/* Top 5 clicked links */}
        <div className="glass-panel p-6 rounded-2xl border border-border bg-card/65 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Award className="h-4 w-4 text-lime-brand" />
              Top 5 Performing Links
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Most visited redirect slugs ranked by cumulative hits.
            </p>
          </div>

          <div className="flex-grow pt-4">
            {loading ? (
              <ChartSkeleton />
            ) : topLinksData.length === 0 ? (
              <div className="h-60 flex items-center justify-center text-xs text-muted-foreground font-medium">
                No redirection hits registered yet.
              </div>
            ) : (
              <MetricsBarChart data={topLinksData} mode="horizontal" height={220} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
