import PostForm from "@/components/ui/forms/PostForm";
import React from "react";

const CreatePost = () => {
  return (
    <section className="flex flex-1">
      <div className="common-container">
        <div className="flex items-center justify-start w-full gap-3 max-w-5xl">
          <img
            src="/assets/icons/add-post.svg"
            alt="add-post"
            height={36}
            width={36}
          />
          <p>Create Post</p>
        </div>
        <PostForm action="Create" />
      </div>
    </section>
  );
};

export default CreatePost;
