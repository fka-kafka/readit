import { fetchFromLocalStorage } from "./fetchPosts.ts";

export async function displaySidebarContent(content: string) {
  const sidebarContent = fetchFromLocalStorage(content);

  if (!sidebarContent) return;

  const contentContainer = document.getElementById(content);
  if (!contentContainer) return;

  contentContainer.innerHTML = "";

  sidebarContent.forEach((contentSaved) => {
    const contentAnchor = document.createElement("a") as HTMLAnchorElement;

    contentAnchor.classList.add(
      "text-nowrap",
      "text-sm",
      "my-1",
      "p-2",
      "border",
      "border-gray-100",
      "dark:border-[#090e10]",
      "rounded-sm",
      "bg-[#f2f2f2]",
      "dark:bg-[#121d21]",
      "text-black",
      "dark:text-white",
      "dark:border-[#090e10]",
      "hover:scale-95",
      "delay-[25]",
      "transition-transform",
    );
    contentAnchor.href = content.toLowerCase() === 'recents' ? `/readit/src/pages/postPage.html?subreddit=${contentSaved}` : contentSaved;
    contentAnchor.target = "_blank";
    contentAnchor.textContent = content.toLowerCase() === 'recents' ? contentSaved : contentSaved.split('/')[contentSaved.split('/').length - 2];

    contentContainer.appendChild(contentAnchor);
  });
}
