import Link from "next/link";
import Image from "next/image";

export default function Card({
  title,
  desc,
  href,
  tag,
  image,
  imageAlt,
  cta = "Join waitlist →",
}: {
  title: string;
  desc: string;
  href: string;
  tag?: string;
  image?: string;
  imageAlt?: string;
  cta?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col bg-white shadow-sm transition hover:shadow-md"
    >
      {/* Optional image — matches the review card pattern */}
      {image && (
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Body — keeps padding regardless of image presence */}
      <div className="flex flex-1 flex-col p-6">
        {tag && (
          <span className="mb-4 inline-block self-start bg-accent-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-700">
            {tag}
          </span>
        )}
        <h3 className="font-display text-xl font-bold uppercase leading-tight text-brand-900 transition group-hover:text-brand-600 md:text-2xl">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-neutral-600">{desc}</p>
        <p className="mt-5 text-sm font-semibold text-brand-500 group-hover:text-brand-700">
          {cta}
        </p>
      </div>
    </Link>
  );
}
