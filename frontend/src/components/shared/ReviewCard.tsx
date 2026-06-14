'use client';

interface ReviewCardProps {
  storeName: string;
  rating: number;
  reviewCount: number;
  comment: string;
  reviewerName: string;
  isVerified?: boolean;
  timestamp?: string;
  onHelpful?: () => void;
}

export function ReviewCard({
  storeName,
  rating,
  reviewCount,
  comment,
  reviewerName,
  isVerified = false,
  timestamp,
  onHelpful,
}: ReviewCardProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-3">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-text-main-light dark:text-text-main-dark">
            {reviewerName}
          </h4>
          {isVerified && (
            <div className="flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px] text-primary">
                verified
              </span>
              <span className="text-xs text-primary font-medium">Verified</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`material-symbols-outlined text-[16px] ${
                i < rating ? 'text-primary fill-1' : 'text-gray-300'
              }`}
            >
              star
            </span>
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-text-main-light dark:text-text-main-dark mb-3">
        {comment}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-text-sub-light dark:text-text-sub-dark">
        <span>{timestamp}</span>
        <button
          onClick={onHelpful}
          className="flex items-center gap-1 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">
            thumb_up
          </span>
          Helpful
        </button>
      </div>
    </div>
  );
}
