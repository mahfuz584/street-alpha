"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

const ChatBox = ({ name }) => {
  const session = useSession();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  console.log("🚀 ~ ChatBox ~ chatHistory:", chatHistory)
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const userId = session?.data?.user?.id;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    const threadId = Date.now().toString();
    const userMessage = { type: "user", text: message, isTyping: false };

    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);
    setMessage("");

    const typingMessage = { type: "ai", text: "Thinking...", isTyping: true };
    setChatHistory((prev) => [...prev, typingMessage]);

    try {
      const response = await axios.post("/backend-2/qa", {
        message,
        thread_id: threadId,
        user_id: userId.toString(),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
 
      const answer = response?.data?.answer || "No answer returned.";
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { type: "ai", text: answer, isTyping: false },
      ]);
    } catch (err) {
      console.error("Chat request failed:", err);
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { type: "ai", text: "Failed to get response.", isTyping: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pb-[30px] space-y-3">
        {chatHistory?.map((chat, index) => {
          const isLatestAI = chat.type === "ai" && index === chatHistory.length - 1;

          return (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                chat?.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {chat?.type === "ai" && (
                <div className="w-[30px] h-[30px]">
                  <img
                    alt="logo"
                    src="/assets/images/logo-light.png"
                    className="w-full h-full"
                  />
                </div>
              )}

              <div
                className={`p-3 rounded-2xl max-w-[80%] text-[14px] ${
                  chat?.type === "user"
                    ? "bg-[#070707] text-white rounded-br-none"
                    : "bg-gray-200 text-[#070707] rounded-[8px] shadow"
                }`}
              >
                {isLatestAI && !chat.isTyping ? (
                  <Typewriter
                    words={[chat.text]}
                    loop={1}
                    cursor
                    cursorStyle="|"
                    typeSpeed={15}
                    deleteSpeed={45}
                    onType={() => {
                      chatEndRef.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    onDelay={() => {
                      chatEndRef.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                  />
                ) : (
                  chat.text
                )}
              </div>

              {chat?.type === "user" && (
                <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                  <img
                    alt="User"
                    src="/assets/images/dashboard-icons/user-bg.png"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="w-full max-w-[1080px] bg-white mx-auto pb-[20px] fixed bottom-0 z-10">
        <div className="flex items-center border border-gray-200 rounded-lg px-[18px] py-[17px]">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Ask about ${name}`}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="flex-1 outline-none text-[16px] text-[#000] bg-transparent placeholder:text-[#00000067]"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-[34px] h-[34px] flex items-center justify-center rounded-full bg-[#F1F4F2] hover:bg-[#E5E7EB]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M13.71 6.54556L0.710318 0.545706C0.503323 0.451708 0.256329 0.507707 0.112332 0.685703C-0.0326641 0.863698 -0.037664 1.11669 0.100333 1.29969L4.37523 6.99955L0.100333 12.6994C-0.037664 12.8824 -0.0326641 13.1364 0.111332 13.3134C0.20833 13.4344 0.353326 13.4994 0.500323 13.4994C0.571321 13.4994 0.642319 13.4844 0.709318 13.4534L13.709 7.45354C13.887 7.37154 14 7.19454 14 6.99955C14 6.80455 13.887 6.62756 13.71 6.54556Z"
                  fill="black"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
