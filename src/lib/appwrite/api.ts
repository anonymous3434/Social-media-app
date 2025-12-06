import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteconfig, avatar, database, storage } from "./config";
import { ID, Query } from "appwrite";
import { useAuthContext } from "@/context/auth.constants";
import { promise } from "zod";
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatar.getInitials(user.name);
    const newUser = await saveToDb({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      profileImage: avatarUrl,
      username: user.username,
    });
    return newUser;
  } catch (error) {
    console.error(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );
    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
  } catch (error) {
    console.error(error);
  }
}

export async function createPost(post: INewPost) {
  // upload to storage
  const uploadedFile = await uploadFile(post.photos[0]);
  if (!uploadedFile) throw Error;
  // get file URL
  const fileUrl = getFilePreview(uploadedFile?.$id);
  if (!fileUrl) {
    //delete file if fileUrl did not generated
    deleteFile(uploadedFile?.$id);
    throw Error;
  }
  const tags = post.tags.split(",");
  try {
    const newPost = await database.createDocument(
      appwriteconfig.databaseId,
      "posts",
      ID.unique(),
      {
        creator: post.userId,
        location: post.location,
        caption: post.caption,
        tags: tags,
        image: fileUrl,
        imageId: uploadedFile.$id,
      }
    );
    if (!newPost) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }
    return newPost;
  } catch (error) {
    console.error(error);
  }
}
export async function updatePost(post: IUpdatePost) {
  let imageObj = {
    imageId: post?.imageId,
    image: post?.image,
  };
  const hasFileToUpload = post.photos.length > 0;
  // upload to storage
  if (hasFileToUpload) {
    const uploadedFile = await uploadFile(post.photos[0]);
    if (!uploadedFile) throw Error;
    // get file URL
    const fileUrl = getFilePreview(uploadedFile?.$id);
    if (!fileUrl) {
      //delete file if fileUrl did not generated
      deleteFile(uploadedFile?.$id);
      throw Error;
    }
    imageObj = { ...imageObj, image: fileUrl, imageId: uploadedFile?.$id };
  }

  const tags = post?.tags && post?.tags.split(",");
  try {
    const updatedPost = await database.updateDocument(
      appwriteconfig.databaseId,
      "posts",
      post.postId,
      {
        location: post.location,
        caption: post.caption,
        tags: tags,
        image: imageObj.image,
        imageId: imageObj.imageId,
      }
    );
    if (!updatePost) {
      await deleteFile(imageObj.imageId);
      throw Error;
    }
    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteFile(fileId: string) {
  await storage.deleteFile(appwriteconfig.storageId, fileId);
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFileView(appwriteconfig.storageId, fileId);
    return fileUrl;
  } catch (error) {
    console.error(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteconfig.storageId,
      ID.unique(),
      file
    );
    if (!uploadedFile) throw Error;
    return uploadedFile;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;
    const currentUser = await database.listDocuments(
      appwriteconfig.databaseId,
      "users",
      [Query.equal("accountId", currentAccount.$id)]
    );
    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
  }
}
export async function getCurrentSavedPosts(userId: string) {
  try {
    const savedDocs = await database.listDocuments(
      appwriteconfig.databaseId,
      "saves",
      [Query.equal("userId", userId)]
    );
    if (!savedDocs) throw Error;
    const fullPostsData = await Promise.all(
      savedDocs.documents.map(async (savedDoc) => {
        const postDetails = await database.getDocument(
          appwriteconfig.databaseId,
          "posts",
          savedDoc.postId
        );
        return postDetails;
      })
    );
    return fullPostsData;
  } catch (error) {
    console.error("getCurrentSavedPosts error:", error);
    return [];
  }
}

export async function saveToDb(user: {
  accountId: string;
  name: string;
  email: string;
  profileImage: string;
  username?: string;
}) {
  try {
    const newUser = await database.createDocument(
      appwriteconfig.databaseId,
      "users",
      ID.unique(),
      user
    );
    console.error(newUser);
    return newUser;
  } catch (error) {
    console.error(error);
  }
}

export async function getRecentPosts({ userId }: { userId: string }) {
  try {
    const allRecentPosts = await database.listDocuments(
      appwriteconfig.databaseId,
      "posts",
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    const finalPostData = await Promise.all(
      allRecentPosts.documents.map(async (post) => {
        // Creator (single id -> fetch user doc)
        let creatorData = null,
          existingLike = null,
          isLikedByCurrentUser = null,
          totalLikes = null,
          existingSave = null,
          isSavedByCurrentUser = null;
        try {
          //creator Data
          creatorData = await database.getDocument(
            appwriteconfig.databaseId,
            "users",
            post.creator
          );
          //current user liked
          existingLike = await database.listDocuments(
            appwriteconfig.databaseId,
            "likes",
            [Query.equal("userId", userId), Query.equal("postId", post.$id)]
          );
          isLikedByCurrentUser = existingLike.total > 0;
          //current User Saved
          existingSave = await database.listDocuments(
            appwriteconfig.databaseId,
            "saves",
            [Query.equal("userId", userId), Query.equal("postId", post.$id)]
          );
          isSavedByCurrentUser = existingSave.total > 0;
          //total likes on this post
          totalLikes = await database.listDocuments(
            appwriteconfig.databaseId,
            "likes",
            [Query.equal("postId", post.$id)]
          );
        } catch (e) {
          console.error("no creator", e);
        }
        return {
          ...post,
          creator: creatorData,
          isLiked: isLikedByCurrentUser,
          likesCount: totalLikes?.total,
          isSaved: isSavedByCurrentUser,
        };
      })
    );
    return finalPostData;
  } catch (error) {
    console.error(error);
  }
}

export async function likePost({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  try {
    const existing = await database.listDocuments(
      appwriteconfig.databaseId,
      "likes",
      [Query.equal("postId", postId), Query.equal("userId", userId)]
    );
    if (!existing) throw Error;
    if (existing.total === 0) {
      // create like
      const like = await database.createDocument(
        appwriteconfig.databaseId,
        "likes",
        ID.unique(),
        { postId, userId }
      );
      return { liked: true };
    } else {
      // delete like
      const unlike = await database.deleteDocument(
        appwriteconfig.databaseId,
        "likes",
        existing.documents[0].$id
      );
      return { liked: false };
    }
  } catch (error) {
    console.error(error);
  }
}
export async function savePost({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  try {
    const existing = await database.listDocuments(
      appwriteconfig.databaseId,
      "saves",
      [Query.equal("postId", postId), Query.equal("userId", userId)]
    );
    if (!existing) throw Error;
    if (existing.total === 0) {
      // create like
      const save = await database.createDocument(
        appwriteconfig.databaseId,
        "saves",
        ID.unique(),
        { postId, userId }
      );
      return { saved: true };
    } else {
      // delete like
      const unSave = await database.deleteDocument(
        appwriteconfig.databaseId,
        "saves",
        existing.documents[0].$id
      );
      return { saved: false };
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const wantedPost = await database.getDocument(
      appwriteconfig.databaseId,
      "posts",
      postId
    );
    if (!wantedPost) throw Error;
    let finalWantedPost = await database.getDocument(
      appwriteconfig.databaseId,
      "users",
      wantedPost?.creator
    );
    finalWantedPost = { ...wantedPost, creator: finalWantedPost };
    return finalWantedPost;
  } catch (error) {
    console.error(error);
  }
}

export async function getInfinitePosts({
  pageParam,
}: {
  pageParam: string | null;
}) {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(2)];
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const posts = await database.listDocuments(
      appwriteconfig.databaseId,
      "posts",
      queries
    );
    if (!posts) throw Error;
    const postsWithUsers = await Promise.all(
      posts.documents.map(async (post) => {
        // creator data
        try {
          const creatorData = await database.getDocument(
            appwriteconfig.databaseId,
            "users",
            post?.creator
          );
          if (!creatorData) throw Error;
          // post liked by current user
          const hasLiked = await database.listDocuments(
            appwriteconfig.databaseId,
            "likes",
            [
              Query.equal("userId", creatorData.$id),
              Query.equal("postId", post.$id),
            ]
          );
          if (!hasLiked) throw Error;
          //total likes
          const totalLikes = await database.listDocuments(
            appwriteconfig.databaseId,
            "likes",
            [Query.equal("postId", post?.$id)]
          );
          if (!totalLikes) throw Error;
          //is current post saved
          const hasSaved = await database.listDocuments(
            appwriteconfig.databaseId,
            "saves",
            [
              Query.equal("userId", creatorData.$id),
              Query.equal("postId", post.$id),
            ]
          );
          if (!hasSaved) throw Error;
          return {
            ...post,
            creator: creatorData ?? null,
            isLiked: hasLiked.total > 0,
            likesCount: totalLikes.total,
            isSaved: hasSaved.total > 0,
          };
        } catch (error) {
          console.error(error);
          return post;
        }
      })
    );
    return { ...posts, documents: postsWithUsers };
  } catch (error) {
    console.error(error);
    return { documents: [] };
  }
}
export async function getSearchPosts({ searchTerm }: { searchTerm: string }) {
  try {
    const posts = await database.listDocuments(
      appwriteconfig.databaseId,
      "posts",
      [Query.search("caption", searchTerm)]
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const selectedUser = await database.getDocument(
      appwriteconfig.databaseId,
      "users",
      userId
    );
    if (!selectedUser) throw Error;
    const posts = await database.listDocuments(
      appwriteconfig.databaseId,
      "posts",
      [Query.equal("creator", selectedUser?.$id)]
    );
    if (!posts) throw Error;
    return { ...selectedUser, posts: posts.documents };
  } catch (error) {
    console.error(error);
  }
}
export async function getUsers() {
  const users = await database.listDocuments(
    appwriteconfig.databaseId,
    "users",
    [Query.orderDesc("$createdAt")]
  );
  if (!users) throw Error;
  return users.documents;
}
