"use client";

import { localPostService } from './post-service.local';
import { supabasePostService } from './post-service.supabase';
import { Post } from './types';

type PostSubscriber = (posts: Post[]) => void;

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

export const postService = {
  async list(): Promise<Post[]> {
    if (isSupabaseConfigured()) {
      return supabasePostService.list();
    }
    return localPostService.list();
  },

  async create(input: { name: string; text: string; imageUrl: string | null }): Promise<Post> {
    if (isSupabaseConfigured()) {
      return supabasePostService.create(input);
    }
    return localPostService.create(input);
  },

  async uploadImage(file: File): Promise<string> {
    if (isSupabaseConfigured()) {
      return supabasePostService.uploadImage(file);
    }
    // For local mode, return object URL
    return URL.createObjectURL(file);
  },

  subscribe(cb: PostSubscriber): () => void {
    if (isSupabaseConfigured()) {
      return supabasePostService.subscribe(cb);
    }
    return localPostService.subscribe(cb);
  },

  destroy() {
    if (isSupabaseConfigured()) {
      supabasePostService.destroy();
    }
  }
};
