"use client";

import { useEffect, useState } from "react";
import { postService } from "@/lib/post-service";
import type { Post } from "@/lib/types";
import { PostCard } from "./post-card";

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    return postService.subscribe(setPosts);
  }, []);

  if (posts.length === 0) {
    return (
      <div className="text-center text-sm text-zinc-500 py-8">No posts yet. Be the first!</div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}


