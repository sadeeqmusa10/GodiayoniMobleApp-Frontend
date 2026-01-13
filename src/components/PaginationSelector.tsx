import { View, Text, Pressable } from "react-native";

type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const PaginationSelector = ({ page, pages, onPageChange }: Props) => {
  const pageNumbers: number[] = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <View className="flex-row justify-center items-center space-x-2 mt-4">
      {/* Previous Button */}
      {page > 1 && (
        <Pressable
          onPress={() => onPageChange(page - 1)}
          className="bg-gray-200 px-3 py-2 rounded-lg"
        >
          <Text className="text-gray-800 font-medium">Prev</Text>
        </Pressable>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((number) => (
        <Pressable
          key={number}
          onPress={() => onPageChange(number)}
          className={`px-3 py-2 rounded-lg ${
            page === number ? "bg-black" : "bg-gray-200"
          }`}
        >
          <Text
            className={`font-medium ${
              page === number ? "text-white" : "text-gray-800"
            }`}
          >
            {number}
          </Text>
        </Pressable>
      ))}

      {/* Next Button */}
      {page < pages && (
        <Pressable
          onPress={() => onPageChange(page + 1)}
          className="bg-gray-200 px-3 py-2 rounded-lg"
        >
          <Text className="text-gray-800 font-medium">Next</Text>
        </Pressable>
      )}
    </View>
  );
};

export default PaginationSelector;
