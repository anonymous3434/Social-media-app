import Loader from "@/shared/Loader";
import { Models } from "appwrite";
import React from "react";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import GridPostLists from "./GridPostLists";
type SearchType = {
  searchedPosts: Models.Document;
  isSearchingPosts: boolean;
};
const SearchResults = ({ searchedPosts, isSearchingPosts }: SearchType) => {
  if (isSearchingPosts) return <Loader />;
  if (searchedPosts && searchedPosts?.documents.length !== 0) {
    return <GridPostLists posts={searchedPosts?.documents} />;
  }
  return (
    <div className="text-center mt-10 w-full text-light-4 flex items-center justify-center gap-2 text-2xl">
      <p>No results Found</p>
      <SentimentVeryDissatisfiedIcon />
    </div>
  );
};

export default SearchResults;
