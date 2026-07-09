import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Platform } from "react-native";

type AddressValue = {
  text: string;
  lat: number;
  lng: number;
};

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (value: AddressValue) => void;
};

const API_BASE =
  Platform.OS === "web"
    ? "http://localhost:8000"
    : "http://YOUR_LOCAL_IP:8000";

export default function AddressInput({
  placeholder,
  value,
  onChangeText,
  onSelect,
}: Props) {
  const [predictions, setPredictions] = useState<any[]>([]);

  const fetchPlaces = async (text: string) => {
    onChangeText(text);

    if (text.length < 3) {
      setPredictions([]);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/google-places/autocomplete?input=${encodeURIComponent(
          text
        )}`
      );

      if (!res.ok) {
        setPredictions([]);
        return;
      }

      const json = await res.json();
      setPredictions(json.predictions || []);
    } catch {
      setPredictions([]);
    }
  };

  const selectPlace = async (placeId: string, description: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/google-places/details?placeId=${placeId}`
      );
      const json = await res.json();

      const location = json.result.geometry.location;

      onSelect({
        text: description,
        lat: location.lat,
        lng: location.lng,
      });

      setPredictions([]);
    } catch {}
  };

  return (
    <View className="mb-2">
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={fetchPlaces}
        className="border rounded-lg px-3 py-3 bg-white"
      />

      {predictions.map((item) => (
        <TouchableOpacity
          key={item.place_id}
          onPress={() => selectPlace(item.place_id, item.description)}
          className="bg-white border-b px-3 py-2"
        >
          <Text>{item.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
