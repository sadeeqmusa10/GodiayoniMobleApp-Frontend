import { Text, ActivityIndicator, Pressable, View } from "react-native";

const LoadingButton = () => {
  return (
    <Pressable
      disabled
      className="flex flex-row items-center justify-center bg-gray-400 px-4 py-2 rounded-lg opacity-80"
    >
      <View className="mr-2">
        <ActivityIndicator size="small" color="#fff" />
      </View>
      <Text className="text-white font-semibold">Loading...</Text>
    </Pressable>
  );
};

export default LoadingButton;
