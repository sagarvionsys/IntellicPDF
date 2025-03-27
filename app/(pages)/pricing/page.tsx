"use client";

import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import CheakOutModal from "@/components/CheakOutModal";
import { useState } from "react";

export type Plan = {
  name: string;
  price: string;
  priceUnit: string;
  description: string;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "BASIC",
    price: "Free",
    priceUnit: "",
    description: "Perfect for starters",
    features: [
      "3 documents",
      "5 questions per document",
      "Basic Features",
      "Email Support",
      "Max file size: 10MB",
    ],
  },
  {
    name: "PRO",
    price: "7",
    priceUnit: "USD/mo",
    description: "Best for professionals",
    features: [
      "10 documents",
      "25 questions per document",
      "Advanced Features",
      "Priority Support",
      "API Access",
      "Max file size: 10MB",
    ],
  },
  {
    name: "PREMIUM",
    price: "15",
    priceUnit: "USD/mo",
    description: "For teams and businesses",
    features: [
      "25 documents",
      "75 questions per document",
      "All Pro Features",
      "Dedicated Support",
      "Max file size: 10MB",
    ],
  },
];

export default function PricingPage() {
  const [isOpen, setisOpen] = useState<boolean>(false);
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 items-center">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col border">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-4xl font-bold mb-4">
                  {plan.price}
                  {plan.priceUnit && (
                    <span className="text-lg"> {plan.priceUnit}</span>
                  )}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              {plan.name !== "BASIC" && (
                <CardFooter>
                  <Button
                    onClick={() => setisOpen((prev) => !prev)}
                    className="w-full capitalize"
                  >
                    Upgrade to {plan.name.toLocaleLowerCase()}
                  </Button>
                </CardFooter>
              )}
              {/* modal for PLAN scheakout */}
              <CheakOutModal
                plan={plan}
                isOpen={isOpen}
                onClose={() => setisOpen(false)}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
