import { agent, publicAgent, getSession } from "@/lib/atp-client";
import { VirtualizedPosts } from "@/components/virtualized-posts";
import { Post } from "@/components/post.server";

// The number of items that will be rendered initially
// and live outside of the virtualized list. This allows
// the first n items to be rendered immediately, without JS.
const SPLIT = 10;

export default async function Posts({
  params,
}: {
  params: { userId: string };
}) {
  const userId = decodeURIComponent(params.userId);

  const session = await getSession();

  const { data } = await (session ? agent : publicAgent).getAuthorFeed({
    actor: userId,
    limit: 100,
  });

  const posts = data.feed.map((f) => f.post);

  const firstTwenty = posts.slice(0, SPLIT);
  const remaining = posts.slice(SPLIT);

  return (
    <>
      {firstTwenty.map((post) => (
        <Post key={post.uri} post={post} />
      ))}
      <VirtualizedPosts defaultPosts={remaining} />
    </>
  );
}
