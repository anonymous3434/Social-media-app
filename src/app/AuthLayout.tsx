import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
const AuthLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex items-center justify-center flex-1">
            <Outlet />
          </section>
          <img
            className="hidden xl:block w-1/2 bg-no-repeat object-cover h-screen"
            src="/assets/images/side-img.svg"
            alt="side-image"
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
