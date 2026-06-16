import { useEffect, useState } from "react";
import { Button, Modal } from "@components/ui";
import { api } from "@services/api";
import { RedirectForm } from "@features/shortlink/components";
import { Link } from "react-router-dom";
import { Link as LinkIcon, Plus, Copy, Check, X } from "lucide-react";

export const RedirectLinkPage = () => {
  const [code, setCode] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  async function fetchLinks() {
    try {
      const { data } = await api.get("/links/redirect");
      setLinks(data);
    } catch (e) {
      console.error("Failed to load links", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCopy = (slugText: string) => {
    const fullUrl = `${window.location.origin}/${slugText}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedSlug(slugText);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            Simple Redirects
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure direct target links mapped to short custom slugs.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Create Link</span>
        </Button>
      </div>

      {/* Success Notification for Newly Created Link */}
      {code && (
        <div className="p-4 rounded-2xl border border-lime-brand/25 bg-lime-brand/5 backdrop-blur-md flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-lime-brand/10 text-lime-brand border border-lime-brand/20 flex items-center justify-center">
              <LinkIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Redirect Link Created</p>
              <code className="text-xs font-mono font-bold text-foreground">
                {window.location.origin}/{code}
              </code>
            </div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/${code}`);
              const prevCode = code;
              setCode(null); // dismiss
              alert("Copied to clipboard: " + `${window.location.origin}/${prevCode}`);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-brand text-primary-foreground hover:scale-105 transition-all shadow-sm cursor-pointer"
            aria-label="Copy created URL"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Links Data Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/65 backdrop-blur-md shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-lime-brand border-t-transparent" />
            <p className="mt-2 font-medium">Fetching redirect configuration...</p>
          </div>
        ) : links.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground font-medium">
            No redirect links created yet. Click the button above to set your first link.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hits</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-48">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground w-16">Copy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {links.map((l) => (
                  <tr key={l.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3.5 font-mono">
                      <Link
                        to={`/${l.slug}`}
                        target="_blank"
                        className="inline-flex items-center justify-center font-mono font-bold tracking-tight rounded-xl px-2.5 py-1 text-xs text-lime-brand bg-lime-brand/10 border border-lime-brand/20 hover:bg-lime-brand/20 transition-all duration-200"
                      >
                        /{l.slug}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-foreground font-medium max-w-xs truncate">{l.description || "—"}</td>
                    <td className="px-4 py-3.5 text-foreground font-bold">{l.hits ?? 0}</td>
                    <td className="px-4 py-3.5 text-muted-foreground font-medium">
                      {l.created ? new Date(l.created).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" }) : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleCopy(l.slug)}
                        className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
                        title="Copy short link"
                      >
                        {copiedSlug === l.slug ? (
                          <Check className="h-4 w-4 text-lime-brand" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} titleId="create-link-title">
        {({ close }) => (
          <>
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
              <h2 id="create-link-title" className="font-display text-lg font-bold text-foreground">
                Create Redirect Link
              </h2>
              <button
                onClick={close}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <RedirectForm
              onCreated={(newCode) => {
                setCode(newCode);
                close();
                fetchLinks();
              }}
            />
          </>
        )}
      </Modal>
    </div>
  );
};
