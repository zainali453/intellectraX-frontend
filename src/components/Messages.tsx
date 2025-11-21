import TeacherCustomHeader from "@/components/TeacherCustomHeader";
import { useState, useEffect, useRef } from "react";
import user from "@/assets/icons/user.png";
// Types
export interface Message {
  message: string;
  time: Date;
  senderId: string;
}

export interface Chat {
  _id: string;
  userId: string;
  fullName: string;
  profilePic?: string;
  online: boolean;
  lastMessage: string;
  time: Date | null;
}

interface MessagesProps {
  chats: Chat[];
  messages: Message[];
  loading: boolean;
  onSendMessage: (userId: string, message: string) => void;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
}

const Messages = ({
  chats = [],
  messages = [],
  loading = false,
  onSendMessage,
  selectedChat,
  setSelectedChat,
}: MessagesProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesLengthRef = useRef<number>(0);

  // Filter chats based on search
  const filteredChats = chats.filter((chat) =>
    chat.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-scroll to bottom only when new messages arrive (not on initial load)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  // Handle send message
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    console.log("Handle send message called with:", messageInput);

    if (selectedChat) {
      onSendMessage(selectedChat.userId, messageInput);
      setMessageInput("");
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format last message time
  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMs = now.getTime() - messageDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return formatTime(date);
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Format date separator for messages
  const formatDateSeparator = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);

    // Reset time to midnight for accurate day comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msgDay = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate()
    );
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const diffInMs = today.getTime() - msgDay.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Today
    if (diffInDays === 0) {
      return "Today";
    }

    // Yesterday
    if (diffInDays === 1) {
      return "Yesterday";
    }

    // This week (show day name like "Monday", "Tuesday")
    if (diffInDays < 7 && diffInDays > 1) {
      return messageDate.toLocaleDateString("en-US", { weekday: "long" });
    }

    // Same year (show "Month Day" like "Jan 15")
    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    // Different year (show full date like "Jan 15, 2024")
    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if two dates are on different days
  const isDifferentDay = (date1: Date, date2: Date) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() !== d2.getFullYear() ||
      d1.getMonth() !== d2.getMonth() ||
      d1.getDate() !== d2.getDate()
    );
  };

  return (
    <div className='px-8 py-6 h-[86vh] flex flex-col'>
      <TeacherCustomHeader title='Messages' />

      <div className='flex gap-4 flex-1 overflow-hidden'>
        {/* Left Sidebar - Chat List */}
        <div className='w-80 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col'>
          {/* Search Bar */}
          <div className='p-4 border-b border-gray-200'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none outline-none text-sm'
              />
              <svg
                className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
          </div>

          {/* Chat List */}
          <div className='flex-1 overflow-y-auto'>
            {filteredChats.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-gray-400 px-4 text-center'>
                <svg
                  className='w-16 h-16 mb-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                  />
                </svg>
                <p className='text-sm'>No chats available</p>
                <p className='text-xs mt-1'>
                  Start a conversation to see it here
                </p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.userId}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-gray-100 hover:bg-gray-50 ${
                    selectedChat?.userId === chat.userId ? "bg-gray-100" : ""
                  }`}
                >
                  {/* Profile Picture with Online Status */}
                  <div className='relative flex-shrink-0'>
                    <img
                      src={chat.profilePic || user}
                      alt={chat.fullName}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    {chat.online && (
                      <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></span>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex justify-between items-start'>
                      <h3 className='font-medium text-sm text-gray-900 truncate'>
                        {chat.fullName}
                      </h3>
                      <span className='text-xs text-gray-500 flex-shrink-0 ml-2'>
                        {chat.time
                          ? formatDateSeparator(chat.time)
                          : "No messages"}
                      </span>
                    </div>
                    <p className='text-sm text-gray-500 truncate mt-0.5'>
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className='flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col'>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className='flex items-center gap-3 p-4 border-b border-gray-200'>
                <img
                  src={selectedChat.profilePic || user}
                  alt={selectedChat.fullName}
                  className='w-10 h-10 rounded-full object-cover'
                />
                <div className='flex-1'>
                  <h3 className='font-medium text-gray-900'>
                    {selectedChat.fullName}
                  </h3>
                  <p className='text-xs text-green-500'>
                    {selectedChat.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              {/* Messages Area */}
              <div className='flex-1 overflow-y-auto p-6 bg-gray-50'>
                {loading ? (
                  <div className='flex items-center justify-center h-full'>
                    <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-bgprimary'></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                    <svg
                      className='w-16 h-16 mb-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                      />
                    </svg>
                    <p className='text-sm'>No messages yet</p>
                    <p className='text-xs mt-1'>
                      Send a message to start the conversation
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {messages.map((msg, index) => {
                      const isCurrentUser =
                        msg.senderId !== selectedChat.userId;

                      // Show date separator if this is the first message or if the date changed
                      const showDateSeparator =
                        index === 0 ||
                        isDifferentDay(messages[index - 1].time, msg.time);

                      return (
                        <div key={index}>
                          {/* Date Separator */}
                          {showDateSeparator && (
                            <div className='flex items-center justify-center my-6'>
                              <div className='flex-1 h-px bg-gray-300'></div>
                              <div className='px-4 py-1.5 bg-gray-200 text-gray-600 text-xs font-medium rounded-full mx-3'>
                                {formatDateSeparator(msg.time)}
                              </div>
                              <div className='flex-1 h-px bg-gray-300'></div>
                            </div>
                          )}

                          {/* Message */}
                          <div
                            className={`flex ${
                              isCurrentUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div className='flex items-end gap-2 max-w-[70%]'>
                              {!isCurrentUser && (
                                <img
                                  src={selectedChat.profilePic || user}
                                  alt={selectedChat.fullName}
                                  className='w-8 h-8 rounded-full object-cover flex-shrink-0'
                                />
                              )}
                              <div>
                                <div
                                  className={`px-4 py-2 rounded-2xl ${
                                    isCurrentUser
                                      ? "bg-bgprimary text-white rounded-br-none"
                                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                                  }`}
                                >
                                  <p className='text-sm'>{msg.message}</p>
                                </div>
                                <span
                                  className={`text-xs text-gray-500 mt-1 block ${
                                    isCurrentUser ? "text-right" : "text-left"
                                  }`}
                                >
                                  {formatTime(msg.time)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className='p-4 border-t border-gray-200 bg-white'>
                <div className='flex items-center gap-3'>
                  <input
                    type='text'
                    placeholder='Write message'
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className='flex-1 px-4 py-3 bg-gray-50 rounded-lg border-none outline-none text-sm'
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className='p-3 bg-bgprimary text-white rounded-full hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                    title='Send message'
                  >
                    <svg
                      className='w-5 h-5 transform'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M2.01 21L23 12 2.01 3 2 10l15 2-15 2z' />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No Chat Selected State */
            <div className='flex flex-col items-center justify-center h-full text-gray-400'>
              <svg
                className='w-24 h-24 mb-6 text-gray-300'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                />
              </svg>
              <h3 className='text-lg font-medium text-gray-600 mb-2'>
                Select a conversation
              </h3>
              <p className='text-sm text-gray-400 text-center max-w-sm'>
                Choose a chat from the list to view messages and start
                conversing
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
