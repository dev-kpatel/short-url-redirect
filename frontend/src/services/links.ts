import { api } from "./api";

export async function createRedirectLink(url: string) {
  const { data } = await api.post("/links/redirect", { url });
  return data;
}
