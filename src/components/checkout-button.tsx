"use client";
import { usePaddle } from "@/lib/ui-shared/paddle-provider";

interface CheckoutButtonProps {
  priceId: string;
  userId: string;
  buttonText: string;
  productKey?: string;
}

export default function CheckoutButton({ priceId, userId, buttonText, productKey }: CheckoutButtonProps) {
  const { ready, openCheckout } = usePaddle();

  const handleCheckout = () => {
    console.log("Price ID sent:", priceId);
    console.log("Paddle Token used:", process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN);

    if (!priceId) {
      console.error("[SectorCalc] Critical Error: Price ID is missing in CheckoutButton!");
      return;
    }

    if (!ready) return alert("Payment system is loading, please wait...");
    
    // Open Paddle checkout and pass user ID + canonical fields for webhook fulfillment
    openCheckout({
      items: [{ priceId: priceId, quantity: 1 }],
      customData: {
        userId: userId,
        intent: "SECTORCALC_CREDIT_PACK_PURCHASE",
        productKey: productKey || "credit_pack_1",
        source: "checkout_button",
      }, 
    });
  };

  return (
    <button 
      onClick={handleCheckout} 
      className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
    >
      {buttonText}
    </button>
  );
}
