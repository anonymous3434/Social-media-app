import "./global.css";
import { Route, Routes } from "react-router";
import AuthLayout from "./AuthLayout";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import Home from "../pages/Home";
import { Toaster } from "sonner";
import RootLayout from "./RootLayout";
import Explore from "@/pages/Explore";
import AllUsers from "@/pages/AllUsers";
import Saved from "@/pages/Saved";
import CreatePost from "@/pages/CreatePost";
import PostDetails from "@/pages/PostDetails";
import EditPost from "@/pages/EditPost";
import Profile from "@/pages/Profile";
import UpdateProfile from "@/pages/UpdateProfile";
function App() {
  return (
    <main className="flex h-screen w-full">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Route>
        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id/*" element={<UpdateProfile />} />
        </Route>
      </Routes>
      <Toaster position="top-center" richColors />
    </main>
  );
}

export default App;
