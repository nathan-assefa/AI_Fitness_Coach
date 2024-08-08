import React, { ButtonHTMLAttributes, useState } from "react";

import { Loader2, LogOut } from "lucide-react";
import { useAuth } from "../lib/providers/auth-provider";
import { toast } from "sonner";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: React.FC<SignOutButtonProps> = ({ ...props }) => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const { logOutUser: signOut } = useAuth();
  return (
    <button
      {...props}
      onClick={async () => {
        setIsSigningOut(true);
        try {
          await signOut();
        } catch (error) {
          toast.error("There was a problem signing out");
        } finally {
          setIsSigningOut(false);
        }
      }}
    >
      {isSigningOut ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <LogOut className="log-out-icon" />
      )}
    </button>
  );
};

export default SignOutButton;
