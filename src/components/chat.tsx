import { useEffect, useRef, useState } from "react"
import socket from "../services/socket"
import { getChatByRequest } from "../services/chat.service"

type Message = {
  _id?: string
  sender: string
  text: string
  createdAt?: string
}

interface ChatProps {
  requestId: string
  receiverId: string
  currentUserId: string
}

const Chat = ({ requestId, receiverId, currentUserId }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const bottomRef = useRef<HTMLDivElement | null>(null)


useEffect(() => {
  const loadHistory = async () => {
    const res = await getChatByRequest(requestId);
    setMessages(res.data); 
  };

  loadHistory();

  socket.emit("join-room", { requestId });

socket.on("receive-message", (msg) => {
  setMessages(prev => {
    
    if (prev.some(m => m._id === msg._id)) return prev;
    return [...prev, msg];
  });
});


  return () => {
    socket.off("receive-message");
  };
}, [requestId]);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

 const sendMessage = () => {
  console.log("SEND CLICKED");

  if (!text.trim()) return;


  socket.emit("send-message", {
    requestId,
    receiver: receiverId,
    text,
  });

  setMessages(prev => [
    ...prev,
    { sender: currentUserId, text },
  ]);

  setText("");
};


  return (
    <div className="flex flex-col h-screen  bg-slate-100">

      {/* HEADER */}
      <div className="bg-indigo-600  text-white px-6 py-4 font-semibold">
        Chat
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.map((msg, i) => {
          const isMe = msg.sender === currentUserId
          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm
                  ${
                    isMe
                      ? "bg-indigo-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white flex gap-3 border-t">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-5 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat
