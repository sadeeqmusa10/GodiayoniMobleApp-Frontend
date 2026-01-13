import { useAuth } from "../Auth/FirebaseProviderWithNavigate";
import { Button } from "./ui/button";
import LoadingButton from "../components/LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useGetMyUser } from "../Api/MyUserApi";
import UserProfileForm from "../forms/user-profile-form/UserProfileForm";
import type { UserFormData } from "../forms/user-profile-form/UserProfileForm";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  disabled: boolean;
  isLoading: boolean;
};

const CheckoutButton = ({ onCheckout, disabled, isLoading }: Props) => {
  const { loading: isAuthLoading } = useAuth();

  const { currentUser, isPending: isGetUserLoading } = useGetMyUser();

  if (isAuthLoading || !currentUser || isLoading) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="bg-orange-500 flex-1">
          Place Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
        <UserProfileForm
          currentUser={currentUser}
          onSave={onCheckout}
          isLoading={isGetUserLoading}
          title="Confirm Your Delivery Details!"
          buttonText="Proceed To Payment"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
