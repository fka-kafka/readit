// deno-lint-ignore-file no-unused-vars
import { deleteFromLocalStorage, Recents, saveToLocalStorage } from './recentsAndFavorites.ts';
import { displayPosts } from './displayPosts.ts';
import '../styles/style.css';

document.addEventListener('DOMContentLoaded', async (e) => {
	e.preventDefault();
	const urlParams = new URLSearchParams(globalThis.location.search);
	const subreddit = urlParams.get('subreddit');

	document.title = `r/${subreddit}`;
	document.getElementById('subredditTitle')!.innerText = `r/${subreddit}`;

	await saveToLocalStorage('recents', subreddit!);
	await displayPosts(subreddit!);

	document.addEventListener('click', async (e: Event) => {
		const favoriteButton = e.target!.closest(
			'#favoriteButton',
		) as HTMLButtonElement;
		const favoriteIcon = favoriteButton.firstElementChild as HTMLImageElement;
		const subject = favoriteButton.parentElement?.firstElementChild?.textContent;

		if (localStorage.getItem('favorites')) {
			(await JSON.parse(localStorage.getItem('favorites')!).includes(subject))
				? ((favoriteIcon.src = './src/assets/images/favorite.svg'),
					deleteFromLocalStorage('favorites', subject!))
				: ((favoriteIcon.src = './src/assets/images/favorite-filled.svg'),
					saveToLocalStorage('favorites', subject!));
		} else {
			favoriteIcon.src = './src/assets/images/favorite-filled.svg';
			saveToLocalStorage('favorites', subject!);
		}
	});

	const collapsible = document.getElementsByClassName('collapsible');
	let i;

	for (i = 0; i < collapsible.length; i++) {
		collapsible[i].addEventListener('click', function () {
			this.classList.toggle('active');
			const content = this.nextElementSibling;
			if (content.style.maxHeight) {
				content.style.maxHeight = null;
			} else {
				content.style.maxHeight = content.scrollHeight + 'px';
			}
		});
	}

	document.addEventListener('click', (e: Event) => {
		const savedDataButton = e.target!.closest(
			'#savedData',
		) as HTMLButtonElement;
		console.log(savedDataButton.textContent);
		const category = savedDataButton.textContent!;

		if (localStorage.getItem(category.toLocaleLowerCase()) !== null) {
			const savedItemsContainer = document.getElementById(
				category.toLocaleLowerCase(),
			) as HTMLUListElement;
			savedItemsContainer.innerHTML = '';
			const savedItems = JSON.parse(
				localStorage.getItem(category.toLocaleLowerCase())!,
			) as Recents;
			savedItems.forEach((savedItem) => {
				const subredditItem = document.createElement('li') as HTMLLIElement;
				subredditItem.classList.add(
					'w-full',
					'overflow-x-hidden',
					'py-2',
					'text-black',
				);
				subredditItem.innerHTML = category === 'Recents'
					? `<a href="postPage.html?subreddit=${savedItem}" class=" hover:text-redditOrange hover:underline ">${savedItem}</a>`
					: savedItem;
				savedItemsContainer.appendChild(subredditItem);
			});
		}
	});
});
