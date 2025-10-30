import React, { useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react-native";

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

  const handleReset = () => {
    reset({ searchQuery: "" });
    if (onReset) onReset();
  };

  const value = watch("searchQuery");

  return (
    <View
      className={`flex-row items-center w-full max-w-md border-2 rounded-full px-4 py-2 
        ${formState.errors.searchQuery ? "border-red-500" : "border-gray-300"}
      `}
    >
      <Search size={22} color="#f97316" strokeWidth={2.5} className="mr-2" />

      <Controller
        control={control}
        name="searchQuery"
        render={({ field: { value, onChange } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            className="flex-1 text-base"
            placeholderTextColor="#9ca3af"
          />
        )}
      />

      {value ? (
        <TouchableOpacity
          onPress={handleReset}
          className="px-3 py-1 bg-gray-100 rounded-full mr-2"
        >
          <Text className="text-gray-600">Reset</Text>
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="px-4 py-2 bg-orange-500 rounded-full"
      >
        <Text className="text-white font-bold">Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
