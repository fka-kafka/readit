export type RecentsOrFavorites = string[];

export function saveToLocalStorage(category: string, item: string) {
	if (localStorage.getItem(category) === null) {
		const savedItems: RecentsOrFavorites = [];
		savedItems.push(category === 'favorites' ? item : item.toLowerCase());
		localStorage.setItem(category, JSON.stringify(savedItems));
		return;
	}

	const savedItems: RecentsOrFavorites = JSON.parse(localStorage.getItem(category)!);

	if (savedItems.includes(item.toLowerCase())) return;

	savedItems.push(category === 'favorites' ? item : item.toLowerCase());
	localStorage.setItem(category, JSON.stringify(savedItems));
	return;
}

export function deleteFromLocalStorage(category: string, item: string) {
	if (localStorage.getItem(category) === null) return;

	let savedItems: RecentsOrFavorites = JSON.parse(localStorage.getItem(category)!);

	if (savedItems.includes(item) === false) return;

	savedItems = savedItems.filter((savedItem) => {
		if (savedItem !== item) return savedItem;
	});
	localStorage.setItem(category, JSON.stringify(savedItems));
	return;
}
