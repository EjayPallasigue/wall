"use client";

import { LOCAL_STORAGE_KEY, Post } from "./types";

type PostSubscriber = (posts: Post[]) => void;

function readPostsFromLocalStorage(): Post[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p) =>
      p && typeof p === "object" && typeof (p as any).id === "string"
    ) as Post[];
  } catch {
    return [];
  }
}

function writePostsToLocalStorage(posts: Post[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
}

class LocalPostService {
  private subscribers: Set<PostSubscriber> = new Set();
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel("wall:posts:channel");
      this.channel.onmessage = (ev) => {
        if (ev?.data === "refresh-posts") {
          this.emit(this.list());
        }
      };
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === LOCAL_STORAGE_KEY) {
          this.emit(this.list());
        }
      });
    }
  }

  list(): Post[] {
    const posts = readPostsFromLocalStorage();
    return posts
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  create(input: { name: string; text: string; imageUrl: string | null }): Post {
    const newPost: Post = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      text: input.text.trim(),
      imageUrl: input.imageUrl,
      createdAt: new Date().toISOString(),
    };
    const posts = readPostsFromLocalStorage();
    posts.push(newPost);
    writePostsToLocalStorage(posts);
    this.emit(this.list());
    if (this.channel) this.channel.postMessage("refresh-posts");
    return newPost;
  }

  subscribe(cb: PostSubscriber): () => void {
    this.subscribers.add(cb);
    // initial emit
    cb(this.list());
    return () => {
      this.subscribers.delete(cb);
    };
  }

  private emit(posts: Post[]) {
    this.subscribers.forEach((cb) => cb(posts));
  }
}

export const localPostService = new LocalPostService();


