import React, { useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/nativewindui/Button";

const formSchema = z.object({
  searchQuery: z.string().min(1, "Restaurant name is required!"),
});

export type SearchForm = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (formData: SearchForm) => void;
  placeholder: string;
  onReset?: () => void;
  searchQuery: string;
};

const SearchBar = ({ onSubmit, onReset, placeholder, searchQuery }: Props) => {
  const { control, handleSubmit, reset, watch, formState } =
    useForm<SearchForm>({
      resolver: zodResolver(formSchema),
      defaultValues: { searchQuery },
    });

  useEffect(() => {
    reset({ searchQuery });
  }, [searchQuery, reset]);

  const currentValue = watch("searchQuery");

  return (
    <View
      className={`flex-row items-center gap-3 w-full border-2 rounded-full px-4 py-2 ${
        formState.errors.searchQuery ? "border-red-500" : "border-gray-300"
      }`}
    >
      <MaterialIcons name="search" size={22} color="#f97316" />

      <Controller
        control={control}
        name="searchQuery"
        render={({ field: { value, onChange } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            className="flex-1 text-base text-gray-800"
            placeholderTextColor="#9ca3af"
          />
        )}
      />

      {currentValue?.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            reset({ searchQuery: "" });
            onReset?.();
          }}
          className="px-3 py-1 bg-gray-200 rounded-full"
        >
          <Text className="text-gray-700">Reset</Text>
        </TouchableOpacity>
      )}

      <Button
        onPress={handleSubmit(onSubmit)}
        className="px-4 py-2 bg-orange-500 rounded-full"
      >
        <Text className="text-white font-bold">Search</Text>
      </Button>
    </View>
  );
};

export default SearchBar;
