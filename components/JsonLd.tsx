// Renders one or more JSON-LD structured-data blocks. Server-safe (no client
// hooks), so it can be dropped into any layout or server page. Each schema
// object is emitted as its own <script type="application/ld+json">.
type Schema = Record<string, unknown>;

export default function JsonLd({ schema }: { schema: Schema | Schema[] }) {
  const blocks = Array.isArray(schema) ? schema : [schema];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Structured data is trusted, internally-authored JSON — not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
