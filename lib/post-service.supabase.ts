"use client";

import { supabase } from './supabase-client';
import { Post } from './types';
import { RealtimeChannel } from '@supabase/supabase-js';

type PostSubscriber = (posts: Post[]) => void;

class SupabasePostService {
  private subscribers: Set<PostSubscriber> = new Set();
  private channel: RealtimeChannel | null = null;

  constructor() {
    this.setupRealtimeSubscription();
  }

  private setupRealtimeSubscription() {
    this.channel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        () => {
          // Refresh posts when a new one is inserted
          this.emit();
        }
      )
      .subscribe();
  }

  async list(): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    return data.map(row => ({
      id: row.id,
      name: row.name,
      text: row.text,
      imageUrl: row.image_url,
      createdAt: row.created_at,
    }));
  }

  async create(input: { name: string; text: string; imageUrl: string | null }): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        name: input.name.trim(),
        text: input.text.trim(),
        image_url: input.imageUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      throw new Error(`Failed to create post: ${error.message}`);
    }

    const newPost: Post = {
      id: data.id,
      name: data.name,
      text: data.text,
      imageUrl: data.image_url,
      createdAt: data.created_at,
    };

    // Emit to subscribers (realtime will also trigger this)
    this.emit();
    return newPost;
  }

  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `images/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('wall-uploads')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload photo. Please try again.');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('wall-uploads')
      .getPublicUrl(filePath);

    return publicUrl;
  }

  subscribe(cb: PostSubscriber): () => void {
    this.subscribers.add(cb);
    
    // Initial load
    this.list().then(posts => cb(posts));
    
    return () => {
      this.subscribers.delete(cb);
    };
  }

  private async emit() {
    const posts = await this.list();
    this.subscribers.forEach(cb => cb(posts));
  }

  destroy() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
    }
  }
}

export const supabasePostService = new SupabasePostService();
