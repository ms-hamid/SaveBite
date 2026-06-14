'use client';

import { useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader, ReviewCard } from '../../../../components/shared';

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  isVerified: boolean;
  timestamp: string;
}

interface ReviewFormData {
  rating: number;
  reviewText: string;
  name: string;
}

function ProductReviewContent({ id }: {  id: string }) {
  const searchParams = useSearchParams();
  const isWritingReview = searchParams.get('action') === 'write';

  const [reviews] = useState<Review[]>([
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      text: 'Amazing selection of pastries! Always fresh and the staff is super friendly. Highly recommend!',
      isVerified: true,
      timestamp: '2 days ago',
    },
    {
      id: 2,
      author: 'John D.',
      rating: 4,
      text: 'Great variety and good prices. The sourdough bread is excellent.',
      isVerified: true,
      timestamp: '1 week ago',
    },
    {
      id: 3,
      author: 'Emma L.',
      rating: 5,
      text: 'Perfect for grabbing a quick lunch. Love their sandwich options!',
      isVerified: false,
      timestamp: '2 weeks ago',
    },
    {
      id: 4,
      author: 'Michael T.',
      rating: 4,
      text: 'Good quality but could use more vegan options.',
      isVerified: true,
      timestamp: '3 weeks ago',
    },
  ]);

  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    reviewText: '',
    name: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      window.history.back();
    }, 1500);
  };

  if (isWritingReview) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col max-w-md mx-auto">
        <PageHeader
          title="Write a Review"
          showBack={true}
          onBackClick={() => window.history.back()}
        />

        <main className="flex-1 overflow-y-auto pb-24">
          <div className="px-4 pt-6">
            <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark mb-2">
              Green Leaf Bakery
            </h1>
            <p className="text-text-sub-light dark:text-text-sub-dark mb-6">
              Share your experience with this merchant
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              {/* Rating Section */}
              <div>
                <label className="block text-sm font-semibold text-text-main-light dark:text-text-main-dark mb-3">
                  Your Rating
                </label>
                <div className="flex gap-3 justify-center py-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, rating })
                      }
                      className="transition-transform hover:scale-110"
                    >
                      <span
                        className={`material-symbols-outlined text-[32px] ${
                          rating <= formData.rating
                            ? 'text-primary fill-1'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-text-main-light dark:text-text-main-dark mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-text-main-light dark:text-text-main-dark placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Review Text */}
              <div>
                <label
                  htmlFor="review"
                  className="block text-sm font-semibold text-text-main-light dark:text-text-main-dark mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="review"
                  value={formData.reviewText}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewText: e.target.value })
                  }
                  placeholder="Share your experience..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-text-main-light dark:text-text-main-dark placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="flex-1 py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-text-main-light dark:text-text-main-dark font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitted}
                  className="flex-1 py-3 px-4 rounded-lg bg-primary hover:bg-primary/90 disabled:bg-gray-300 text-slate-900 font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {submitted ? (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        check_circle
                      </span>
                      Submitted!
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // View all reviews
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col max-w-md mx-auto">
      <PageHeader
        title="Customer Reviews"
        showBack={true}
        onBackClick={() => window.history.back()}
      />

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Header Stats */}
        <div className="px-4 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-text-main-light dark:text-text-main-dark">
                4.6
              </div>
              <div className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`material-symbols-outlined text-[14px] ${
                      i < 4 ? 'text-primary fill-1' : 'text-gray-300'
                    }`}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-xs text-text-sub-light dark:text-text-sub-dark mt-1">
                247 reviews
              </p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark w-6">
                    {rating}
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${[100, 0, 0, 15, 40][rating - 1]}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-text-sub-light dark:text-text-sub-dark w-8">
                    {[100, 0, 0, 15, 40][rating - 1]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="px-4 pt-4 space-y-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              storeName="Green Leaf Bakery"
              rating={review.rating}
              reviewCount={247}
              comment={review.text}
              reviewerName={review.author}
              isVerified={review.isVerified}
              timestamp={review.timestamp}
            />
          ))}
        </div>
      </main>

      {/* Write Review Button */}
      <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-4 py-4 bg-background-light dark:bg-background-dark border-t border-gray-100 dark:border-gray-800">
        <Link
          href={`/product/${id}/review?action=write`}
          className="w-full py-3 px-4 rounded-lg bg-primary hover:bg-primary/90 text-slate-900 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            rate_review
          </span>
          Write a Review
        </Link>
      </div>
    </div>
  );
}

export default function ProductReviewPage() {
  const params = useParams()
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductReviewContent id={String(params.id)} />
    </Suspense>
  );
}