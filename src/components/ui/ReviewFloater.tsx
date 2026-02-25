"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { createSuccessStory } from "../../services/successStory.service";
import { getCompanies } from "../../services/company.service";

type Company = {
  _id: string;
  name: string;
  logo: string;
  jobs?: { title: string }[];
};
type Job = {
  _id?: string;
  title: string;
};
export default function ReviewFloater() {

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  // fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await getCompanies();
      setCompanies(res.data);
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const selectedCompany = companies.find(
      (c) => c._id === company
    );

    setJobs(selectedCompany?.jobs || []);
    setRole("");

  }, [company, companies]);

  const handleSubmit = async () => {
    if (!rating || !comment.trim() || !company || !role) return;

    await createSuccessStory({
      role,
      rating,
      comment,
      company
    });

    setOpen(false);
    setRating(0);
    setComment("");
    setCompany("");
    setRole("");
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-xl"
        >
          <Star size={22} />
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white w-[380px] rounded-2xl shadow-2xl p-6 relative"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-gray-400"
              >
                <X size={18} />
              </button>

              <h2 className="text-lg font-semibold mb-4">
                Share Success Story
              </h2>

              {/* ⭐ Rating */}
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className={`cursor-pointer ${(hover || rating) >= star
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
                className="w-full border rounded-lg p-3 text-sm mb-3"
                rows={3}
              />

              {/* COMPANY DROPDOWN */}
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full border rounded-lg p-3 text-sm mb-3"
              >
                <option value="">Select Company</option>

                {companies.map((c: any) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}

              </select>

              {/* ROLE DROPDOWN */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={!company}
                className="w-full border rounded-lg p-3 text-sm"
              >
                <option value="">Select Role</option>

                {jobs.map((job) => (
                  <option key={job.title} value={job.title}>
                    {job.title}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSubmit}
                className="w-full mt-4 py-2 rounded-lg bg-indigo-600 text-white"
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