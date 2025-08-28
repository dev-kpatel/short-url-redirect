import { useEffect, useState } from "react";
import { CalendarForm } from "@features/shortlink/components";
import { Button, Modal } from "@components/ui";
import { api } from "@services/api";
import { Link } from "react-router-dom";

export const CalendarLinkPage = () => {
  const [code, setCode] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function fetchLinks() {
      try {
        const { data } = await api.get("/links/calendar");
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
          <Button onClick={() => setOpen(true)}>+ Create Calendar Link</Button>

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
                    <th className="px-3 py-2 text-left font-medium">Calendar Links</th>
                    <th className="px-3 py-2 text-left font-medium">Description</th>
                    <th className="px-3 py-2 text-left font-medium">Visits</th>
                    <th className="px-3 py-2 text-left font-medium w-36">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((l) => (
                    <tr key={l.id} className="border-b last:border-0">
                      <td className="px-3 py-2 font-mono">{l.slug}</td>
                      <td className="px-3 py-2 capitalize">
                        <span className="flex gap-2">
                          <Link to={`/c/g/${l.slug}`} target="_blank" className="bg-indigo-500 rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-blue-400">Google</Link>
                          <Link to={`/c/o/${l.slug}`} target="_blank" className="bg-indigo-500 rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-blue-400">Outlook</Link>
                          <Link to={`/c/y/${l.slug}`} target="_blank" className="bg-indigo-500 rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-blue-400">Yahoo</Link>
                          <Link to={`/c/d/${l.slug}`} target="_blank" className="bg-indigo-500 rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-blue-400">Download</Link>
                        </span>
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
              <p className="text-sm">Created short URL:</p>
              <code className="text-indigo-600">
                {window.location.origin}/{code}
              </code>
            </div>
          )}

          <Modal open={open} onClose={() => setOpen(false)} titleId="create-link-title">
            {({ close }) => (
              <>
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <h2 id="create-link-title" className="text-base font-semibold">Create Calendar Link</h2>
                  <button onClick={close} className="p-1 rounded hover:bg-gray-100">✕</button>
                </div>
                <CalendarForm
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
