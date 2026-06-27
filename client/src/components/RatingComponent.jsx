import React, { useState, useEffect } from 'react';
import { feedbackService } from '../services/api';
import { Star, ThumbsUp, ThumbsDown, Send, Check } from 'lucide-react';

const RatingComponent = ({ generationId, existingFeedback, onSubmitted }) => {
  const [rating, setRating] = useState(existingFeedback?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [liked, setLiked] = useState(existingFeedback?.liked !== undefined ? existingFeedback.liked : true);
  const [comment, setComment] = useState(existingFeedback?.comment || '');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Reset states if generationId changes
  useEffect(() => {
    setRating(existingFeedback?.rating || 5);
    setLiked(existingFeedback?.liked !== undefined ? existingFeedback.liked : true);
    setComment(existingFeedback?.comment || '');
    setSuccess(false);
    setError(null);
  }, [generationId, existingFeedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await feedbackService.submitFeedback({
        generationId,
        rating,
        liked,
        comment
      });
      
      setSuccess(true);
      if (onSubmitted) {
        onSubmitted(response.feedback);
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setError('Could not submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Rate this Briefing Output</h4>
        {success && (
          <span className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 font-semibold">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      {error && <div className="text-xs text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Star Rating and Like/Dislike */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1">Quality:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 text-amber-400 hover:scale-125 transition focus:outline-none"
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Helpful?</span>
            <button
              type="button"
              onClick={() => setLiked(true)}
              className={`p-1.5 rounded-lg border transition ${
                liked
                  ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLiked(false)}
              className={`p-1.5 rounded-lg border transition ${
                !liked
                  ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Comment */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add driver comments or notes on route accuracy..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg text-xs transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              'Saving'
            ) : (
              <>
                <Send className="w-3 h-3" />
                Submit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingComponent;
