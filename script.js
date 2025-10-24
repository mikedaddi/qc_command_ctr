// script.js — DEEVO News Command Center (Charlotte Edition)

const defaultFeeds = [
  { name: "PikaMax Substack", url: "https://pikamax.substack.com/feed" },
  { name: "Lucky Pikas Blog", url: "https://luckypikas.blogspot.com/feeds/posts/default?alt=rss" },
  { name: "Queen City Drive", url: "https://queencitydrive.blogspot.com/feeds/posts/default?alt=rss" },
  { name: "WSOC TV", url: "https://www.wsoctv.com/pf/feeds/" },
  { name: "WBTV", url: "https://www.wbtv.com/pf/core/feeds/rss/" },
  { name: "WCNC", url: "https://www.wcnc.com/feeds" },
  { name: "CLTure", url: "https://clture.org/feed/" },
  { name: "Axios Charlotte", url: "https://charlotte.axios.com/rss" },
  { name: "All Events Charlotte", url: "https://allevents.in/charlotte/rss" },
  { name: "Eventbrite Charlotte", url: "https://www.eventbrite.com/d/nc--charlotte/events/rss/" },
  // Entertainment feeds (kept at the end)
  { name: "Entertainment Weekly", url: "https://ew.com/feed" },
  { name: "Rolling Stone", url: "https://www.rollingstone.com/music/music-news/feed/" },
  { name: "Billboard", url: "https://www.billboard.com/feed/" },
];

let feeds = JSON.parse(localStorage.getItem("feeds")) || defaultFeeds;
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

const feedListContainer = document.getElementById("feed-list");
const articleContainer = document.getElementById("article-container");

function saveFeeds() {
  localStorage.setItem("feeds", JSON.stringify(feeds));
}

function saveBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function renderFeedList() {
  feedListContainer.innerHTML = "";
  feeds.forEach((feed, index) => {
    const div = document.createElement("div");
    div.className = "feed-item";
    div.innerHTML = `<span>${feed.name}</span>`;
    div.addEventListener("click", () => loadFeed(feed.url));
    feedListContainer.appendChild(div);
  });
}

async function loadFeed(feedUrl) {
  articleContainer.innerHTML = `<p class="loading-note">Loading ${feedUrl}...</p>`;
  try {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
    const data = await response.json();
    if (!data.items) throw new Error("Invalid feed");
    articleContainer.innerHTML = data.items.map(item => `
      <article class="article-card">
        <h2><a href="${item.link}" target="_blank">${item.title}</a></h2>
        <p>${item.description?.slice(0, 200) || ""}...</p>
        <button class="btn small" onclick="bookmarkArticle('${encodeURIComponent(JSON.stringify(item))}')">
          <i class="fas fa-bookmark"></i> Save
        </button>
      </article>
    `).join("");
  } catch (err) {
    articleContainer.innerHTML = `<p class="error">Error loading feed: ${err.message}</p>`;
  }
}

function bookmarkArticle(encodedItem) {
  const item = JSON.parse(decodeURIComponent(encodedItem));
  bookmarks.push(item);
  saveBookmarks();
  alert("Article saved to bookmarks!");
}

document.addEventListener("DOMContentLoaded", () => {
  renderFeedList();
  loadFeed(feeds[0].url);
});
