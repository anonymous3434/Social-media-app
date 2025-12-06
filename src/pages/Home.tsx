import { useAuthContext } from "@/context/auth.constants";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutation";
import Loader from "@/shared/Loader";
import PostCard from "@/shared/PostCard";

const Home = () => {
  const { user } = useAuthContext();
  const { data: allRecentPostsData, isPending: isRecentPostLoaded } =
    useGetRecentPosts({ userId: user.id });
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="text-left w-full h3-bold md:h2-bold">HOME FEED</h2>
          {isRecentPostLoaded && !allRecentPostsData ? (
            <div className="flex flex-1 justify-center items-center">
              <Loader />
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {allRecentPostsData &&
                allRecentPostsData.map((post) => {
                  return (
                    <li
                      key={post?.$id}
                      className="flex w-full items-center mb-2"
                    >
                      <PostCard
                        post={post}
                        isLiked={post?.isLiked}
                        isSaved={post?.isSaved}
                        key={post?.$createdAt}
                      />
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
