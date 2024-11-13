type Recents = string[];

export async function saveToLocalStorage(category: string, item: string) {
  if (localStorage.getItem(category) === null) {
    const savedItems: Recents = [];
    savedItems.push(item);
    localStorage.setItem(category, JSON.stringify(savedItems));
    return;
  }

  const savedItems: Recents = await JSON.parse(localStorage.getItem(category)!);

  if (savedItems.includes(item)) return;
  savedItems.push(item);
  localStorage.setItem(category, JSON.stringify(savedItems));
  return;
}
