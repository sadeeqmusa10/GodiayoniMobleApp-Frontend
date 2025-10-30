import { Timestamp } from "firebase/firestore";

export type User = {
  firebaseId: string;
  email: string;
  name: string;
  phone: string;
  addressLine1: string;
  city: string;
  country: string;
};

export type MenuItem = {
  imageUrl: any;
  id: string;
  name: string;
  price: number;
};

export type Restaurant = {
  restaurantId: string;
  firebaseId: string;
  User: string;
  restaurantName: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: string[];
  menuItem: MenuItem[];
  imageUrl: string;
  lastUpdated: Date;
  orders?: Order[];
};

export type RestaurantSearchResponse = {
  data: Restaurant[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type OrderStatus =
  | "placed"
  | "paid"
  | "inProgress"
  | "outForDelivery"
  | "delivered";

export type Order = {
  id: string;
  firebaseId: string;
  restaurant: Restaurant;
  user: User;
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    name: string;
    addressLine1: string;
    city: string;
    email: string;
  };
  totalAmount: number;
  status: OrderStatus;
  createdAt: Timestamp | { _seconds: number; _nanoseconds: number };
  restaurantId: string;
};

export type DeliveryStatus =
  | "placed"
  | "paid"
  | "inProgress"
  | "outForDelivery"
  | "delivered";

export interface Delivery {
  deliveryId: string;
  url: string;
  firebaseId: string;
  userId: string;
  sender: {
    name: string;
    phone: string;
    pickupAddress: string;
  };
  receiver: {
    name: string;
    phone: string;
    dropoffAddress: string;
  };
  package: {
    description: string;
    weight: number;
    value: number;
  };
  estimatedDeliveryTime: number;
  deliveryType: "standard" | "express" | "same-day";
  price: number;
  status: DeliveryStatus;
  createdAt: Timestamp | { _seconds: number; _nanoseconds: number };
  paymentReference: string;
  imageUrl: string; // ✅ Add this
}

export default {}
