"use client";

import { Plan } from "@/app/(pages)/pricing/page";
import {
  FUNDING,
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import { useSession } from "next-auth/react";

interface PayPalButtonProps {
  plan: Plan;
  onSuccess: (details: any) => void;
}

const PayPalButton = ({ plan, onSuccess }: PayPalButtonProps) => {
  const { data: session } = useSession();
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_KEY;

  if (!clientId) {
    console.error("PayPal Client ID is not provided");
    return null;
  }

  return (
    <PayPalScriptProvider options={{ clientId, currency: "USD" }}>
      <div className="">
        <PayPalButtons
          style={{
            color: "black",
            label: "pay",
            shape: "rect",
            layout: "vertical",
          }}
          fundingSource={FUNDING.PAYPAL}
          createOrder={(_, actions) =>
            actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: { value: plan.price, currency_code: "USD" },
                  description: `purchase of user ${session?.user.email} for ${plan.name} plan at ${plan.price} USD`,
                },
              ],
            })
          }
          onApprove={(_, actions) =>
            actions.order?.capture().then(onSuccess) ??
            Promise.reject("Order undefined")
          }
          onError={(err) => console.log(err)}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
