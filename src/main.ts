// deno-lint-ignore-file no-explicit-any
import "./assets/styles/style.css";

const redditBaseurl = "https://www.reddit.com";
const searchResultsContainer = document.querySelector(
  "#searchResults",
) as HTMLDivElement;
searchResultsContainer.classList.add("grid", "grid-cols-2", "gap-2");

interface Subreddit {
  display_name: string;
  display_name_prefixed: string;
}

function debounce<F extends (...args: any[]) => any>(
  fn: F,
  delay = 300,
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
  url: URL | string = redditBaseurl,
) {
  const response = await fetch(
    `${url}/subreddits/search.json?q=${searchQuery}&limit=100&sort=relevance`,
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
    result.target = "_blank";
    result.className = "w-full flex justify-center font-montserrat";
    result.id = "searchResult";
    result.innerHTML = `
				<div class="bg-[#f2f2f2] dark:bg-[#121d21] shadow-md flex justify-center items-center text-black dark:text-white transition-transform rounded-md h-12 w-full border border-gray-100 dark:border-[#090e10] my-1 hover:scale-105 hover:bg-[#e6e6e6] dark:hover:bg-[#d9d9d9] hover:text-black  dark:hover:text-black hover:shadow-xl backdrop-blur-md">
            <span class=" ml-4 text-md font-semibold ">${searchResult.display_name_prefixed}</span>
        </div>
			`;
    result.href = `/src/pages/postPage.html?subreddit=${searchResult.display_name}`;

    searchResultsContainer.appendChild(result);
  });
}

const debounceSearch = debounce(searchSubreddits, 500);

const themeChanger = document.getElementById(
  "themeChanger",
) as HTMLButtonElement;
themeChanger.addEventListener("click", (e: Event) => {
  e.preventDefault();

  const themeIcon = document.getElementById("themeIcon") as HTMLImageElement;

  if (document.documentElement.classList.contains("dark")) {
    themeIcon.src = "/src/assets/images/crescent.svg";
  } else {
    themeIcon.src = "/src/assets/images/light-mode.svg";
  }

  document.documentElement.classList.toggle("dark");
});

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("input")!
    .addEventListener("input", async (e: Event) => {
      if (
        e.target instanceof HTMLInputElement &&
        (e.target.value === null || e.target.value === "")
      ) {
        searchResultsContainer.innerHTML = "";
        return;
      } else if (e.target instanceof HTMLInputElement) {
        const searchResults = await debounceSearch(
          (e.target as HTMLInputElement).value,
        );
        displaySearchResults(searchResults!);
      }
    });
});
