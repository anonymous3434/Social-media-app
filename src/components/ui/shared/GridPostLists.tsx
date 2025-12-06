import { useAuthContext } from "@/context/auth.constants";
import PostStats from "@/shared/PostStats";
import { Models } from "appwrite";
import React from "react";
import { Link } from "react-router-dom";

const GridPostLists = ({ posts }: { posts: Models.Document[] }) => {
  const { user } = useAuthContext();
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center mx-auto">
      {posts?.map((post) => (
        <li className="relative h-80 aspect-square" key={post.$id}>
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img src={post?.image} className="h-full w-full object-cover" />
          </Link>

          <div className="grid-post_user">
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${post?.creator?.$id}`}
                className="flex items-center justify-center gap-1"
              >
                <img
                  src={post?.creator?.profileImage}
                  className="h-8 w-8 rounded-full"
                />
                <p>@{post?.creator?.username}</p>
              </Link>
            </div>

            <PostStats
              post={post}
              userId={user.id}
              isLiked={post.isLiked}
              isSaved={post.isSaved}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostLists;
