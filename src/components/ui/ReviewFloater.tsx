"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { createSuccessStory } from "../../services/successStory.service";

export default function ReviewFloater({

}: {
  // (unused but keeping since you defined)
  designation: string;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      if (!rating || !comment.trim()) return;

      await createSuccessStory({
        role: "full stack developer",  // Example role value
        rating,
        comment,
        company: "JobReferral"  // Example company value
      });

      setOpen(false);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Failed to submit review");
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 group">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition relative"
        >
          <Star size={22} />
        </motion.button>

        <div
          className="absolute right-16 top-1/2 -translate-y-1/2 
                  opacity-0 group-hover:opacity-100 
                  transition duration-200 
                  bg-black text-white text-xs 
                  px-3 py-1 rounded-lg whitespace-nowrap"
        >
          Share Your Success Story
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-[350px] rounded-2xl shadow-2xl p-6 relative"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>

              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Leave a Review
              </h2>

              {/* Rating */}
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className={`cursor-pointer transition ${
                      (hover || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <textarea
                placeholder="Write your feedback..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
              />

              <button
                onClick={handleSubmit}
                disabled={!rating || !comment.trim()}
                className={`w-full mt-4 py-2 rounded-lg font-medium transition ${
                  rating && comment.trim()
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Submit Review
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}