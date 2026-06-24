"use client";

import { useRef, useState } from "react";
import { getApiErrorMessage } from "@/lib/api";
import { pickupOrder } from "@/services/order";
import { useParams } from "next/navigation";

const CODE_LENGTH = 6;

export default function ManualPickupCodeRefinedMinimalistPage() {
  const params = useParams();

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isCodeComplete = code.every((item) => item !== "");
  const pickup_order = code.join("");

  function cleanInput(value: string) {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  }

  function focusInput(index: number) {
    inputRefs.current[index]?.focus();
    setActiveIndex(index);
  }

  function handleInput(index: number, value: string) {
    const cleanedValue = cleanInput(value);

    if (!cleanedValue) {
      return;
    }

    const newCode = [...code];
    let lastFilledIndex = index;

    cleanedValue
      .slice(0, CODE_LENGTH - index)
      .split("")
      .forEach((char, offset) => {
        const targetIndex = index + offset;

        newCode[targetIndex] = char;
        lastFilledIndex = targetIndex;
      });

    setCode(newCode);

    const nextIndex = Math.min(lastFilledIndex + 1, CODE_LENGTH - 1);

    requestAnimationFrame(() => {
      focusInput(nextIndex);
    });
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Backspace") {
      event.preventDefault();

      const newCode = [...code];

      if (newCode[index]) {
        newCode[index] = "";
        setCode(newCode);
        focusInput(index);
        return;
      }

      const previousIndex = Math.max(index - 1, 0);

      newCode[previousIndex] = "";
      setCode(newCode);
      focusInput(previousIndex);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusInput(Math.max(index - 1, 0));
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusInput(Math.min(index + 1, CODE_LENGTH - 1));
    }
  }


  async function verifyPickup(
    pickup_order: string
  ) {
    try {
  
      const result =
        await pickupOrder(
          pickup_order,
          params.public_id as string
        );
  
      alert(
        "Order berhasil diselesaikan"
      );
  
      return result;
  
    } catch (error) {
  
      console.error(error);
  
      alert(
        getApiErrorMessage(error)
      );
    }
  }


  async function handleVerifyCode() {
    const data = await verifyPickup(pickup_order)
    console.log("Order completed:", data);
  }

  return (
    <div className="bg-background text-text-primary min-h-screen font-sans antialiased">
      <div className="max-w-[448px] mx-auto min-h-screen flex flex-col relative bg-background font-sans antialiased text-text-primary">
        <header className="fixed top-0 w-full max-w-[448px] z-50 bg-surface/95 backdrop-blur-md border-b border-border flex items-center justify-between px-6 h-16 transition-colors">
          <button className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-[0.98] transition-transform duration-200 text-text-primary">
            <span
              className="material-symbols-outlined text-[32px]"
              data-icon="arrow_back"
            >
              arrow_back
            </span>
          </button>

          <h1 className="font-bold text-[28px] text-text-primary tracking-tight">
            Enter Pickup Code
          </h1>

          <div className="w-10" />
        </header>

        <main className="flex-1 mt-16 px-6 pt-[88px] flex flex-col items-center relative">
          <div className="w-[100px] h-[100px] rounded-full bg-primary/10 flex items-center justify-center mb-12">
            <span
              className="material-symbols-outlined text-primary text-[32px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              lock
            </span>
          </div>

          <p className="text-[24px] leading-[1.55] text-text-secondary text-center max-w-[360px] mb-[56px]">
            Enter the 6-digit code found in the customer&apos;s order details.
          </p>

          <div className="grid grid-cols-6 gap-3 w-full max-w-[380px] mb-10">
            {code.map((value, index) => {
              const isActive = activeIndex === index;
              const isFilled = value !== "";

              return (
                <div
                  key={index}
                  onClick={() => focusInput(index)}
                  className={`relative h-[76px] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all duration-200 cursor-text ${
                    isActive
                      ? "bg-background border-2 border-primary"
                      : isFilled
                      ? "bg-background border border-border"
                      : "bg-gray-50 border border-border"
                  }`}
                >
                  <input
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    value={value}
                    onFocus={() => setActiveIndex(index)}
                    onChange={(event) => {
                      handleInput(index, event.target.value);
                    }}
                    onKeyDown={(event) => {
                      handleKeyDown(index, event);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                    maxLength={CODE_LENGTH}
                    autoCapitalize="characters"
                    autoComplete="one-time-code"
                    inputMode="text"
                  />

                  {value ? (
                    <span className="text-[28px] font-bold text-text-primary">
                      {value}
                    </span>
                  ) : isActive ? (
                    <div className="h-11 w-px bg-text-primary animate-pulse" />
                  ) : null}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleVerifyCode}
            disabled={!isCodeComplete}
            className={`w-full max-w-[384px] py-5 px-4 rounded-2xl text-white text-[22px] tracking-wide font-medium flex items-center justify-center transition-all duration-200 ${
              isCodeComplete
                ? "bg-primary active:scale-[0.98] shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                : "bg-primary/45 cursor-not-allowed"
            }`}
          >
            Verify Code
          </button>
        </main>
      </div>
    </div>
  );
}