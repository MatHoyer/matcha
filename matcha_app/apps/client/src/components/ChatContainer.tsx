import { Chat } from '@/pages/Chat';
import { TUser } from '@matcha/common';
import React from 'react';

export const ChatContainer: React.FC<{
  openedChats: { id: string; otherUser: TUser; status: 'full' | 'collapse' }[];
  setOpenChats: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        otherUser: TUser;
        status: 'full' | 'collapse';
      }[]
    >
  >;
}> = ({ openedChats, setOpenChats }) => {
  return (
    <div className="flex flex-row-reverse gap-2 absolute right-2 bottom-2 items-end">
      {openedChats.map((chatWindow) => (
        <Chat
          key={chatWindow.id}
          status={chatWindow.status}
          otherUser={chatWindow.otherUser}
          toggleChat={() => {
            setOpenChats((prevChats) =>
              prevChats.map((prevChat) => {
                if (prevChat.id === chatWindow.id) {
                  return {
                    ...prevChat,
                    status: prevChat.status === 'full' ? 'collapse' : 'full',
                  };
                }
                return prevChat;
              })
            );
          }}
          closeChat={() =>
            setOpenChats((prevChats) =>
              prevChats.filter((prevChat) => prevChat.id !== chatWindow.id)
            )
          }
        />
      ))}
    </div>
  );
};
