"use client";

import type { ComponentPropsWithoutRef } from "react";

type TagName = "h1" | "h2" | "h3" | "p" | "span";

type Props<T extends TagName> = {
  as?: T;
  text: string;
  className?: string;
  startDelay?: number;
  step?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export function TextReveal<T extends TagName = "h2">({
  as,
  text,
  className,
  startDelay = 0,
  step = 0.028,
  ...rest
}: Props<T>) {
  const Tag = (as || "h2") as TagName;

  return (
    <Tag className={className} aria-label={text} {...rest}>
      {Array.from(text).map((char, index) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={`${char}-${index}`}
          className="inline-block opacity-0 [animation-play-state:running] motion-safe:animate-reveal-letter"
          style={{ animationDelay: `${startDelay + index * step}s` }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}
