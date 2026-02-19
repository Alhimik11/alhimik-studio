"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

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
  const words = text.split(" ");
  const elements: ReactNode[] = [];
  let charIndex = 0;

  words.forEach((word, wordIndex) => {
    const chars = Array.from(word);
    const wordStart = charIndex;
    charIndex += chars.length;

    elements.push(
      // eslint-disable-next-line react/no-array-index-key
      <span key={`w${wordIndex}`} className="inline-block whitespace-nowrap">
        {chars.map((char, ci) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={ci}
            className="inline-block opacity-0 [animation-play-state:running] motion-safe:animate-reveal-letter"
            style={{ animationDelay: `${startDelay + (wordStart + ci) * step}s` }}
            aria-hidden="true"
          >
            {char}
          </span>
        ))}
      </span>,
    );

    if (wordIndex < words.length - 1) {
      elements.push(
        // eslint-disable-next-line react/no-array-index-key
        <span
          key={`s${wordIndex}`}
          className="opacity-0 [animation-play-state:running] motion-safe:animate-reveal-letter"
          style={{ animationDelay: `${startDelay + charIndex * step}s` }}
          aria-hidden="true"
        >
          {" "}
        </span>,
      );
      charIndex += 1;
    }
  });

  return (
    <Tag className={className} aria-label={text} {...rest}>
      {elements}
    </Tag>
  );
}
