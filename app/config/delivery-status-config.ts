import { DeliveryStatus } from "../types";

type DeliveryStatusInfo = {
  label: string;
  value: DeliveryStatus;
  progressValue: number;
};

const DELIVERY_STATUS: DeliveryStatusInfo[] = [
  { label: "Placed", value: "placed", progressValue: 0 },
  {
    label: "Awaiting Delivery Confirmation",
    value: "paid",
    progressValue: 25,
  },
  { label: "In Progress", value: "inProgress", progressValue: 50 },
  { label: "Out for Delivery", value: "outForDelivery", progressValue: 75 },
  { label: "Delivered", value: "delivered", progressValue: 100 },
];
export default { DELIVERY_STATUS };
