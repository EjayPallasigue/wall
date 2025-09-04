"use client";

import { useMemo, useRef, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { postService } from "@/lib/post-service";
import { useToast } from "./toast-provider";

const MAX_LEN = 280;

export function Composer() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const { showToast } = useToast();

  const remaining = useMemo(() => MAX_LEN - text.length, [text.length]);

  function resetForm() {
    setText("");
    setImageFile(null);
    if (inputRef.current) inputRef.current.focus();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!text.trim()) {
      showToast({ message: "Please enter a message.", variant: "destructive" });
      return;
    }
    if (text.length > MAX_LEN) {
      showToast({ message: "Message must be 280 characters or fewer.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        try {
          imageUrl = await postService.uploadImage(imageFile);
        } catch {
          showToast({ message: "Failed to upload photo. Please try again.", variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
      }

      await postService.create({ name: name || "Anonymous", text, imageUrl });
      resetForm();
      showToast({ message: "Shared!", variant: "success" });
    } catch (error) {
      showToast({ message: `Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar size={40} alt="You" />
            <Input
              placeholder="What's your name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1"
            />
          </div>
          <Textarea
            ref={inputRef}
            placeholder="What's on your mind?"
            value={text}
            maxLength={MAX_LEN}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                <span>Photo</span>
              </label>
              {imageFile ? (
                <span className="text-gray-600 dark:text-gray-400 text-xs">{imageFile.name}</span>
              ) : null}
            </div>
            <span className={remaining < 0 ? "text-red-500" : "text-gray-400"}>{remaining}</span>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !text.trim()} className="px-6">
              {isSubmitting ? "Sharing..." : "Share"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


