import React, { useState } from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

type Props = {
  label?: string;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onLocationSelected: (coords: { lat: number; lng: number }) => void;
};

export default function MapPicker({
  label,
  initialRegion,
  onLocationSelected,
}: Props) {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const handlePress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ lat: latitude, lng: longitude });
    onLocationSelected({ lat: latitude, lng: longitude });
  };

  return (
    <View className="mb-4">
      {label && <Text className="mb-2 font-semibold">{label}</Text>}

      <View className="h-64 rounded-xl overflow-hidden">
        <MapView
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          onPress={handlePress}
        >
          {marker && (
            <Marker
              coordinate={{
                latitude: marker.lat,
                longitude: marker.lng,
              }}
            />
          )}
        </MapView>
      </View>
    </View>
  );
}
