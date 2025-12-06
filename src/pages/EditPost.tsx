import PostForm from "@/components/ui/forms/PostForm";
import { useGetPostById } from "@/lib/react-query/queriesAndMutation";
import Loader from "@/shared/Loader";
import React from "react";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const { data: selectedPostData, isPending } = useGetPostById(id);
  return (
    <section className="flex flex-1">
      {!isPending ? (
        <div className="common-container">
          <div className="flex items-center justify-start w-full gap-3 max-w-5xl">
            <img
              src="/assets/icons/add-post.svg"
              alt="add-post"
              height={36}
              width={36}
            />
            <p>Edit Post</p>
          </div>
          <PostForm post={selectedPostData} action="Update" />
        </div>
      ) : (
        <Loader />
      )}
    </section>
  );
};

export default EditPost;
