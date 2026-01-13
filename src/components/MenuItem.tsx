import { View, Text, Image, TouchableOpacity } from "react-native";
import { MenuItem as MenuItemType } from "../types";

type Props = {
  menuItem: MenuItemType;
  addToCart: () => void;
};

const MenuItem = ({ menuItem, addToCart }: Props) => {
  return (
    <View className="bg-white rounded-2xl shadow-sm shadow-black/10 mb-4 overflow-hidden">
      {/* Image */}
      {menuItem.imageUrl && (
        <Image
          source={{ uri: menuItem.imageUrl }}
          className="w-full h-40"
          resizeMode="cover"
        />
      )}

      {/* Info */}
      <View className="p-4">
        <Text className="text-lg font-semibold text-gray-900">
          {menuItem.name}
        </Text>

        <View className="flex-row items-center justify-between mt-3">
          <Text className="text-lg font-bold text-gray-800">
            ₦{menuItem.price.toLocaleString()}
          </Text>

          <TouchableOpacity
            onPress={addToCart}
            className="bg-orange-500 py-2 px-4 rounded-lg"
          >
            <Text className="text-white font-semibold text-sm">
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MenuItem;
