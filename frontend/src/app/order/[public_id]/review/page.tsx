'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '../../../../components/shared';

interface ReviewData {
  title: string;
  content: string;
  wouldRecommend: boolean;
}

export default function OrderReviewPage() {
  const [formData, setFormData] = useState<ReviewData>({
    title: '',
    content: '',
    wouldRecommend: true,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      window.history.back();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col max-w-md mx-auto">
      <PageHeader
        title="Write Review"
        showBack={true}
        onBackClick={() => window.history.back()}
      />

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 pt-6">
          <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark mb-2">
            Share Your Review
          </h1>
          <p className="text-text-sub-light dark:text-text-sub-dark mb-8">
            Tell other customers about your experience
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Review Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-text-main-light dark:text-text-main-dark mb-2"
              >
                Review Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Summarize your experience"
                maxLength={100}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-text-main-light dark:text-text-main-dark placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <p className="text-xs text-text-sub-light dark:text-text-sub-dark mt-1">
                {formData.title.length}/100
              </p>
            </div>

            {/* Review Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-semibold text-text-main-light dark:text-text-main-dark mb-2"
              >
                Your Review
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Tell us more about your experience..."
                rows={6}
                maxLength={1000}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-text-main-light dark:text-text-main-dark placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
              <p className="text-xs text-text-sub-light dark:text-text-sub-dark mt-1">
                {formData.content.length}/1000
              </p>
            </div>

            {/* Would Recommend */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-text-main-light dark:text-text-main-dark">
                Would you recommend this store?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, wouldRecommend: true })
                  }
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    formData.wouldRecommend
                      ? 'bg-primary text-slate-900'
                      : 'border border-gray-200 dark:border-gray-700 text-text-main-light dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    thumb_up
                  </span>
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, wouldRecommend: false })
                  }
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    !formData.wouldRecommend
                      ? 'bg-red-500 text-white'
                      : 'border border-gray-200 dark:border-gray-700 text-text-main-light dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    thumb_down
                  </span>
                  No
                </button>
              </div>
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
                disabled={submitted || !formData.title || !formData.content}
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
                  'Post Review'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
