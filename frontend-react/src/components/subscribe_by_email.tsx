// import { MoveUpRight } from "lucide-react";
import WomenDoingYoga from "../images/women_yoga.png";
import JoininForm from "../forms/joining-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const SubscriptionByEmail = () => {
  interface InvitationAttr {
    email: string;
  }
  const inviteUserMutation = useMutation(
    async ({ email }: InvitationAttr) => {
      try {
        console.log(email);
      } catch (error) {
        toast.error("Error subscribe.");
      }
    },
    {
      onSuccess: () => {
        toast.success("Subscribed successfully.");
      },
    }
  );

  const onHandleInvite = async (formData: { email: string }): Promise<void> => {
    try {
      // Trigger the mutation when the form is submitted
      await inviteUserMutation.mutateAsync(formData);
    } catch (error) {
      // Handle error
      console.error("Error inviting user:", error);
    }
  };

  return (
    <div>
      {/* <h1 className="last-section-blured-header">JOIN US</h1> */}
      <div className="last-section-wrapper">
        <div className="last-section-left-col">
          <img src={WomenDoingYoga} alt="women doing yoga" />
        </div>
        <div className="last-section-right-col">
          <h1 className="last-section-heading">JOIN US</h1>
          <p className="last-section-description">
            Schedule your free consultation today to start your fitness journey.
            We’re looking forward to helping you reach your potential.
          </p>
          <div className="last-section-email-input">
            <JoininForm
              isLoading={inviteUserMutation.isLoading}
              isError={inviteUserMutation.isError}
              autoFocus={false}
              onSubmit={onHandleInvite}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionByEmail;
