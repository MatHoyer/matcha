import { Chat } from '@/pages/Chat';
import { TUser } from '@matcha/common';
import React from 'react';

export const ChatContainer: React.FC<{
  openedChats: { id: string; otherUser: TUser }[];
  setOpenChats: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        otherUser: TUser;
      }[]
    >
  >;
}> = ({ openedChats, setOpenChats }) => {
  return (
    <div className="flex flex-row-reverse gap-2 absolute right-2 bottom-2">
      {openedChats.map((chat) => (
        <Chat
          key={chat.id}
          roomId={chat.id}
          otherUserName={chat.otherUser.name}
          closeChat={() =>
            setOpenChats((prevChats) =>
              prevChats.filter((prevChat) => prevChat.id !== chat.id)
            )
          }
        />
      ))}
    </div>
  );
};
