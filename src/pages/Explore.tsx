import { Input } from "@/components/ui/input";
import GridPostLists from "@/components/ui/shared/GridPostLists";
import SearchResults from "@/components/ui/shared/SearchResults";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetPosts,
  useSearchPost,
} from "@/lib/react-query/queriesAndMutation";
import Loader from "@/shared/Loader";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
const Explore = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);
  const {
    data: allPosts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useGetPosts();
  const { data: searchedPosts, isPending: isSearchingPosts } = useSearchPost({
    searchTerm: debouncedValue,
  });
  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = shouldShowSearchResults;
  useEffect(() => {
    if (inView && !searchValue && hasNextPage) fetchNextPage();
  }, [inView, searchValue, hasNextPage, fetchNextPage]);
  if (!allPosts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="text-3xl font-bold">Search Posts</h2>
        {/* Search bar */}
        <div className="flex rounded-lg px-4 w-full gap-1 bg-dark-4">
          <img src="/assets/icons/search.svg" alt="search" />
          <Input
            type="text"
            className="explore-search"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      {/* filter */}
      <div className="w-full flex-between max-w-5xl mt-16 mb-7">
        <h2>Popular today</h2>
        <div className="flex-center gap-3 rounded-xl bg-dark-3 px-4 py-2">
          <p className="small-medium text-light-2">All</p>
          <img src="/assets/icons/filter.svg" alt="" height={20} width={20} />
        </div>
      </div>
      <div className="max-w-5xl flex flex-wrap gap-9 w-full">
        {shouldShowSearchResults ? (
          <SearchResults
            searchedPosts={searchedPosts}
            isSearchingPosts={isSearchingPosts}
          />
        ) : shouldShowPosts ? (
          <p>End of Posts</p>
        ) : (
          allPosts.pages.map((item, index) => {
            return (
              <GridPostLists posts={item?.documents} key={`page-${index}`} />
            );
          })
        )}
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className="h-10 w-full bg-transparent"></div>
      )}
      {isFetchingNextPage ? (
        <div className="flex gap-1">
          Loading...
          <Loader />
        </div>
      ) : (
        "Scroll to load more"
      )}
    </div>
  );
};

export default Explore;
