import { View, Text } from "react-native";
import { Order } from "../types";

type Props = {
  order: Order;
};

const OrderStatusDetail = ({ order }: Props) => {
  return (
    <View className="space-y-5 p-4">
      {/* Delivery Details */}
      <View className="flex flex-col">
        <Text className="font-bold text-lg">Delivering to:</Text>
        <Text className="text-gray-800">{order.deliveryDetails.name}</Text>
        <Text className="text-gray-800">
          {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
        </Text>
      </View>

      {/* Cart Items */}
      <View className="flex flex-col">
        <Text className="font-bold text-lg mb-2">Your Order</Text>
        {order.cartItems.map((item, id) => (
          <Text key={id} className="text-gray-800">
            {item.name} x {item.quantity}
          </Text>
        ))}
      </View>

      {/* Separator */}
      <View className="border-t border-gray-300 my-2" />

      {/* Total */}
      <View className="flex flex-col">
        <Text className="font-bold text-lg">Total</Text>
        <Text className="text-gray-800 text-base">
          ₦{order.totalAmount.toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

export default OrderStatusDetail;
