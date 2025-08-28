import { useEffect, useState } from "react";
import { Button, Modal } from "@components/ui";
import { api } from "@services/api";
import { AbForm } from "@features/shortlink/components";
import { Link } from "react-router-dom";

export const AbLinkPage = () => {
  const [code, setCode] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLinks() {
    try {
      const { data } = await api.get("/links/ab");
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

  return (
    <div>
      <Button onClick={() => setOpen(true)}>+ Create AB Link</Button>
      <div className="overflow-hidden rounded-lg border mt-4 bg-white">
        {loading ?
          (
            <div className="p-6 text-sm text-gray-500">Loading…</div>
          ) : links.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No links yet.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left font-medium">Slug</th>
                  <th className="px-3 py-2 text-left font-medium">Versions</th>
                  <th className="px-3 py-2 text-left font-medium">Description</th>
                  <th className="px-3 py-2 text-left font-medium">Visits</th>
                  <th className="px-3 py-2 text-left font-medium w-36">Created</th>
                </tr>
              </thead>
              <tbody>
                {links.map((l) => (
                  <tr key={l.id} className="border-b last:border-0">
                    <td className="px-3 py-2 font-mono">
                      <Link to={`/${l.slug}`} target="_blank" className="bg-indigo-500 rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-blue-400">{l.slug}</Link>
                    </td>
                    <td className="px-3 py-2 capitalize flex gap-2 font-medium text-sky-600 dark:text-indigo-400">
                      {(l.redirect as Variations[]).map((v) => (
                        <Link key={v.id} to={v.redirect} target="_blank" className="capitalize hover:underline">{v.name}</Link>
                      ))}
                    </td>
                    <td className="px-3 py-2 capitalize">{l.description}</td>
                    <td className="px-3 py-2 capitalize">{l.hits}</td>
                    <td className="px-3 py-2 text-gray-500">
                      {l.created ? new Date(l.created).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
      {code && (
        <div className="mt-4 rounded border bg-white p-4 shadow">
          <p className="text-sm">Created Ab Split Test:</p>
          <code className="text-indigo-600">
            {window.location.origin}/{code}
          </code>
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} titleId="create-link-title">
        {({ close }) => (
          <>
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 id="create-link-title" className="text-base font-semibold">Create AB Link</h2>
              <button onClick={close} className="p-1 rounded hover:bg-gray-100">✕</button>
            </div>
            <AbForm
              onCreated={() => {
                setCode;
                close();
                fetchLinks();
              }}
            />
          </>
        )}
      </Modal>
    </div>
  );
}
