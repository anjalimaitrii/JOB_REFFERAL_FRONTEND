import { Image, Layout, Send, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { createPost } from "../../services/post.service";

const CreatePost = ({ onPostCreated }: { onPostCreated?: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const name = user?.name || "Employee";
    const initial = name.charAt(0).toUpperCase();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const readers = files.map((file) => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readers).then((base64Images) => {
                setImages((prev) => [...prev, ...base64Images]);
            });
        }
    };

    const handleSubmit = async () => {
        if (!content.trim() && images.length === 0) return;

        setIsSubmitting(true);
        try {
            await createPost(content, images.length > 0 ? images : undefined);
            setContent("");
            setImages([]);
            setIsExpanded(false);
            if (onPostCreated) onPostCreated();
        } catch (error) {
            console.error("Failed to create post", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-8 px-4 w-full relative z-30">
            <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsExpanded(true)}
                className="group fixed bottom-28 right-8 z-40 bg-amber-400 hover:bg-amber-500 text-black w-16 h-16 rounded-full shadow-xl flex items-center justify-center"
            >
                <Layout className="w-6 h-6" />

                {/* Tooltip */}
                <span className="absolute right-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-3 py-1 rounded-md whitespace-nowrap">
                    Create a new post
                </span>

            </motion.button>

            {/* Modal for creating post */}
            <AnimatePresence>
                {isExpanded && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsExpanded(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                            >
                                <div className="flex items-center justify-between p-4 border-b shrink-0">
                                    <h3 className="text-lg font-bold text-slate-800">Create a Post</h3>
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-4 overflow-y-auto">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-black font-bold">
                                            {initial}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{name}</p>
                                            <p className="text-xs text-slate-500">Posting to Anyone</p>
                                        </div>
                                    </div>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        autoFocus
                                        placeholder="What do you want to talk about?"
                                        className="w-full min-h-[120px] resize-none border-none outline-none text-slate-700 text-lg placeholder:text-slate-400"
                                    />

                                    {images.length > 0 && (
                                        <div className={`mt-3 grid gap-2 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                            {images.map((img, idx) => (
                                                <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-100 flex items-center justify-center min-h-[120px]">
                                                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover max-h-[300px]" />
                                                    <button
                                                        onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                                                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50 border-t flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="file"
                                            id="post-image"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                        />
                                        <label
                                            htmlFor="post-image"
                                            className="p-2 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer transition-colors"
                                        >
                                            <Image className="w-5 h-5" />
                                        </label>
                                    </div>
                                    <button
                                        disabled={(!content.trim() && images.length === 0) || isSubmitting}
                                        onClick={handleSubmit}
                                        className={`px-8 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${(!content.trim() && images.length === 0) || isSubmitting
                                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                            : "bg-amber-400 hover:bg-amber-500 text-black shadow-md shadow-amber-200"
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Posting...
                                            </>
                                        ) : (
                                            <>
                                                Post
                                                <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreatePost;

