import EditorJSMarkdownConverter from '@vingeray/editorjs-markdown-converter';

/**
 * Converts study guide content (either EditorJS JSON or Markdown) to Markdown.
 */
export function contentToMarkdown(content: string): string {
  if (!content) return '';

  try {
    // Check if content is EditorJS JSON format
    if (content.startsWith('{') || content.startsWith('[')) {
      const editorData = JSON.parse(content);
      return EditorJSMarkdownConverter.toMarkdown(editorData.blocks || []);
    }
    // Already markdown
    return content;
  } catch {
    // If parsing fails, return as-is
    return content;
  }
}

/**
 * Extracts headings from markdown content for table of contents.
 * Returns an array of { level, text, id } objects.
 */
export function extractHeadings(
  markdown: string
): Array<{ level: number; text: string; id: string }> {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; id: string }> = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);
    headings.push({ level, text, id });
  }

  return headings;
}

/**
 * Creates a URL-safe slug from a heading text.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove non-word chars except spaces and hyphens
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // collapse multiple hyphens
    .trim();
}
