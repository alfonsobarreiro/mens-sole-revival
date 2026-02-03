export function Card({
  title,
  desc,
  href,
  linkText = "Join this kit waitlist →",
}: {
  title: string;
  desc: string;
  href: string;
  linkText?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-700">{desc}</p>
      <a
        href={href}
        className="mt-4 inline-flex text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700"
      >
        {linkText}
      </a>
    </div>
  );
}
