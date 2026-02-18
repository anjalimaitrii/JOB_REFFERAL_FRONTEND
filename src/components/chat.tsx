import { useEffect, useRef, useState } from "react";
import socket from "../services/socket";
import { getChatByRequest } from "../services/chat.service";
import { Send, Paperclip, Image, FileText, X } from "lucide-react";

type Message = {
  _id?: string;
  sender: string;
  text: string;
  image?: string;
  document?: string;
  gif?: string;
  createdAt?: string;
};

interface ChatProps {
  requestId: string;
  receiverId: string;
  currentUserId: string;
  onClose?: () => void;
}

const Chat = ({ requestId, receiverId, currentUserId, onClose }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const bottomRef    = useRef<HTMLDivElement | null>(null);
  const imageRef     = useRef<HTMLInputElement | null>(null);
  const documentRef  = useRef<HTMLInputElement | null>(null);

  /* ── LOAD + SOCKET ── */
  useEffect(() => {
    const loadHistory = async () => {
      const res = await getChatByRequest(requestId);
      setMessages(res.data);
    };
    loadHistory();
    socket.emit("join-room", { requestId });
    socket.on("receive-message", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });
    return () => { socket.off("receive-message"); };
  }, [requestId]);

  /* ── AUTO SCROLL ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── FILE UPLOAD ── */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setAttachOpen(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("requestId", requestId);
    formData.append("receiver", receiverId);

    try {
      const res = await fetch("http://localhost:5000/api/chat/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      setMessages((prev) => [...prev, result.data || result]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      // reset input so same file can be picked again
      e.target.value = "";
    }
  };

  /* ── SEND TEXT ── */
  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("send-message", { requestId, receiver: receiverId, text });
    setMessages((prev) => [
      ...prev,
      { sender: currentUserId, text, createdAt: new Date().toISOString() },
    ]);
    setText("");
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  /* ── group messages by date ── */
  const groupedMessages = messages.reduce<{ date: string; msgs: Message[] }[]>((acc, msg) => {
    const day = msg.createdAt
      ? new Date(msg.createdAt).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })
      : "Today";
    const last = acc[acc.length - 1];
    if (last && last.date === day) { last.msgs.push(msg); }
    else { acc.push({ date: day, msgs: [msg] }); }
    return acc;
  }, []);

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
              {receiverId.slice(0, 2).toUpperCase()}
            </div>
            {/* online dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-gray-900">Chat</h2>
            <p className="text-xs text-green-500 font-medium">Online</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* ── MESSAGES ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-slate-50">
        {groupedMessages.map(({ date, msgs }) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] text-gray-400 font-medium px-2">{date}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {msgs.map((msg, i) => {
              const isMe = msg.sender === currentUserId;
              const showTail = i === 0 || msgs[i - 1].sender !== msg.sender;

              return (
                <div key={i} className={`flex mb-1 ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%]`}>
                    <div
                      className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm
                        ${isMe
                          ? `bg-gray-900 text-white ${showTail ? "rounded-2xl rounded-br-sm" : "rounded-2xl"}`
                          : `bg-white text-gray-800 border border-gray-100 ${showTail ? "rounded-2xl rounded-bl-sm" : "rounded-2xl"}`
                        }`}
                    >
                      {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}

                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="sent"
                          className="mt-2 rounded-xl max-h-56 w-auto cursor-pointer hover:opacity-90 transition"
                          onClick={() => window.open(msg.image, "_blank")}
                        />
                      )}

                      {msg.gif && (
                        <img src={msg.gif} alt="gif" className="mt-2 rounded-xl max-h-56 w-auto" />
                      )}

                      {msg.document && (
                        <a
                          href={msg.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-2 flex items-center gap-2 text-xs font-medium underline-offset-2 hover:underline ${
                            isMe ? "text-blue-300" : "text-blue-600"
                          }`}
                        >
                          <FileText className="w-4 h-4 shrink-0" />
                          View Document
                        </a>
                      )}
                    </div>

                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Uploading indicator */}
        {uploading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                Uploading...
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── INPUT AREA ── */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 shrink-0">

        {/* Attach options — slide up */}
        {attachOpen && (
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => imageRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium rounded-full transition"
            >
              <Image className="w-3.5 h-3.5" />
              Image
            </button>
            <button
              onClick={() => documentRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-medium rounded-full transition"
            >
              <FileText className="w-3.5 h-3.5" />
              Document
            </button>
          </div>
        )}

        {/* Hidden file inputs — separate for image vs document */}
        <input ref={imageRef}    type="file" accept="image/*"                              onChange={handleFileUpload} className="hidden" />
        <input ref={documentRef} type="file" accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt" onChange={handleFileUpload} className="hidden" />

        {/* Row */}
        <div className="flex items-center gap-2">
          {/* Attach toggle */}
          <button
            onClick={() => setAttachOpen((p) => !p)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
              attachOpen
                ? "bg-gray-800 text-white rotate-45"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Text box */}
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2.5 border border-gray-200 focus-within:border-gray-400 focus-within:bg-white transition-all">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Send */}
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
              text.trim()
                ? "bg-gray-900 text-white hover:bg-gray-700 shadow-md active:scale-95"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;