import {
  deleteFromLocalStorage,
  saveToLocalStorage,
} from "./recentsAndFavorites.ts";
import { displayPosts } from "./displayPosts.ts";
import "../styles/style.css";

document.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  const urlParams = new URLSearchParams(globalThis.location.search);
  const subreddit = urlParams.get("subreddit");

  document.title = `r/${subreddit}`;
  document.getElementById("subredditTitle")!.innerText = `r/${subreddit}`;

  await saveToLocalStorage("recents", subreddit!);
  await displayPosts(subreddit!);

  document.addEventListener("click", async (e: Event) => {
    const favoriteButton = e.target!.closest(
      "#favoriteButton"
    ) as HTMLButtonElement;
    const favoriteIcon = favoriteButton.firstElementChild as HTMLImageElement;
    const subject =
      favoriteButton.parentElement?.firstElementChild?.textContent;

    if (localStorage.getItem("favorites")) {
      (await JSON.parse(localStorage.getItem("favorites")!).includes(subject))
        ? ((favoriteIcon.src = "./src/assets/images/favorite.svg"),
          deleteFromLocalStorage("favorites", subject!))
        : ((favoriteIcon.src = "./src/assets/images/favorite-filled.svg"),
          saveToLocalStorage("favorites", subject!));
    } else {
      favoriteIcon.src = "./src/assets/images/favorite-filled.svg";
      saveToLocalStorage("favorites", subject!);
    }
  });
});
