import { api } from "@services/api";

export const validateSlug = async (value: string) => {
  if (!value) return true;
  if(value.length < 3 || value.length > 7) return true;
  try {
    const res = await api.get(`/links/slug/${value}/available`);
    return res.data.available || "This slug is already taken";
  } catch {
    return "Could not validate slug";
  }
};