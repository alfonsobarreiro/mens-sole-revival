#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# MSR Image Migration Script
# Downloads all Pexels images to public/images/ and updates src references.
#
# Run from the repo root:
#   chmod +x scripts/download-images.sh
#   ./scripts/download-images.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG_DIR="$REPO_ROOT/public/images"
mkdir -p "$IMG_DIR"

echo "📁  Saving images to: $IMG_DIR"
echo ""

# ── Image manifest ────────────────────────────────────────────────────────────
# Format: ID | size | description
declare -a IMAGES=(
  "17979558|1600|homepage-hero-bg"
  "34806666|1000|homepage-compounds-split"
  "7787491|1600|homepage-parallax-cta"
  "4909313|800|routine-daily-nightly"
  "3771071|800|routine-stretch-plantar"
  "8729018|800|routine-recovery-lacrosse"
  "12031206|800|article-dress-shoes"
  "9467290|800|article-big-toe"
  "29145634|800|article-cracked-heels"
  "5960467|800|article-toenail-fungus"
  "13065922|800|article-toe-alignment"
  "7205913|800|article-5min-routine"
  "8637976|1600|about-hero-runner"
  "8980963|800|article-nail-health"
  "35206081|800|article-toe-alignment-2"
  "7047464|800|article-daily-routine"
  "8729236|800|reviews-shoe-close"
  "10904211|800|reviews-insole"
  "13122754|800|reviews-shoe-detail"
  "9767780|800|topics-alignment"
  "15098712|800|topics-skin"
  "33360918|800|topics-routine"
  "11873696|800|topics-fit"
  "7312082|800|topics-nails"
)

# ── Download ──────────────────────────────────────────────────────────────────
for entry in "${IMAGES[@]}"; do
  IFS='|' read -r ID SIZE DESC <<< "$entry"
  FILENAME="pexels-${ID}.jpg"
  DEST="$IMG_DIR/$FILENAME"

  if [ -f "$DEST" ]; then
    echo "  ✅  $FILENAME already exists — skipping"
    continue
  fi

  URL="https://images.pexels.com/photos/${ID}/pexels-photo-${ID}.jpeg?auto=compress&cs=tinysrgb&w=${SIZE}"
  echo "  ⬇️   Downloading $FILENAME ($DESC)..."
  curl -s -L -o "$DEST" "$URL"

  if [ -f "$DEST" ] && [ -s "$DEST" ]; then
    SIZE_KB=$(du -k "$DEST" | cut -f1)
    echo "      → saved (${SIZE_KB}KB)"
  else
    echo "      ⚠️  Failed to download $FILENAME"
  fi
done

echo ""
echo "✅  All downloads complete."
echo ""

# ── Replace Pexels CDN URLs with local paths ──────────────────────────────────
echo "🔄  Updating src references in code..."

# Files to update (exclude node_modules, .git, scripts itself, and dead routes)
FILES_TO_UPDATE=(
  "app/page.tsx"
  "app/about/page.tsx"
  "app/learn/page.tsx"
  "app/reviews/page.tsx"
  "app/routines/page.tsx"
  "app/blog/what-your-dress-shoes-are-doing-to-your-feet/page.tsx"
  "app/blog/big-toe-and-your-whole-body/page.tsx"
  "app/blog/cracked-heels-what-actually-works/page.tsx"
  "app/blog/toenail-fungus-what-works/page.tsx"
  "app/blog/why-toe-alignment-affects-knees-and-hips/page.tsx"
  "app/blog/why-toe-alignment-affects-knees-and-hips/article.mdx"
  "app/blog/5-minute-routine/page.tsx"
  "app/blog/5-minute-routine/article.mdx"
  "components/TopicsSection.tsx"
)

for FILE in "${FILES_TO_UPDATE[@]}"; do
  FULL_PATH="$REPO_ROOT/$FILE"
  if [ ! -f "$FULL_PATH" ]; then
    echo "  ⚠️   Not found: $FILE — skipping"
    continue
  fi

  # Replace every Pexels URL (any size) with the local path
  # Pattern: https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg?...
  # Replacement: /images/pexels-{ID}.jpg

  # Use perl for reliable cross-platform regex replace
  perl -i -pe "s|https://images\.pexels\.com/photos/(\d+)/pexels-photo-\1\.jpeg\?[^\"')]+|/images/pexels-\$1.jpg|g" "$FULL_PATH"
  echo "  ✅  Updated: $FILE"
done

echo ""
echo "🔄  Cleaning up next.config.ts — removing Pexels from remotePatterns..."

# Remove the pexels remotePatterns entry from next.config.ts
perl -i -0pe "s|\s*\{\s*\n\s*protocol: \"https\",\s*\n\s*hostname: \"images\.pexels\.com\",\s*\n\s*\},||g" "$REPO_ROOT/next.config.ts"

echo "  ✅  next.config.ts updated"
echo ""
echo "─────────────────────────────────────────────────────────────────────────"
echo "  All done. Next steps:"
echo ""
echo "  1. Run the dev server to verify:  npm run dev"
echo "  2. Commit and push:"
echo "     git add -A && git commit -m 'feat: localize all Pexels images' && git push"
echo "─────────────────────────────────────────────────────────────────────────"
