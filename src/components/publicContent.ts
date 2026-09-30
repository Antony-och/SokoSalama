export interface PublicContentItem {
  heading?: string;
  body: string;
}

export const readPublicContent = (value: unknown): PublicContentItem[] => {
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object').map((item) => ({
        heading: typeof item.heading === 'string' ? item.heading : '',
        body: typeof item.body === 'string' ? item.body : '',
      })).filter((item) => item.heading || item.body);
    }
  } catch {
    // Treat older plain text values as a single content block.
  }
  return [{ body: value }];
};

export const writePublicContent = (items: PublicContentItem[]) => JSON.stringify(items.filter((item) => (item.heading || '').trim() || item.body.trim()));
