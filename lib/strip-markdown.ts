/**
 * Cheap markdown → plain text reducer.
 *
 * Used to surface ``short_description`` (markdown) inside compact product
 * cards where rendering full markdown would blow up the layout (headings,
 * bullet lists, code blocks, etc.).
 *
 * This is not a real parser — it's just enough to strip the most common
 * syntax characters so the result reads naturally as plain text. Side
 * effects:
 *   • Headings:    "# Title"      → "Title"
 *   • Bold/italic: "**foo**"      → "foo"   |  "*foo*" → "foo"
 *   • Inline code: "`foo`"        → "foo"
 *   • Links:       "[label](url)" → "label"
 *   • Images:      "![alt](url)"  → "alt"
 *   • Lists:       "- foo\n- bar" → "foo bar"
 *   • Blockquotes: "> foo"        → "foo"
 *   • Newlines collapsed to spaces.
 *
 * For richer needs (e.g. preserving inline formatting), render with
 * ``<MarkdownRenderer />`` on a surface that has the room for it.
 */
export function stripMarkdown(md: string): string {
  if (!md) return '';
  return md
    // Images first (so the URL doesn't leak after links).
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Links → keep label.
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Inline code.
    .replace(/`([^`]+)`/g, '$1')
    // Bold / italic / underscore variants.
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Leading heading hashes.
    .replace(/^#{1,6}\s+/gm, '')
    // Leading list markers.
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Leading blockquote markers.
    .replace(/^\s*>\s?/gm, '')
    // Collapse whitespace.
    .replace(/\r?\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function truncate(text: string, max = 120): string {
  if (text.length <= max) return text;
  // Trim at word boundary to avoid cutting mid-word, then add ellipsis.
  const trimmed = text.slice(0, max).replace(/\s+\S*$/, '');
  return `${trimmed}…`;
}
