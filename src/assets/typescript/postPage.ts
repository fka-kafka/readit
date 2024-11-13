// deno-lint-ignore-file no-unused-vars
import moment from "moment";

import "../../style.css";
import "../images/upvote.svg";
import { saveToLocalStorage } from "./userData.ts";
import { fetchPosts } from "./postData.ts";

const redditBaseurl = "https://www.reddit.com";

const postsSection = document.getElementById("pageContent") as HTMLElement;

async function displayPosts(subreddit: string) {
  const pageContent = await fetchPosts(redditBaseurl, subreddit);

  let iframe: string;

  let image: string;

  postsSection.innerHTML = `<h2 class=" flex items-center px-7 mb-2 rounded-lg bg-gray-100 h-12"><span class="text-2xl font-bold">r/${subreddit}</span></h2>`;

  pageContent.forEach((post) => {
    const postContainer = document.createElement("article") as HTMLElement;

    if (post.media !== null && post.media.oembed?.html) {
      let source: string | null;
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

    const resourceLink = `<a href="${post.url}" target="_blank" class=" text-[#00F] pl-4 font-semibold overflow-hidden text-nowrap">${post.url}</a>`;

    const flairBackgroundColor = post.link_flair_background_color;

    postContainer.className = "p-2 my-4 rounded-lg bg-gray-100 px-5";
    postContainer.innerHTML = `
			<div class="flex flex-col w-full">
				<span class="w-fit self-end px-2 rounded-xl text-sm font-medium mt-2" style="background-color: ${flairBackgroundColor}">
					${post.link_flair_text !== null ? post.link_flair_text : ""}
				</span>
        <span class=" w-full flex justify-between items-center px-2">
          <h3 class="font-semibold text-xl my-2 " >${post.title}</h3>
          <button id="favorite">
            <img src="../assets/images/favorite.svg" alt="" width="24" >
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
					<p class=" my-2 ">
						${
              post.selftext === "" && post.url && post.media === null
                ? resourceLink
                : post.selftext.length <= 1000
                  ? post.selftext
                  : post.selftext.slice(0, 1001) + " ..."
            }
					</p>
				</div>
				<div class="flex justify-between mx-4 mt-2">
					<div class="max-w-fit inline-grid grid-cols-3">
						<div class="flex justify-center items-center pr-2 font-semibold text-sm">
                <img src="../assets/images/upvote.svg" alt="" width="32">	${post.ups + post.downs}
                <img src="../assets/images/downvote.svg" alt="" width="32" class="rotate-180">
						</div>
						<span class=" w-fit mx-2 flex gap-0.5 text-sm font-semibold justify-center items-center">
              ${post.num_comments} <img src="../assets/images/comment.svg" alt="" width="22" >
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

document.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  const urlParams = new URLSearchParams(globalThis.location.search);
  const subreddit = urlParams.get("subreddit");
  document.title = `r/${subreddit}`

  await saveToLocalStorage('recents', subreddit!)
  await displayPosts(subreddit!);
});
