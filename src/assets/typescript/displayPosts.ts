import moment from 'moment';

import { fetchPosts } from './fetchPosts.ts';
import { Recents } from './recentsAndFavorites.ts';

const redditBaseurl = 'https://www.reddit.com';
const postsSection = document.getElementById('pageContent') as HTMLElement;

export async function displayPosts(subreddit: string) {
	const postData = await fetchPosts(redditBaseurl, subreddit);

	let iframe: string;
	let image: string;
	let favoritePosts: Recents;

	if (localStorage.getItem('favorites') !== null) {
		favoritePosts = await JSON.parse(localStorage.getItem('favorites')!);
	}

	postData.forEach((post) => {
		const postContainer = document.createElement('article') as HTMLElement;
		postContainer.className = 'p-2 my-4 rounded-lg bg-gray-100 px-5';
		postContainer.id = 'post';

		const flairBackgroundColor = post.link_flair_background_color;

		if (post.media !== null && post.media.oembed?.html) {
			let source: string | null = '';
			source = post.media.oembed.html.match(/src="([^"]+)"/)![1];
			iframe = `<iframe
      class="rounded-sm"
		  src="${source}" allow="${
				post.media.oembed.type === 'video'
					? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
					: ''
			}"
		  ${post.media.oembed.type === 'video' ? 'allowfullscreen' : ''}></iframe>`;
		}

		if (post.thumbnail !== '') {
			image =
				`<img src="${post.url}" alt="" loading="lazy"  id="image" class=" rounded" width="400">`;
		}

		postContainer.innerHTML = `
			<div class="flex flex-col w-full">
				<span class="w-fit self-end px-2 rounded-xl text-sm font-medium mt-2" style="background-color: ${flairBackgroundColor}">
					${post.link_flair_text !== null ? post.link_flair_text : ''}
				</span>
        <span class=" w-full grid grid-cols-12  px-2">
          <a href="${redditBaseurl}${post.permalink}" target="_blank" class="font-semibold text-xl my-2 hover:text-redditOrange col-span-11 w-fit" id="postTitle">${post.title}</a>
          <button id="favoriteButton" class=" flex justify-end my-2">
            <img class=" hover:scale-110" src="${
			favoritePosts.includes(post.title)
				? './src/assets/images/favorite-filled.svg'
				: './src/assets/images/favorite.svg'
		}" alt="" width="24" id="favorite">
          </button>
        </span>
			</div>
			<div>
				<div class="min-h-fit">
					<div id="mediaContainer" class=" w-full rounded-lg relative flex justify-center overflow-hidden items-center">
            <!-- Add the blurred background using a pseudo-element -->
            ${
			post.thumbnail !== '' && post.media === null
				? `
              <div class="absolute inset-0" style="
                background-image: url('${post.url}');
                background-size: cover;
                background-position: center;
                filter: blur(8px);
                transform: scale(1.1);
                z-index: 0;
                opacity: 0.7;
              "></div>
            `
				: ''
		}
            <!-- Content container -->
            <div class="relative z-10 p-4 rounded-sm">
              ${post.media !== null && post.thumbnail === '' ? iframe : ''}
              ${post.thumbnail !== '' && post.media === null ? image : ''}
            </div>
          </div>
          </div>
					<p class=" my-2 ">
						${post.selftext.length <= 1000 ? post.selftext : post.selftext.slice(0, 1001) + ' ...'}
					</p>
				</div>
				<div class="flex justify-between mx-4 mt-2">
					<div class="max-w-fit inline-grid grid-cols-3">
						<div class="flex justify-center items-center pr-2 font-semibold text-sm">
              <a href="${redditBaseurl}${post.permalink}" target="_blank">
                <img class=" hover:scale-110" src="./src/assets/images/upvote.svg" alt="" width="32">
              </a>
                ${post.ups + post.downs}
              <a href="${redditBaseurl}${post.permalink}" target="_blank">
                <img class=" hover:scale-110 rotate-180" src="./src/assets/images/downvote.svg" alt="" width="32">
              </a>
						</div>
						<span class=" w-fit mx-2 flex gap-0.5 text-sm font-semibold justify-center items-center">
              ${post.num_comments}   
              <a href="${redditBaseurl}${post.permalink}" target="_blank">
                <img src="./src/assets/images/comment.svg" alt="" width="22" class=" pt-1 hover:scale-110">
              </a>
            </span>
					</div>
					<span class=" text-sm"><b>u/${post.author}</b> <b>|</b> ${
			moment
				.unix(post.created_utc)
				.fromNow()
		}</span>
				</div>
			</div>
                    `;
		postsSection.appendChild(postContainer);
	});
}
