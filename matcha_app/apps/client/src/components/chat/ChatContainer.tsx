import { Chat } from '@/components/chat/Chat';
import { TUser } from '@matcha/common';
import React from 'react';
import { useChatStore } from '@/hooks/use-chat';

export const ChatContainer: React.FC<{
  openedChats: { id: string; otherUser: TUser; status: 'full' | 'collapse' }[];
  removeChatWindow: (id: string) => void;
}> = ({ openedChats, removeChatWindow }) => {
  const { setChatStatus } = useChatStore();
  return (
    <div className="flex flex-row-reverse gap-2 fixed right-4 bottom-2 items-end">
      {openedChats.map((chatWindow) => (
        <Chat
          key={chatWindow.id}
          status={chatWindow.status}
          otherUser={chatWindow.otherUser}
          toggleChat={() => {
            setChatStatus(
              chatWindow.id,
              chatWindow.status === 'full' ? 'collapse' : 'full'
            );
          }}
          closeChat={() => removeChatWindow(chatWindow.id)}
        />
      ))}
    </div>
  );
};
