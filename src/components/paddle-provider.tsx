"use client";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { createContext, useContext, useEffect, useState } from "react";

const PaddleContext = createContext<Paddle | undefined>(undefined);

export function PaddleProvider({ children }: { children: React.ReactNode }) {
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    // .env.local dosyasındaki anahtarlarla Paddle'ı uyandırıyoruz
    // Not: Ortam değişkeni projenizde NEXT_PUBLIC_PADDLE_ENV olarak tanımlı olduğu için onu kullandım.
    initializePaddle({
      environment: process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then(setPaddle);
  }, []);

  return (
    <PaddleContext.Provider value={paddle}>
      {children}
    </PaddleContext.Provider>
  );
}

export function usePaddle() {
  return useContext(PaddleContext);
}
