import * as React from "react";
import Image from "next/image";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: number; // px
  className?: string;
};

export function Avatar({ src, alt = "", size = 64, className = "" }: AvatarProps) {
  const dimension = size;
  return (
    <div
      className={`relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-600 shadow-sm ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <Image
        src={src || "/me-placeholder.jpg"}
        alt={alt}
        fill
        sizes={`${dimension}px`}
        className="object-cover"
      />
    </div>
  );
}


