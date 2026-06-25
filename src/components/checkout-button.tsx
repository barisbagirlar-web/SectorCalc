"use client";
import { usePaddle } from "@/lib/paddle-provider";

interface CheckoutButtonProps {
  priceId: string;
  userId: string;
  buttonText: string;
}

export default function CheckoutButton({ priceId, userId, buttonText }: CheckoutButtonProps) {
  const { ready, openCheckout } = usePaddle();

  const handleCheckout = () => {
    console.log("Price ID sent:", priceId);
    console.log("Paddle Token used:", process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN);

    if (!priceId) {
      console.error("[SectorCalc] Critical Error: Price ID is missing in CheckoutButton!");
      return;
    }

    if (!ready) return alert("Payment system is loading, please wait...");
    
    // Open Paddle checkout and secretly pass the user ID (userId) for Firebase identification
    openCheckout({
      items: [{ priceId: priceId, quantity: 1 }],
      customData: { userId: userId }, 
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
