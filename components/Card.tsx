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
      className="group flex flex-col rounded-lg border border-neutral-200 bg-white p-6 transition hover:border-brand-300 hover:shadow-sm"
    >
      {tag && (
        <span className="mb-3 inline-block self-start rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
          {tag}
        </span>
      )}
      <h3 className="font-heading text-lg font-semibold text-brand-900 group-hover:text-brand-600">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-neutral-600">{desc}</p>
      <p className="mt-5 text-sm font-semibold text-brand-500 group-hover:text-brand-700">
        Join waitlist →
      </p>
    </Link>
  );
}
