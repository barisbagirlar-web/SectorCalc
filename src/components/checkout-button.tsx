"use client";
import { usePaddle } from "./paddle-provider";

interface CheckoutButtonProps {
  priceId: string;
  userId: string;
  buttonText: string;
}

export default function CheckoutButton({ priceId, userId, buttonText }: CheckoutButtonProps) {
  const paddle = usePaddle();

  const handleCheckout = () => {
    if (!paddle) return alert("Ödeme sistemi yükleniyor, lütfen bekleyin...");
    
    // Paddle penceresini aç ve Firebase'in tanıması için kullanıcı ID'sini (userId) gizlice yolla
    paddle.Checkout.open({
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
