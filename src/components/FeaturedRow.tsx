import FoodCard from "../components/FoodCards";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MenuItem } from "../types";

type Props = {
  name: string;
  price: string;
  foodCard: MenuItem[];
};

export default function FeaturedRow({
  name,
  price,
  foodCard,
}: Props) {
  return (
    <View>
      <View className="flex-row justify-between items-center px-4">
        <View>
          <Text className="font-bold text-lg">{name}</Text>
          <Text className="font-bold text-lg">{price}</Text>
        </View>

        <TouchableOpacity>
          <Text className="font-semibold text-orange-600">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="overflow-visible py-4"
      >
        {foodCard.map((item) => (
          <FoodCard key={item.id} menuItem={item} />
        ))}
      </ScrollView>
    </View>
  );
}