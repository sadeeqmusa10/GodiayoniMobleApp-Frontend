import { Timestamp } from "firebase/firestore";

export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;

  SearchScreen: { city?: string } | undefined;
  UserProfileScreen: undefined;

  DeliveryScreen: undefined;
  DeliveryOrderScreen: { deliveryId: string };

  DeliveryStatusScreen: undefined;
  OrderStatusScreen: {
  orderId: string;
};

  CurrentOrderStatusScreen: {
  orderId: string;
};


  ManageRestaurantScreen: undefined;
  ManageDeliveryScreen: undefined;
  ManageOrdersScreen: undefined;
  AddNewRestaurantScreen: undefined;

  BlockedAccount: undefined;

   DetailScreen: { firebaseId: string };
  CheckoutScreen: { checkoutUrl: string };
};


export type UserRole = "user" | "admin" | "restaurant";

export type User = {
  firebaseId: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  addressLine1?: string;
  city?: string;
  country?: string;
}

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
  restaurantNameLower: string;
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
  firebaseId: string;

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

  deliveryType: "standard" | "express" | "same-day";
  price: number;
  estimatedDeliveryTime: number;

  status: DeliveryStatus;
  paymentReference: string;
  imageUrl: string;

  createdAt: Timestamp | { _seconds: number; _nanoseconds: number };
  lastUpdated?: Timestamp | { _seconds: number; _nanoseconds: number };
}


export default {}
