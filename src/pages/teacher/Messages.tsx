import { useState, useEffect, useRef } from "react";
import Messages, { Chat, Message } from "@/components/Messages";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { teacherService } from "@/services/teacher.service";
import LoadingSpinner from "@/components/LoadingSpinner";

const MessagesPage = () => {
  const id = useParams().id;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);
  const pollingIntervalRef = useRef<number | null>(null);
  const messagePollingIntervalRef = useRef<number | null>(null);
  const isInitialLoadRef = useRef<boolean>(true);
  const chatsRef = useRef<Chat[]>([]);
  const selectedChatRef = useRef<Chat | null>(null);
  const messagesRef = useRef<Message[]>([]);

  // Get chatId from URL query parameter
  const chatIdFromUrl = searchParams.get("chatId");

  // Update refs when state changes
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Update URL when chat is selected
  const handleSetSelectedChat = (chat: Chat | null) => {
    setSelectedChat(chat);
    if (chat) {
      // Update URL with chatId parameter
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("chatId", chat.userId);
      navigate(
        { pathname: "/teacher/messages", search: newSearchParams.toString() },
        { replace: true }
      );
    } else {
      // Remove chatId from URL if no chat selected
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("chatId");
      navigate(
        { pathname: "/teacher/messages", search: newSearchParams.toString() },
        { replace: true }
      );
    }
  };

  // Compare chats to see if they need updating
  const shouldUpdateChats = (newChats: Chat[], oldChats: Chat[]) => {
    if (newChats.length !== oldChats.length) return true;

    for (let i = 0; i < newChats.length; i++) {
      const newChat = newChats[i];
      const oldChat = oldChats.find((c) => c._id === newChat._id);

      if (!oldChat) return true;

      // Check if last message time is different
      if (newChat.time !== oldChat.time) {
        return true;
      }
    }

    return false;
  };

  const loadChats = async (isPolling = false) => {
    try {
      // Only show loading spinner on initial load
      if (!isPolling) {
        setLoading(true);
      }

      const response = await teacherService.getChats();
      if (response && response.data) {
        const newChats = response.data;

        // If polling, only update if chats have changed
        if (isPolling) {
          // Use ref to get current chats value
          const currentChats = chatsRef.current;
          if (shouldUpdateChats(newChats, currentChats)) {
            if (id) {
              const chat = currentChats.find(
                (chat: Chat) => chat.userId === id && chat.time === null
              );
              const isPresentinNewChats = newChats.find(
                (chat: Chat) => chat.userId === id
              );
              if (chat && !isPresentinNewChats) {
                handleSetSelectedChat(chat);
                newChats.push(chat);
              }
            }
            setChats(newChats);

            // Maintain selected chat if it still exists
            const currentSelectedChat = selectedChatRef.current;
            if (currentSelectedChat) {
              const updatedSelectedChat = newChats.find(
                (chat: Chat) => chat.userId === currentSelectedChat.userId
              );
              if (updatedSelectedChat) {
                setSelectedChat(updatedSelectedChat);
              }
            }
          }
        } else {
          // Initial load or refresh
          setChats(newChats);

          // Check if there's a chatId in URL to restore
          if (chatIdFromUrl && isInitialLoadRef.current) {
            const chatToSelect = newChats.find(
              (chat: Chat) => chat.userId === chatIdFromUrl
            );
            if (chatToSelect) {
              setSelectedChat(chatToSelect);
            }
            isInitialLoadRef.current = false;
          }

          // Handle id from route params (for direct navigation)
          if (id) {
            const chat = newChats.find((chat: Chat) => chat.userId === id);
            if (chat) {
              handleSetSelectedChat(chat);
            } else {
              const studentDetails = await teacherService.getStudentForChat(id);
              if (studentDetails && studentDetails.data) {
                const newChat: Chat = {
                  _id: studentDetails.data.userId, // Add _id field
                  userId: studentDetails.data.userId,
                  fullName: studentDetails.data.fullName,
                  profilePic: studentDetails.data.profilePic || "",
                  online: false,
                  lastMessage: "",
                  time: null,
                };
                setChats((prevChats) => [newChat, ...prevChats]);
                handleSetSelectedChat(newChat);

                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.delete("chatId");
                navigate(
                  {
                    pathname: "/teacher/messages",
                    search: newSearchParams.toString(),
                  },
                  { replace: true }
                );
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      if (!isPolling) {
        setLoading(false);
      }
    }
  };

  // Initial load
  useEffect(() => {
    loadChats();

    // Start polling every 3 seconds
    pollingIntervalRef.current = window.setInterval(() => {
      loadChats(true);
    }, 3000);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const loadMessages = async (userId: string, isPolling = false) => {
    try {
      const response = await teacherService.getMessages(userId);
      if (response && response.data && response.data.messages) {
        const newMessages = response.data.messages;

        // If polling, only update if messages have changed
        if (isPolling) {
          const currentMessages = messagesRef.current;
          if (newMessages.length !== currentMessages.length) {
            setMessages(newMessages);
          }
        } else {
          setMessages(newMessages);
        }

        return newMessages;
      }
      return [];
    } catch (error) {
      console.error("Failed to load messages:", error);
      return [];
    } finally {
      setMessagesLoading(false);
    }
  };

  // Load messages when selectedChat changes
  useEffect(() => {
    // Clear previous message polling interval
    if (messagePollingIntervalRef.current) {
      clearInterval(messagePollingIntervalRef.current);
      messagePollingIntervalRef.current = null;
    }

    if (selectedChat) {
      // Load messages initially
      loadMessages(selectedChat.userId, false);

      // Start polling for messages every 3 seconds
      messagePollingIntervalRef.current = window.setInterval(() => {
        const currentSelectedChat = selectedChatRef.current;
        if (currentSelectedChat) {
          loadMessages(currentSelectedChat.userId, true);
        }
      }, 3000);
    } else {
      setMessages([]);
    }

    return () => {
      if (messagePollingIntervalRef.current) {
        clearInterval(messagePollingIntervalRef.current);
      }
    };
  }, [selectedChat]);

  const sendMessage = async (userId: string, message: string) => {
    try {
      if (!selectedChat) return false;

      // Optimistic update - add message immediately to UI
      const optimisticMessage = {
        message: message,
        time: new Date(),
        senderId: "currentUser", // This represents the current user
      };

      // Add to messages immediately
      setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

      const response = await teacherService.sendMessage(userId, message);
      if (response && response.success) {
        // Reload messages and chats after a short delay to get actual data from server
        setTimeout(() => {
          loadMessages(userId, true);
          loadChats(true);
        }, 500);
        return true;
      } else {
        // If sending failed, remove the optimistic message
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg !== optimisticMessage)
        );
        return false;
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove optimistic message on error
      setMessages((prevMessages) =>
        prevMessages.filter(
          (msg) =>
            msg.senderId !== "currentUser" ||
            msg.time.getTime() < Date.now() - 1000
        )
      );
      return false;
    }
  };

  return (
    <>
      {loading ? (
        <div className='flex justify-center items-center h-full'>
          <LoadingSpinner size='lg' />
        </div>
      ) : (
        <Messages
          chats={chats}
          messages={messages}
          loading={messagesLoading}
          onSendMessage={sendMessage}
          selectedChat={selectedChat}
          setSelectedChat={handleSetSelectedChat}
          setMessagesLoading={setMessagesLoading}
        />
      )}
    </>
  );
};

export default MessagesPage;
