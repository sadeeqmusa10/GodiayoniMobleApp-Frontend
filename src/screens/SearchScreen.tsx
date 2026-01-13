import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useSearchRestaurant } from "../Api/RestaurantApi";
import CuisineFilter from "../components/CuisineFilter";
import PaginationSelector from "../components/PaginationSelector";
import SearchBar, { SearchForm } from "../components/SearchBar";
import SearchResultCard from "../components/SearchResultCard";
import SearchResultInfo from "../components/SearchResultInfo";
import SortOptionDropDown from "../components/SortOptionDropdown";
import { RootStackParamList } from "@/types";

export type SearchState = {
  searchQuery: string;
  page: number;
  selectedCuisines: string[];
  sortOption: string;
};

const SearchScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "SearchScreen">>();
  const city = route.params?.city ?? "";

  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: "",
    page: 1,
    selectedCuisines: [],
    sortOption: "lastUpdated",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // ⛔ DO NOT fetch if city is missing
  const { results, isLoading } = useSearchRestaurant(searchState, city);

  // ✅ EARLY RETURNS (SAFE)
  if (!city) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-600">City not provided</Text>
      </View>
    );
  }

  if (isLoading || !results) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <SearchBar
        searchQuery={searchState.searchQuery}
        placeholder="Search cuisines or restaurant name"
        onSubmit={(data: SearchForm) =>
          setSearchState((prev) => ({
            ...prev,
            searchQuery: data.searchQuery,
            page: 1,
          }))
        }
        onReset={() =>
          setSearchState((prev) => ({
            ...prev,
            searchQuery: "",
            page: 1,
          }))
        }
      />

      <View className="flex flex-col space-y-6 mt-4">
        <CuisineFilter
          selectedCuisines={searchState.selectedCuisines}
          isExpanded={isExpanded}
          onExpandedClick={() => setIsExpanded((prev) => !prev)}
          onChange={(selectedCuisines) =>
            setSearchState((prev) => ({
              ...prev,
              selectedCuisines,
              page: 1,
            }))
          }
        />

        <View className="flex flex-col md:flex-row justify-between gap-3">
          <SearchResultInfo
            total={results.pagination.total}
            city={city}
          />

          <SortOptionDropDown
            sortOption={searchState.sortOption}
            onChange={(sortOption) =>
              setSearchState((prev) => ({
                ...prev,
                sortOption,
                page: 1,
              }))
            }
          />
        </View>

        {results.data.length === 0 ? (
          <Text className="text-center text-gray-500 mt-4">
            No restaurants found.
          </Text>
        ) : (
          results.data.map((restaurant) => (
            <SearchResultCard
              key={restaurant.firebaseId}
              restaurant={restaurant}
            />
          ))
        )}

        <PaginationSelector
          page={results.pagination.page}
          pages={results.pagination.pages}
          onPageChange={(page) =>
            setSearchState((prev) => ({ ...prev, page }))
          }
        />
      </View>
    </ScrollView>
  );
};

export default SearchScreen;
