import BottomBar from "@/components/ui/shared/BottomBar";
import LeftSidebar from "@/components/ui/shared/LeftSidebar";
import Topbar from "@/components/ui/shared/Topbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="w-full h-screen md:flex overflow-hidden">
      <Topbar />
      <LeftSidebar />
      <section className="h-full flex flex-1 overflow-y-auto pb-[120px] md:pb-0">
        <Outlet />
      </section>
      <BottomBar />
    </div>
  );
};

export default RootLayout;
