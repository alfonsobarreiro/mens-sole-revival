import Link from "next/link";

export default function Card({
  title,
  desc,
  href,
  tag,
}: {
  title: string;
  desc: string;
  href: string;
  tag?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-brand-300 hover:shadow-md"
    >
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
        Join waitlist →
      </p>
    </Link>
  );
}
