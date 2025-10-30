import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router"; // Use this instead of react-router-dom
import { useSearchRestaurant } from "@/app/Api/RestaurantApi";
import CuisineFilter from "@/components/CuisineFilter";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import SearchResultCards from "@/components/SearchResultCard";
import SearchResultInfo from "@/components/SearchResultInfo";
import SortOptionDropDown from "@/components/SortOptionDropdown";

export type SearchState = {
  searchQuery: string;
  page: number;
  selectedCuisines: string[];
  sortOption: string;
};

const SearchScreen = () => {
  const { city } = useLocalSearchParams<{ city: string }>();

  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: "",
    page: 1,
    selectedCuisines: [],
    sortOption: "lastUpdated",
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { results, isLoading } = useSearchRestaurant(searchState, city);

  const setSortOption = (sortOption: string) => {
    setSearchState((prevState) => ({
      ...prevState,
      sortOption,
      page: 1,
    }));
  };

  const setSelectedCuisines = (selectedCuisines: string[]) => {
    setSearchState((prevState) => ({
      ...prevState,
      selectedCuisines,
      page: 1,
    }));
  };

  const setPage = (page: number) => {
    setSearchState((prevState) => ({
      ...prevState,
      page,
    }));
  };

  const setSearchQuery = (searchFormData: SearchForm) => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: searchFormData.searchQuery,
      page: 1,
    }));
  };

  const resetSearch = () => {
    setSearchState((prevState) => ({ ...prevState, searchQuery: "", page: 1 }));
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  if (!results?.data || !city) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-600">Result not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Search Bar */}
      <SearchBar
        searchQuery={searchState.searchQuery}
        onSubmit={setSearchQuery}
        placeholder="Search cuisines or restaurant name"
        onReset={resetSearch}
      />

      {/* Filter & Results */}
      <View className="flex flex-col space-y-6 mt-4">
        {/* Filters */}
        <CuisineFilter
          selectedCuisines={searchState.selectedCuisines}
          onChange={setSelectedCuisines}
          isExpanded={isExpanded}
          onExpandedClick={() => setIsExpanded((prev) => !prev)}
        />

        {/* Sort and Info */}
        <View className="flex flex-col md:flex-row justify-between gap-3">
          <SearchResultInfo
            total={results.pagination.total}
            city={city as string}
          />
          <SortOptionDropDown
            sortOption={searchState.sortOption}
            onChange={setSortOption}
          />
        </View>

        {/* Results */}
        {results.data.length === 0 ? (
          <Text className="text-center text-gray-500 mt-4">
            No restaurants found.
          </Text>
        ) : (
          results.data.map((restaurant) => (
            <SearchResultCards
              key={restaurant.firebaseId}
              restaurant={restaurant}
            />
          ))
        )}

        {/* Pagination */}
        <PaginationSelector
          page={results.pagination.page}
          pages={results.pagination.pages}
          onPageChange={setPage}
        />
      </View>
    </ScrollView>
  );
};

export default SearchScreen;
