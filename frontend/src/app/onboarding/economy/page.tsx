'use client';

import Link from 'next/link';

export default function OnboardingEconomyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background-light dark:from-primary/5 dark:to-background-dark flex flex-col max-w-md mx-auto px-4">
      {/* Progress Indicator */}
      <div className="pt-8 pb-4">
        <div className="flex gap-2 justify-center">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step === 1
                  ? 'bg-primary'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
        {/* Icon */}
        <div className="w-40 h-40 mb-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/10 dark:to-primary/5">
          <span className="material-symbols-outlined text-6xl text-primary">
            savings
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-text-main-light dark:text-text-main-dark mb-3">
          Save Money
        </h1>

        {/* Description */}
        <p className="text-text-sub-light dark:text-text-sub-dark text-lg leading-relaxed mb-8 max-w-xs">
          Get discounted meals from restaurants and food businesses that would otherwise be wasted. Save up to 50% on delicious food.
        </p>

        {/* Feature Points */}
        <div className="w-full max-w-xs space-y-4 mb-12">
          {[
            {
              icon: 'sell',
              title: 'Up to 50% Off',
              description: 'Save money on quality food',
            },
            {
              icon: 'restaurants',
              title: 'Local Restaurants',
              description: 'Support your local community',
            },
            {
              icon: 'trending_up',
              title: 'Real Savings',
              description: 'Every purchase helps the planet',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-start p-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700"
            >
              <span className="material-symbols-outlined text-primary text-[24px] flex-shrink-0">
                {feature.icon}
              </span>
              <div className="text-left">
                <p className="font-semibold text-text-main-light dark:text-text-main-dark text-sm">
                  {feature.title}
                </p>
                <p className="text-xs text-text-sub-light dark:text-text-sub-dark">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pb-8 space-y-3">
        <Link
          href="/onboarding/process"
          className="w-full py-4 px-4 rounded-lg bg-primary hover:bg-primary/90 text-slate-900 font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
        >
          Next
        </Link>
        <Link
          href="/"
          className="w-full py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-text-main-light dark:text-text-main-dark font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Skip
        </Link>
      </div>
    </div>
  );
}
