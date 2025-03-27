"use client";

import { useState } from "react";
import PayPalButton from "./PayPalButton";
import { Plan } from "@/app/(pages)/pricing/page";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { VerifyMail } from "@/actions/authentication";
import { toast } from "@/hooks/use-toast";

const CheckOutModal = ({
  plan,
  isOpen,
  onClose,
}: {
  plan: Plan;
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
}) => {
  const [isVerified, setIsVerified] = useState(false);

  const handlePaymentSuccess = (details: any) => {
    console.log("Payment successful:", details);
    onClose(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email") as string;

    const { message, success } = await VerifyMail(email);

    if (!success) {
      return toast({ variant: "destructive", title: message });
    }

    setIsVerified(true);
    toast({ title: "Email verified successfully" });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsVerified(false);
          onClose(false);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            disabled={isVerified}
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
          />
          <Button
            disabled={isVerified}
            type="submit"
            className="w-full font-bold text-lg"
          >
            {isVerified ? "Verified" : "Verify Email"}
          </Button>
        </form>

        {isVerified && (
          <PayPalButton plan={plan} onSuccess={handlePaymentSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckOutModal;
