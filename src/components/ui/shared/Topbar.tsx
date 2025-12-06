import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../button";
import { useAuthContext } from "@/context/auth.constants";
import { useSignoutAccount } from "@/lib/react-query/queriesAndMutation";

const Topbar = () => {
  const { user } = useAuthContext();
  const { mutateAsync: signout, isSuccess: isSignout } = useSignoutAccount();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSignout) navigate("/signin");
  }, [isSignout]);
  return (
    <section className="topbar">
      <div className="flex-between p-3 flex items-center">
        <Link to="/">
          <img src="/assets/images/logo.svg" />
        </Link>
        <div className="flex">
          <Button
            variant="ghost"
            className="shad-button_ghost pr-3"
            onClick={() => signout()}
          >
            <img src="/assets/icons/logout.svg" className="h-7" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`}>
            {user.profileImage && (
              <img
                src={user.profileImage}
                className="h-8 w-8 rounded-full"
                alt="profile"
              />
            )}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
