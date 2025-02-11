interface Subreddit {
  display_name: string;
  display_name_prefixed: string;
}

const redditBaseurl = "https://www.reddit.com";

 export function debounce<F extends (...args: any[]) => any>(
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

export async function searchSubreddits(
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

export function displaySearchResults(searchResults: Subreddit[]) {
  const searchResultsContainer = document.querySelector(
    "#searchResults",
  ) as HTMLDivElement;
  searchResultsContainer.classList.add("grid", "grid-cols-2", "gap-2");
  searchResultsContainer.innerHTML = "";
  searchResults.forEach((searchResult) => {
    const result = document.createElement("a") as HTMLAnchorElement;
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
