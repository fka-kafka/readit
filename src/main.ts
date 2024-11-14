// deno-lint-ignore-file no-explicit-any
import "./assets/styles/style.css";

const redditBaseurl = "https://www.reddit.com";
const searchResultsContainer = document.querySelector(
  "#searchResults"
) as HTMLDivElement;

interface Subreddit {
  display_name: string;
  display_name_prefixed: string;
}

function debounce<F extends (...args: any[]) => any>(
  fn: F,
  delay = 300
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function (this: any, ...args: Parameters<F>) {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const result = fn.apply(this, args);
        resolve(result);
      }, delay);
    });
  };
}

async function searchSubreddits(
  searchQuery: string,
  url: URL | string = redditBaseurl
) {
  const response = await fetch(
    `${url}/subreddits/search.json?q=${searchQuery}&limit=100&sort=relevance`
  );
  const fetchedSubredditsObject = await response.json();
  const fetchedSubreddits: Subreddit[] = [];

  for (let i = 0; i < fetchedSubredditsObject.data.children.length; i++) {
    const subreddit = fetchedSubredditsObject.data.children[i];
    fetchedSubreddits.push({
      display_name: subreddit?.data?.display_name,
      display_name_prefixed: subreddit?.data?.display_name_prefixed,
    });
  }

  const filteredSubreddits: Subreddit[] = [];

  for (let i = 0; i < fetchedSubreddits.length; i++) {
    if (
      fetchedSubreddits[i].display_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      filteredSubreddits.push(fetchedSubreddits[i]);
    }
  }
  return filteredSubreddits;
}

function displaySearchResults(searchResults: Subreddit[]) {
  searchResultsContainer.innerHTML = "";
  searchResults.forEach((searchResult) => {
    const result = document.createElement("a") as HTMLAnchorElement;
    result.className = "w-full flex justify-center";
    result.id = "searchResult";
    result.innerHTML = `
				<div class=" transition-transform rounded-md w-4/5  border-black border my-1 hover:scale-105 ">
            <span class=" ml-2"><b>${searchResult.display_name}</b></span> <br>
            <span class=" ml-4">${searchResult.display_name_prefixed}</span>
        </div>
			`;
    result.href = `postPage.html?subreddit=${searchResult.display_name}`;

    searchResultsContainer.appendChild(result);
  });
}

const debounceSearch = debounce(searchSubreddits, 500);

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("input")!
    .addEventListener("input", async (e: Event) => {
      if (e.target!.value === null || e.target?.value === "") {
        searchResultsContainer.innerHTML = "";
        return;
      } else {
        const searchResults = await debounceSearch(e.target?.value);
        displaySearchResults(searchResults!);
      }
    });
});
