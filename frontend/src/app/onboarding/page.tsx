'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first onboarding step
    router.push('/onboarding/economy');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
      <div className="text-center">
        <span className="material-symbols-outlined text-4xl text-primary mb-4 block">
          hourglass_empty
        </span>
        <p className="text-text-sub-light dark:text-text-sub-dark">
          Loading onboarding...
        </p>
      </div>
    </div>
  );
}
