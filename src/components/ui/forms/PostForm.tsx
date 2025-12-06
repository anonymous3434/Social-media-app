import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Button } from "../button";
import { Textarea } from "../textarea";
import FileUploader from "../shared/FileUploader";
import { Input } from "../input";
import { postValidationSchema } from "@/lib/validations";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutation";
import { useAuthContext } from "@/context/auth.constants";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Models } from "appwrite";
type PostFormType = {
  post?: Models.DefaultDocument;
  action: "Create" | "Update";
};
const PostForm = ({ post, action }: PostFormType) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { mutateAsync: createPost, isPending: isPostCreated } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isPostUpdated } = useUpdatePost(
    post?.$id
  );
  // 1. Define your form.
  const form = useForm<z.infer<typeof postValidationSchema>>({
    resolver: zodResolver(postValidationSchema),
    defaultValues: {
      caption: post ? post.caption : "",
      photos: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof postValidationSchema>) {
    let newPost = null,
      updatedPost = null;
    if (action === "Update") {
      updatedPost = await updatePost({
        ...values,
        imageId: post?.imageId,
        image: post?.image,
        postId: post?.$id,
      });
      if (!updatedPost) {
        toast.error("Post not updated.Try again");
        return;
      }
      navigate(`/posts/${updatedPost?.$id}`);
    } else if (action === "Create") {
      newPost = await createPost({
        ...values,
        userId: user.id,
      });
      if (!newPost) {
        toast.error("Post not created.Try again");
        return;
      }
      navigate(`/posts/${newPost?.$id}`);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photos"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  mediaUrl={post?.image}
                  fieldChange={field.onChange}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Tags</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 items-center">
          <Button type="button" className="shad-button_dark_4">
            Cancel
          </Button>
          <Button type="submit" className="shad-button_primary">
            {isPostCreated || isPostUpdated ? "Loading..." : action}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
