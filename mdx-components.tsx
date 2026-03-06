import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { tokens } from "./styles/tokens";
import { recipes } from "./styles/recipes";
import Callout from "./components/mdx/Callout";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

type ImgProps = ComponentProps<typeof Image> & {
  caption?: ReactNode;
  className?: string;
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ className, ...props }) => (
      <h1 className={cx(tokens.text.h1, className)} {...props} />
    ),
    h2: ({ className, ...props }) => (
      <h2 className={cx(tokens.text.h2, className)} {...props} />
    ),
    h3: ({ className, ...props }) => (
      <h3 className={cx(tokens.text.h3, className)} {...props} />
    ),

    p: ({ className, ...props }) => (
      <p
        className={cx(tokens.text.body, tokens.color.body, className)}
        {...props}
      />
    ),

    a: ({ href = "", className, ...props }) => {
      const isInternal = href.startsWith("/");
      if (isInternal) {
        return (
          <Link
            href={href}
            className={cx(recipes.link, className)}
            {...props}
          />
        );
      }
      return (
        <a
          href={href}
          className={cx(recipes.link, className)}
          target="_blank"
          rel="noreferrer"
          {...props}
        />
      );
    },

    hr: ({ className, ...props }) => (
      <hr className={cx(recipes.hr, className)} {...props} />
    ),

    Img: ({ caption, className, alt, ...imageProps }: ImgProps) => (
      <figure className="my-8">
        <div
          className={cx(
            "overflow-hidden rounded-xl border",
            tokens.color.border,
            tokens.color.bg,
            className,
          )}
        >
          <Image alt={alt ?? ""} {...imageProps} />
        </div>
        {caption ? (
          <figcaption className={recipes.caption}>{caption}</figcaption>
        ) : null}
      </figure>
    ),

    Callout,

    InlineCard: ({
      title,
      meta,
      children,
    }: {
      title: string;
      meta?: string;
      children: ReactNode;
    }) => (
      <div className={recipes.inlineCard.base}>
        <div className={recipes.inlineCard.title}>{title}</div>
        <div className={recipes.inlineCard.body}>{children}</div>
        {meta ? <div className={recipes.inlineCard.meta}>{meta}</div> : null}
      </div>
    ),

    ...components,
  };
}
