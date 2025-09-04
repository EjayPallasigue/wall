export type Post = {
  id: string;
  name: string;
  text: string;
  imageUrl: string | null;
  createdAt: string; // ISO string
};

export const LOCAL_STORAGE_KEY = "wall:posts";

export function isPost(value: unknown): value is Post {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.text === "string" &&
    (typeof p.imageUrl === "string" || p.imageUrl === null) &&
    typeof p.createdAt === "string"
  );
}

