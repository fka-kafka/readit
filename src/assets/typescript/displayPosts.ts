import moment from "moment";

import { fetchPosts } from "./fetchPosts.ts";
import { Recents } from "./recentsAndFavorites.ts";

const redditBaseurl = "https://www.reddit.com";
const postsSection = document.getElementById("pageContent") as HTMLElement;

export async function displayPosts(subreddit: string) {
  const postData = await fetchPosts(redditBaseurl, subreddit);

  let iframe: string;
  let image: string;
  let favoritePosts: Recents;

  if (localStorage.getItem("favorites") !== null) {
    favoritePosts = await JSON.parse(localStorage.getItem("favorites")!);
    console.log(favoritePosts);
  }

  postData.forEach((post) => {
    const postContainer = document.createElement("article") as HTMLElement;
    postContainer.className =
      "p-2 my-4 rounded-lg bg-[#f2f2f2] dark:bg-[#121d21] shadow-md px-5 border border-gray-100 dark:border-none";
    postContainer.id = "post";

    const flairBackgroundColor = post.link_flair_background_color;

    if (post.media !== null && post.media.oembed?.html) {
      let source: string | null = "";
      source = post.media.oembed.html.match(/src="([^"]+)"/)![1];
      iframe = `<iframe
      class="rounded-sm"
		  src="${source}" allow="${
        post.media.oembed.type === "video"
          ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          : ""
      }"
		  ${post.media.oembed.type === "video" ? "allowfullscreen" : ""}></iframe>`;
    }

    if (post.thumbnail !== "") {
      image = `<img src="${post.url}" alt="" loading="lazy"  id="image" class=" rounded" width="400">`;
    }

    postContainer.innerHTML = `
			<div class="flex flex-col w-full">
				<span class="w-fit self-end px-2 rounded-xl text-sm font-semibold mt-2" style="background-color: ${flairBackgroundColor};">
					${post.link_flair_text !== null ? post.link_flair_text : ""}
				</span>
        <span class=" w-full grid grid-cols-12 px-2 ">
          <a href="${redditBaseurl}${
            post.permalink
          }" target="_blank" class="font-semibold text-xl my-2 hover:text-[#5195DD] col-span-11 w-fit" id="postTitle">${
            post.title
          }</a>
          <button id="favoriteButton" class=" flex justify-end my-2 rounded-full">
            <svg id="favoriteIcon" class="w-6 h-6 hover:scale-110 stroke-2 stroke-[#2563eb] delay-[50] transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.381 6.06759C18.1553 3.19885 13.7697 3.5573 12 6.62866C10.2303 3.55729 5.84473 3.19885 3.61898 6.06759L3.30962 6.46632C1.42724 8.8925 1.69903 12.3524 3.93717 14.4548L10.9074 21.0026C11.0115 21.1005 11.1254 21.2075 11.2327 21.2902C11.3562 21.3853 11.5288 21.4954 11.7593 21.5406C11.9182 21.5718 12.0818 21.5718 12.2407 21.5406C12.4712 21.4954 12.6438 21.3853 12.7673 21.2902C12.8747 21.2075 12.9885 21.1005 13.0927 21.0026L20.0628 14.4548C22.301 12.3524 22.5728 8.89249 20.6904 6.46631L20.381 6.06759Z" fill="${favoritePosts && favoritePosts.includes(post.title) ? '#2563eb' : 'none'}"/>
            </svg>
          </button>
        </span>
			</div>
			<div>
				<div class="min-h-fit">
					<div id="mediaContainer" class=" w-full rounded-lg relative flex justify-center overflow-hidden items-center">
            <!-- Add the blurred background using a pseudo-element -->
            ${
              post.thumbnail !== "" && post.media === null
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
                : ""
            }
            <!-- Content container -->
            <div class="relative z-10 p-4 rounded-sm">
              ${post.media !== null && post.thumbnail === "" ? iframe : ""}
              ${post.thumbnail !== "" && post.media === null ? image : ""}
            </div>
          </div>
          </div>
					<p class=" my-2 leading-5">
						${
              post.selftext.length <= 1000
                ? post.selftext
                : post.selftext.slice(0, 1001) + " ..."
            }
					</p>
				</div>
				<div class="flex justify-between mx-4 mt-2">
					<div class="max-w-fit inline-grid grid-cols-3">
						<div class="flex justify-center items-center pr-2 font-semibold text-sm">
              <a href="${redditBaseurl}${post.permalink}" target="_blank">
                <img class=" hover:scale-110" src="../assets/images/upvote.svg" alt="" width="32">
              </a>
                ${post.ups + post.downs}
              <a href="${redditBaseurl}${post.permalink}" target="_blank">
                <img class=" hover:scale-110 rotate-180" src="../assets/images/downvote.svg" alt="" width="32">
              </a>
						</div>
						<span class=" w-fit mx-2 flex gap-0.5 text-sm font-semibold justify-center items-center">
              ${post.num_comments}
              <a href="${redditBaseurl}${post.permalink}" target="_blank">
                <svg fill="#000000" class="w-5 h-5 fill-black dark:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h3v3.767L13.277 18H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14h-7.277L9 18.233V16H4V4h16v12z"/><path d="M7 7h10v2H7zm0 4h7v2H7z"/>
                </svg>
              </a>
            </span>
					</div>
					<span class=" text-sm"><b>u/${post.author}</b> <b>|</b> ${moment
            .unix(post.created_utc)
            .fromNow()}</span>
				</div>
			</div>
                    `;
    postsSection.appendChild(postContainer);
  });
}
