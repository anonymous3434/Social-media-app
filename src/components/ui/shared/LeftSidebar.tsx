import { sidebarLinks } from "@/constants";
import { useAuthContext } from "@/context/auth.constants";
import { INavLink } from "@/types";
import React, { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../button";
import { useSignoutAccount } from "@/lib/react-query/queriesAndMutation";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { pathname } = useLocation();
  const { mutateAsync: signout, isSuccess: isSignout } = useSignoutAccount();
  useEffect(() => {
    if (isSignout) navigate("/signin");
  }, [isSignout]);
  return (
    <div className="leftsidebar">
      <div className="flex flex-col gap-2">
        <Link to="/">
          <img
            src="/assets/images/logo.svg"
            alt="logwo"
            className="h-24 w-full"
          />
        </Link>
        <Link className="flex gap-4" to="/">
          {user.profileImage && (
            <img
              src={user?.profileImage}
              className="h-12 w-12 rounded-full"
              alt="profile"
            />
          )}
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="small-regular text-light-3 font-semibold">
              @{user.username}
            </p>
          </div>
        </Link>
        <ul className="flex flex-col gap-2">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`group leftsidebar-link p-4 ${
                  isActive ? "bg-primary-500" : null
                }`}
              >
                <NavLink to={link.route} className="flex gap-2">
                  <img
                    src={link.imgURL}
                    alt="image"
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => signout()}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium">Logout</p>
      </Button>
    </div>
  );
};

export default LeftSidebar;
