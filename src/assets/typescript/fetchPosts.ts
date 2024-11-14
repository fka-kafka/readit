interface Post {
  selftext: string;
  title: string;
  downs: number;
  ups: number;
  link_flair_text: string;
  link_flair_background_color: string;
  author: string;
  num_comments: number;
  created_utc: number;
  media: {
    type: string;
    oembed: Record<string | number | symbol, never>;
  };
  thumbnail: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
  url: string;
  permalink: string;
}

export async function fetchPosts(uri: string | URL, subreddit: string) {
  const response = await fetch(`${uri}/r/${subreddit}/top.json?limit=25`);
  const subredditPostsObject = await response.json();
  const posts: Post[] = [];
  for (let i = 0; i < subredditPostsObject.data.children.length; i++) {
    const subredditPost = subredditPostsObject.data.children[i];
    posts.push({
      selftext: subredditPost?.data?.selftext,
      title: subredditPost?.data?.title,
      downs: subredditPost?.data?.downs,
      ups: subredditPost?.data?.ups,
      link_flair_text: subredditPost?.data?.link_flair_text,
      link_flair_background_color:
        subredditPost?.data?.link_flair_background_color,
      author: subredditPost?.data?.author,
      num_comments: subredditPost?.data?.num_comments,
      created_utc: subredditPost?.data?.created_utc,
      media: subredditPost?.data?.media,
      thumbnail: subredditPost?.data?.thumbnail,
      thumbnail_height: subredditPost?.data?.thumbnail_height,
      thumbnail_width: subredditPost?.data?.thumbnail_width,
      url: subredditPost?.data?.url,
      permalink: subredditPost?.data?.permalink,
    });
  }

  return posts;
}
