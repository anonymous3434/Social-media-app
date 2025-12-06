import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth.constants";
import { useGetPostById } from "@/lib/react-query/queriesAndMutation";
import Loader from "@/shared/Loader";
import PostStats from "@/shared/PostStats";
import { timeAgo } from "@/utils";
import React from "react";
import { Link, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const { data: selectedPostData, isPending: isLoadingPost } =
    useGetPostById(id);
  const { user } = useAuthContext();
  const handlePost = () => {};
  return (
    <div className="post_details-container">
      {isLoadingPost ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={selectedPostData?.image}
            className="post_details-img"
            alt="post image"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${selectedPostData?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    selectedPostData?.creator.profileImage ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {selectedPostData?.creator.name}
                  </p>
                  <div className="flex flex-col text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {selectedPostData &&
                        timeAgo(selectedPostData?.$createdAt)}
                    </p>
                    <p className="subtle-semibold lg:small-regular">
                      {selectedPostData?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                {user.id !== selectedPostData?.creator.id && (
                  <Link to={`/update-post/${selectedPostData?.$id}`}>
                    <img src="/assets/icons/edit.svg" width={24} height={24} />
                  </Link>
                )}
                {user.id !== selectedPostData?.creator.id && (
                  <Button
                    variant="ghost"
                    className="post_details-delete_btn"
                    onClick={handlePost}
                  >
                    <img
                      src="/assets/icons/delete.svg"
                      width={24}
                      height={24}
                    />
                  </Button>
                )}
              </div>
            </div>
            <hr className="border w-full border-dark-4/90" />
            <div className="flex flex-col w-full justify-between h-full">
              <div>
                <p>{selectedPostData?.caption}</p>
                <ul className="flex flex-wrap gap-2 text-light-3 small-regular">
                  {selectedPostData?.tags &&
                    selectedPostData?.tags.map((tag: string, index) => {
                      return <li key={tag + index}>#{tag}</li>;
                    })}
                </ul>
              </div>
              <div className="w-full">
                <PostStats post={selectedPostData} userId={user.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
