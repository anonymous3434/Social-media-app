import GridPostLists from "@/components/ui/shared/GridPostLists";
import { useAuthContext } from "@/context/auth.constants";
import { useGetSavedPosts } from "@/lib/react-query/queriesAndMutation";
import Loader from "@/shared/Loader";

const Saved = () => {
  const { user } = useAuthContext();
  const { data: currentUser } = useGetSavedPosts(user?.id);

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {currentUser.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostLists posts={currentUser} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
