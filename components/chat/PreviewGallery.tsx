import AskChat from "./AskChat";
import { previewSnapshot } from "./preview";
import { PREVIEW_STATES } from "./types";

/** Every /ask state on one page, for design review. Never rendered in production. */
export default function PreviewGallery() {
  return (
    <div className="space-y-16">
      {PREVIEW_STATES.map((state) => (
        <div key={state}>
          <p className="mb-3 font-mono text-xs text-neutral-600">?state={state}</p>
          <AskChat initial={previewSnapshot(state)} />
        </div>
      ))}
    </div>
  );
}
