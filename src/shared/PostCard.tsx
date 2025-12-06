import { useAuthContext } from "@/context/auth.constants";
import { timeAgo } from "@/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
type Creator = Models.DefaultDocument & {
  profileImage?: string;
  username?: string;
  name?: string;
};

export type PostDocument = Models.Document & {
  creator?: Creator;
  location?: string;
  caption?: string;
  tags?: string[]; // use array if that's what you store
  image?: string; // ensure image field is declared
  imageId?: string;
};
const PostCard = ({
  post,
  isLiked,
  isSaved,
}: {
  post: PostDocument;
  isLiked: boolean;
  isSaved: boolean;
}) => {
  const { user } = useAuthContext();
  return (
    <div className="post-card">
      <div className="flex flex-col gap-2">
        {/* profile */}
        <div className="flex gap-6 items-center flex-between">
          <div className="flex gap-2">
            <Link to={`/profile/${post?.creator?.$id}`}>
              <img
                src={post?.creator?.profileImage}
                alt="profileImage"
                className="h-10 w-10 rounded-full hover:opacity-80 transition"
              />
            </Link>
            <div>
              <p className="text-light-1 font-bold hover:opacity-80 transition cursor-pointer">
                @{post?.creator?.username}
              </p>
              <div className="flex-col flex text-light-3 small-regular">
                <p>{timeAgo(post?.$createdAt)}</p>
                <p>{post?.location}</p>
              </div>
            </div>
          </div>
          {user.id === post.creator?.$id && (
            <Link to={`/update-post/${post?.$id}`}>
              <img
                src="/assets/icons/edit.svg"
                alt="edit"
                className="h-6 hover:opacity-80 transition"
              />
            </Link>
          )}
        </div>
        {/* post image */}
        <div className="relative w-full pb-[100%] rounded-lg overflow-hidden">
          <Link
            to={`/posts/${post.$id}`}
            className="hover:opacity-80 transition"
          >
            {post?.image && (
              <img
                src={post.image}
                alt="post"
                className="absolute top-0 left-0 w-full h-full object-contain"
              />
            )}
          </Link>
        </div>
        {/* caption & tags */}
        <div>
          <p>{post?.caption}</p>
          <ul className="flex flex-wrap gap-2 text-light-3 small-regular">
            {post.tags &&
              post?.tags.map((tag, index) => {
                return <li key={tag + index}>#{tag}</li>;
              })}
          </ul>
        </div>
        {/* actions */}
        {post && post.creator?.$id && (
          <PostStats
            post={post}
            userId={user.id}
            isLiked={isLiked}
            isSaved={isSaved}
          />
        )}
      </div>
    </div>
  );
};

export default PostCard;
