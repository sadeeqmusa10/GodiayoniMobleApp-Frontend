import { OrderStatus } from "../types";

type OrderStatusInfo = {
  label: string;
  value: OrderStatus;
  progressValue: number;
};
const ORDER_STATUS: OrderStatusInfo[] = [
  { label: "Placed", value: "placed", progressValue: 0 },
  {
    label: "paid",
    value: "paid",
    progressValue: 25,
  },
  { label: "In Progress", value: "inProgress", progressValue: 50 },
  { label: "Out for Delivery", value: "outForDelivery", progressValue: 75 },
  { label: "Delivered", value: "delivered", progressValue: 100 },
];
export default { ORDER_STATUS };
