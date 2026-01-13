import { View, Text, Pressable, Linking } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; // FontAwesome5 gives us brands like Twitter/X
import { LinearGradient } from "expo-linear-gradient";

const Footer = () => {
  const iconBase = "w-10 h-10 rounded-full flex items-center justify-center";

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <View className="bg-black py-8 px-6">
      <View className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo / Title */}
        <Text className="text-2xl text-white font-bold text-center">
          Godiyaoni Delivery Service
        </Text>

        {/* Legal Links */}
        <View className="flex flex-row gap-4">
          <Text className="text-white font-semibold">Privacy & Policy</Text>
          <Text className="text-white font-semibold">Terms & Conditions</Text>
        </View>

        {/* Social Media */}
        <View className="flex flex-row gap-4">
          <Pressable
            onPress={() => openLink("https://facebook.com")}
            className={`${iconBase} bg-[#1877F2]`}
          >
            <FontAwesome name="facebook" size={20} color="#fff" />
          </Pressable>

          <Pressable
            onPress={() => openLink("https://x.com")}
            className={`${iconBase} bg-[#1DA1F2]`}
          >
            <FontAwesome5 name="twitter" size={20} color="#fff" />
          </Pressable>

          {/* Instagram gradient */}
          <Pressable onPress={() => openLink("https://instagram.com")}>
            <LinearGradient
              colors={["#F58529", "#DD2A7B", "#8134AF"]}
              start={[0, 0]}
              end={[1, 1]}
              className={`${iconBase} items-center justify-center`}
            >
              <FontAwesome name="instagram" size={20} color="#fff" />
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => openLink("https://linkedin.com")}
            className={`${iconBase} bg-[#0A66C2]`}
          >
            <FontAwesome name="linkedin" size={20} color="#fff" />
          </Pressable>

          <Pressable
            onPress={() => openLink("https://whatsapp.com")}
            className={`${iconBase} bg-[#25D366]`}
          >
            <FontAwesome name="whatsapp" size={20} color="#fff" />
          </Pressable>
          
        </View>
      </View>
    </View>
  );
};

export default Footer;
