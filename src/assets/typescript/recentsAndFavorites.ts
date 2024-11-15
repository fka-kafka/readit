export type Recents = string[];

export async function saveToLocalStorage(category: string, item: string) {
	if (localStorage.getItem(category) === null) {
		const savedItems: Recents = [];
		savedItems.push(category === 'favorites' ? item : item.toLowerCase());
		localStorage.setItem(category, JSON.stringify(savedItems));
		return;
	}

	const savedItems: Recents = await JSON.parse(localStorage.getItem(category)!);

	if (savedItems.includes(item.toLowerCase())) return;

	savedItems.push(category === 'favorites' ? item : item.toLowerCase());
	localStorage.setItem(category, JSON.stringify(savedItems));
	return;
}

export async function deleteFromLocalStorage(category: string, item: string) {
	if (localStorage.getItem(category) === null) return;

	let savedItems: Recents = await JSON.parse(localStorage.getItem(category)!);

	if (savedItems.includes(item) === false) return;

	savedItems = savedItems.filter((savedItem) => {
		if (savedItem !== item) return savedItem;
	});
	localStorage.setItem(category, JSON.stringify(savedItems));
	return;
}
