import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
  QueryClient,
} from "@tanstack/react-query";
import {
  createPost,
  createUserAccount,
  getCurrentSavedPosts,
  getCurrentUser,
  getInfinitePosts,
  getPostById,
  getRecentPosts,
  getSearchPosts,
  getUserById,
  getUsers,
  likePost,
  savePost,
  signInAccount,
  signOutAccount,
  updatePost,
} from "../appwrite/api";
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { QUERY_KEYS } from "./queryKeys";
import { Models } from "appwrite";
import { use } from "react";
type AppwritePage = {
  total: number;
  documents: Models.Document[];
};
export type FeedPost = Models.Document & {
  creator: Models.Document;
  isLiked: boolean;
  isSaved: boolean;
  likesCount: number;
};
export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};
export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignoutAccount = () => {
  return useMutation({
    mutationFn: () => signOutAccount(),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POST],
      });
    },
  });
};
export const useUpdatePost = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
      });
    },
  });
};
export const useGetRecentPosts = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS, userId],
    queryFn: () => getRecentPosts({ userId }),
    enabled: !!userId, // prevents running before userId is available
    staleTime: 1000 * 300,
  });
};

export const useUpdateLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      likePost({ postId, userId }),
    onMutate: async ({
      postId,
      userId,
    }: {
      postId: string;
      userId: string;
    }) => {
      const queryKey = [QUERY_KEYS.GET_RECENT_POSTS, userId];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<FeedPost[]>(queryKey);
      if (previous) {
        const next = previous.map((tempPost) => {
          if (tempPost.$id !== postId) return tempPost;
          const isLiked = !!tempPost.isLiked;
          const likesCount = (tempPost.likesCount ?? 0) + (isLiked ? -1 : 1);
          return { ...tempPost, isLiked: !isLiked, likesCount };
        });
        queryClient.setQueryData(queryKey, next);
      }
      return { previous, queryKey };
    },
    onError: (err, variables, context) => {
      //rollback code
      if (context?.previous && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
    },
    onSettled: (data, error, variables, context) => {
      //refresh to ensure server truth
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
};
export const useUpdateSave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost({ postId, userId }),
    onMutate: async ({
      postId,
      userId,
    }: {
      postId: string;
      userId: string;
    }) => {
      const queryKey = [QUERY_KEYS.GET_RECENT_POSTS, userId];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<FeedPost[]>(queryKey);
      if (previous) {
        const next = previous.map((tempPost) => {
          if (tempPost.$id !== postId) return tempPost;

          const isSaved = !!tempPost.isSaved;
          return { ...tempPost, isSaved: !isSaved };
        });
        queryClient.setQueryData(queryKey, next);
      }
      return { previous, queryKey };
    },
    onError: (err, variables, context) => {
      //rollback code
      if (context?.previous && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
    },
    onSettled: (data, error, variables, context) => {
      //refresh to ensure server truth
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POST],
      });
    },
  });
};
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: () => {
      return getCurrentUser();
    },
  });
};
export const useGetSavedPosts = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_SAVED_POSTS, userId],
    queryFn: () => getCurrentSavedPosts(userId),
    enabled: !!userId,
  });
};
export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POST],
    queryFn: getInfinitePosts,
    initialPageParam: null,
    getNextPageParam: (lastPage: AppwritePage) => {
      if (!lastPage?.documents?.length) return null;

      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;

      return lastId;
    },
  });
};

export const useSearchPost = ({ searchTerm }: { searchTerm: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SEARCH_POSTS, searchTerm],
    queryFn: () => {
      return getSearchPosts({ searchTerm: searchTerm });
    },
    enabled: !!searchTerm,
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
  });
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(),
  });
};
