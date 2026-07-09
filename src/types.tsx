import type { Timestamp } from "firebase/firestore";
import { CartItem } from "./screens/DetailScreen";
import { OrderDetailsData } from "./forms/order-details-form/OrderDetailsForm";

export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;

  SearchScreen?: { city: string };
  UserProfileScreen: undefined;

  DeliveryScreen: undefined;
  DoorToDoorDeliveryScreen: undefined;
  MotorParkDeliveryScreen: undefined;
  WayBillDeliveryScreen : undefined;
  CargoScreen: undefined;
  CourrierServiceScreen: undefined;
  ShippingClearingandForwardingScreen: undefined
  
  DeliveryOrderScreen: { deliveryId: string };

  DeliveryStatusScreen: undefined;
  OrderStatusScreen: undefined;

OrderReviewScreen: {
  restaurant: Restaurant;
  cartItems: CartItem[];
  deliveryDetails: OrderDetailsData;
};

  CurrentOrderStatusScreen: {
  orderId?: string;
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
  addressLine1?: {
      lat: number;
      lng: number;
     text:string;
    };
  city?: string;
  country?: string;
}

export type MenuItem = {
  imageUrl: any;
  id: string;
  name: string;
  price: number;
  restaurantId: string;
};

export type Restaurant = {
  restaurantId: string;
  firebaseId: string;
  User: string;
  restaurantName: string;
  restaurantNameLower: string;
  address: {
      lat: number;
      lng: number;
     text:string;
    };
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

 export interface RestaurantSnapshot {
  name: string;
  imageUrl?: string;
  addressText?: string;
  lat?: number;
  lng?: number;
}


export type Order = {
  id: string;
  firebaseId: string;
  restaurantSnapshot: RestaurantSnapshot;
  user: User;
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
    imageUrl:string;
  }[];
  deliveryDetails: {
    name: string;
    addressLine1: {
      lat: number;
      lng: number;
     text:string;
    };
    city: string;
    email: string;
  };
  deliveryTimeMinutes: number;
   orderType: "delivery" | "takeaway" | "dining";
  deliveryType?: "standard" | "express" | "same-day";
  deliveryPrice: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Timestamp | { _seconds: number; _nanoseconds: number };
  restaurantId: string;
};

export type DeliveryType =
| "express"
| "same-day"
| "standard"

export type DeliveryStatus =
  | "placed"
  | "paid"
  | "inProgress"
  | "outForDelivery"
  | "delivered";

export interface PickUpDelivery {
  deliveryId: string;
  userId: string | null;

  sender: {
    name: string;
    phone: string;
    address: {
      lat: number;
      lng: number;
     text:string;
    };
  };

  receiver: {
    name: string;
    phone: string;
    address: {
      
      lat: number;
      lng: number;
      text: string;
    };
  };

  package: {
    description: string;
    weight: number;
    value: number;
  };

  deliveryType: "standard" | "express" | "same-day";
  price: number;
  distanceMeters: number;
  estimatedDeliveryTime: number;

  imageUrl: string;

  status: DeliveryStatus;
  paymentReference?: string;
 createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };

  lastUpdated?: {
    _seconds: number;
    _nanoseconds: number;
  };
}


export interface DooToDoorDelivery {
  deliveryId: string;
  userId: string | null;

  sender: {
    name: string;
    phone: string;
    address: {
      lat: number;
      lng: number;
     text:string;
    };
  };

  receiver: {
    name: string;
    phone: string;
    address: {
      
      lat: number;
      lng: number;
      text: string;
    };
  };

  package: {
    description: string;
    weight: number;
    value: number;
  };

  deliveryType: "standard" | "express" | "same-day";
  price: number;
  distanceMeters: number;
  estimatedDeliveryTime: number;

  imageUrl: string;

  status: DeliveryStatus;
  paymentReference?: string;
 createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };

  lastUpdated?: {
    _seconds: number;
    _nanoseconds: number;
  };
}


export interface MotorParkDelivery {
  deliveryId: string;
  userId: string | null;

  sender: {
    name: string;
    phone: string;
    address: {
      lat: number;
      lng: number;
     text:string;
    };
  };

  receiver: {
    name: string;
    phone: string;
    address: {
      
      lat: number;
      lng: number;
      text: string;
    };
  };

  package: {
    description: string;
    weight: number;
    value: number;
  };

  deliveryType: "standard" | "express" | "same-day";
  price: number;
  distanceMeters: number;
  estimatedDeliveryTime: number;

  imageUrl: string;

  status: DeliveryStatus;
  paymentReference?: string;
 createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };

  lastUpdated?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface WayBillDelivery {
  deliveryId: string;
  userId: string | null;

  sender: {
    name: string;
    phone: string;
    address: {
      lat: number;
      lng: number;
     text:string;
    };
  };

  receiver: {
    name: string;
    phone: string;
    address: {
      
      lat: number;
      lng: number;
      text: string;
    };
  };

  package: {
    description: string;
    weight: number;
    value: number;
  };

  deliveryType: "standard" | "express" | "same-day";
  price: number;
  distanceMeters: number;
  estimatedDeliveryTime: number;

  imageUrl: string;

  status: DeliveryStatus;
  paymentReference?: string;
 createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };

  lastUpdated?: {
    _seconds: number;
    _nanoseconds: number;
  };
}



export default {}
