import {
  deleteFromLocalStorage,
  Recents,
  saveToLocalStorage,
} from "./recentsAndFavorites.ts";
import { displayPosts } from "./displayPosts.ts";
import "../styles/style.css";

const themeChanger = document.getElementById(
  "themeChanger",
) as HTMLButtonElement;
themeChanger.addEventListener("click", (e: Event) => {
  e.preventDefault();

  const themeIcon = document.getElementById("themeIcon") as HTMLImageElement;

  if (document.documentElement.classList.contains("dark")) {
    themeIcon.src = "../assets/images/crescent.svg";
  } else {
    themeIcon.src = "../assets/images/light-mode.svg";
  }

  document.documentElement.classList.toggle("dark");
});

document.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  const urlParams = new URLSearchParams(globalThis.location.search);
  const subreddit = urlParams.get("subreddit");

  document.title = `r/${subreddit}`;
  document.getElementById("subredditTitle")!.innerText = `r/${subreddit}`;

  await saveToLocalStorage("recents", subreddit!);
  await displayPosts(subreddit!);

  document.addEventListener("click", async (e: Event) => {
    const target = e.target as Node;
    // Check if the target is an Element
    if (target.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    // Cast target to Element
    const favoriteButton = (target as Element).closest(
      "#favoriteButton",
    ) as HTMLButtonElement;
    // Check if favoriteButton is found
    if (!favoriteButton) {
      return;
    }
    console.log(favoriteButton);
    const favoriteIcon = favoriteButton.firstElementChild as SVGElement;
    console.log(favoriteIcon);
    const subject =
      favoriteButton.parentElement?.firstElementChild?.textContent;

    console.log(subject);

    if (localStorage.getItem("favorites")) {
      const favorites = await JSON.parse(localStorage.getItem("favorites")!);
      const path = favoriteIcon.children[0]!;
      favorites.includes(subject!)
        ? (path.setAttribute("fill", "none"),
          deleteFromLocalStorage("favorites", subject!))
        : (path.setAttribute("fill", "#2563eb"),
          saveToLocalStorage("favorites", subject!));
    } else {
      favoriteIcon.querySelector("path")?.setAttribute("fill", "none");
      saveToLocalStorage("favorites", subject!);
    }
  });

  const collapsibles = document.getElementsByClassName("collapsible");

  for (let i = 0; i < collapsibles.length; i++) {
    collapsibles[i].addEventListener("click", (event) => {
      const target = event.currentTarget as HTMLElement; // Type assertion
      target.classList.toggle("active");
      const content = target.nextElementSibling as HTMLElement; // Type assertion
      if (content.style.maxHeight) {
        content.style.maxHeight = "0";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }

  document.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement; // Cast to HTMLElement

    // Check if the target is an Element and if it has the closest method
    const savedDataButton = target.closest("#savedData") as HTMLButtonElement;

    // Ensure savedDataButton is not null
    if (!savedDataButton) {
      return; // Exit if the button was not found
    }

    const category = savedDataButton.textContent!;
    console.log(category);

    if (localStorage.getItem(category.toLocaleLowerCase()) !== null) {
      const savedItemsContainer = document.getElementById(
        category.toLocaleLowerCase(),
      ) as HTMLUListElement;

      // Clear the saved items container
      savedItemsContainer.innerHTML = "";

      const savedItems = JSON.parse(
        localStorage.getItem(category.toLocaleLowerCase())!,
      ) as Recents;

      savedItems.forEach((savedItem) => {
        const subredditItem = document.createElement("li") as HTMLLIElement;
        subredditItem.classList.add(
          "w-full",
          "overflow-x-hidden",
          "py-2",
          "text-black",
        );
        subredditItem.innerHTML =
          category === "Recents"
            ? `<a href="postPage.html?subreddit=${savedItem}" class="hover:text-redditOrange hover:underline">${savedItem}</a>`
            : savedItem;
        savedItemsContainer.appendChild(subredditItem);
      });
    }
  });
});
