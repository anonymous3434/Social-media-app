import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const BottomBar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      <ul className="flex justify-between w-full">
        {sidebarLinks.map((link: INavLink) => {
          const isActive = pathname === link.route;

          return (
            <li key={link.label}>
              <NavLink
                to={link.route}
                className={`flex flex-col gap-1 items-center justify-center ${
                  isActive && "bg-primary-500 rounded-[10px] p-1"
                } transition
                `}
              >
                <img
                  src={link?.imgURL}
                  alt="image"
                  className={`h-8 ${isActive && "invert-white"}`}
                />
                <p className="tiny-large text-light-2">{link.label}</p>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default BottomBar;
