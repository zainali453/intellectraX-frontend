import React, { useState, useEffect } from "react";
import Messages, { Chat } from "@/components/Messages";
import { useParams } from "react-router-dom";
import { studentService } from "@/services/student.service";
import LoadingSpinner from "@/components/LoadingSpinner";

const MessagesPage = () => {
  const id = useParams().id;
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadChats = async () => {
    try {
      setLoading(true);

      const response = await studentService.getChats();
      if (response && response.data) {
        setChats(response.data);
        if (id) {
          const chat = response.data.find((chat: Chat) => chat.userId === id);
          if (chat) setSelectedChat(chat);
          // else {
          //   const studentDetails = await studentService.getStudentForChat(id);
          //   if (studentDetails && studentDetails.data) {
          //     const newChat: Chat = {
          //       userId: studentDetails.data.userId,
          //       fullName: studentDetails.data.fullName,
          //       profilePic: studentDetails.data.profilePic || "",
          //       online: false,
          //       lastMessage: "",
          //       time: null,
          //     };
          //     setChats((prevChats) => [...prevChats, newChat]);
          //     setSelectedChat(newChat);
          //   }
          // }
        }
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  const loadMessages = async (userId: string) => {
    try {
      const response = await studentService.getMessages(userId);
      if (response && response.data && response.data.messages) {
        return response.data.messages;
      }
      return [];
    } catch (error) {
      console.error("Failed to load messages:", error);
      return [];
    } finally {
    }
  };

  const sendMessage = async (userId: string, message: string) => {
    try {
      if (!selectedChat) return false;

      const response = await studentService.sendMessage(userId, message);
      if (response && response.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to load messages:", error);
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
          onLoadMessages={loadMessages}
          onSendMessage={sendMessage}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      )}
    </>
  );
};

export default MessagesPage;
