import {
  useUpdateLike,
  useUpdateSave,
} from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";
import React, { useState } from "react";
type PostStatsType = {
  post: Models.Document;
  userId: string;
  isLiked: boolean;
  isSaved: boolean;
};
const PostStats = ({ post, userId }: PostStatsType) => {
  const { mutate: likePost } = useUpdateLike();
  const { mutate: savePost } = useUpdateSave();
  const handleLike = async () => {
    likePost({ postId: post.$id, userId: userId });
  };
  const handleSave = async () => {
    savePost({ postId: post.$id, userId: userId });
  };
  return (
    <div className="mt-2">
      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-1 items-center">
          <img
            src={
              post?.isLiked
                ? `/assets/icons/liked.svg`
                : `/assets/icons/like.svg`
            }
            alt="like"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          />
          <p>{post?.likesCount}</p>
        </div>
        <img
          src={
            post?.isSaved ? `/assets/icons/saved.svg` : `/assets/icons/save.svg`
          }
          alt="save"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
        />
      </div>
    </div>
  );
};

export default PostStats;
