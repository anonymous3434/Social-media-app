export type INewUser = {
  name: string;
  username: string;
  email: string;
  password: string;
};
export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImage: string;
  bio: string;
};
export type IContext = {
  user: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthStatus: () => Promise<boolean>;
};
export type INavLink = {
  label: string;
  imgURL: string;
  route: string;
};
export type INewPost = {
  userId: string;
  caption: string;
  location: string;
  tags: string;
  photos: File[];
};
export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  image: string;
  photos: File[];
  location?: string;
  tags?: string;
};
