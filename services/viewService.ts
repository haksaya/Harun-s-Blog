
// Simulating a backend database using localStorage

export const getStoredViewCount = (id: string): number => {
  if (typeof window === 'undefined') return 0;
  
  const key = `blog_views_${id}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    return parseInt(stored, 10);
  }
  
  // If no view count exists yet, generate a deterministic "fake" starting number
  // based on the ID so it looks populated, then save it.
  // In a real app, this would start at 0.
  const pseudoRandomStart = Math.floor(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 500) + 50;
  return pseudoRandomStart;
};

export const incrementStoredViewCount = (id: string): number => {
  if (typeof window === 'undefined') return 0;

  const current = getStoredViewCount(id);
  const next = current + 1;
  localStorage.setItem(`blog_views_${id}`, next.toString());
  return next;
};
