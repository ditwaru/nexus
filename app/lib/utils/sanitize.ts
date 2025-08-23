/**
 * Escapes quotes and special characters in text content
 * This prevents build-time errors when content contains unescaped characters
 */
export function escapeQuotes(text: string): string {
  return text.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/**
 * Escapes quotes in content that can be either a string or array of strings
 */
export function sanitizeContent(content: string | string[]): string | string[] {
  if (Array.isArray(content)) {
    return content.map((item) => escapeQuotes(item));
  }
  return escapeQuotes(content);
}
