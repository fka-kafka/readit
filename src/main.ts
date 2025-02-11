// deno-lint-ignore-file no-explicit-any
import {
  debounce,
  searchSubreddits,
  displaySearchResults,
} from "./assets/typescript/subreddits";
import lightModeIcon from '/src/assets/images/light-mode.svg'
import crescentIcon from '/src/assets/images/crescent.svg'
import "./assets/styles/style.css";


const themeChanger = document.getElementById(
  "themeChanger",
) as HTMLButtonElement;
themeChanger.addEventListener("click", (e: Event) => {
  e.preventDefault();

  const themeIcon = document.getElementById("themeIcon") as HTMLImageElement;

  if (document.documentElement.classList.contains("dark")) {
    themeIcon.src = crescentIcon;
  } else {
    themeIcon.src = lightModeIcon;
  }

  document.documentElement.classList.toggle("dark");
});

document.addEventListener("DOMContentLoaded", () => {
  const debounceSearch = debounce(searchSubreddits, 500);
  document
    .querySelector("input")!
    .addEventListener("input", async (e: Event) => {
      if (
        e.target instanceof HTMLInputElement &&
        (e.target.value === null || e.target.value === "")
      ) {
        return;
      } else if (e.target instanceof HTMLInputElement) {
        document.getElementById("loader-container")?.classList.remove("hidden");
        const searchResults = await debounceSearch(
          (e.target as HTMLInputElement).value,
        );
        document.getElementById("loader-container")?.classList.add("hidden");
        document.getElementById("searchResults")?.classList.remove("hidden");
        displaySearchResults(searchResults!);
      }
    });
});
