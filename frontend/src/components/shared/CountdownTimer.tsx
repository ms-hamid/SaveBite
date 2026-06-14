'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  onComplete?: () => void;
  className?: string;
}

export function CountdownTimer({ onComplete, className = '' }: CountdownTimerProps) {
  const [time, setTime] = useState({ hours: 1, minutes: 24, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(interval);
          onComplete?.();
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  const formatTime = (num: number) => String(num).padStart(2, '0');

  return (
    <div className={className}>
      <span className="font-mono font-bold">
        {formatTime(time.hours)}:{formatTime(time.minutes)}:{formatTime(time.seconds)}
      </span>
    </div>
  );
}
