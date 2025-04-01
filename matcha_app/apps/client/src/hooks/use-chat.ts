import { TUser } from '@matcha/common';
import { create } from 'zustand';

type TChatWindow = {
  id: string;
  otherUser: Omit<TUser, 'password'>;
  status: 'full' | 'collapse';
};

type TChatStore = {
  openedChats: TChatWindow[];
  setChatStatus: (id: string, status: TChatWindow['status']) => void;
  addChatWindow: (otherUser: Omit<TUser, 'password'>, userId: number) => void;
  removeChatWindow: (id: string) => void;
};

export const useChatStore = create<TChatStore>((set) => ({
  openedChats: [],
  setChatStatus: (id, status) => {
    set((state) => ({
      openedChats: state.openedChats.map((chat) =>
        chat.id === id ? { ...chat, status } : chat
      ),
    }));
  },
  addChatWindow: (otherUser, userId) => {
    set((state) => {
      const sortedUserIds = [otherUser.id, userId].sort();
      const chatRoomName = `chat-${sortedUserIds[0]}-${sortedUserIds[1]}`;

      // if (!state.openedChats.some((chat) => chat.id === chatRoomName)) {
      //   return {
      //     openedChats: [
      //       ...state.openedChats,
      //       { id: chatRoomName, otherUser, status: 'full' },
      //     ],
      //   };
      // }
      // return state;

      if (state.openedChats.some((chat) => chat.id === chatRoomName)) {
        return state;
      }

      let updatedChats = [...state.openedChats];
      if (updatedChats.length >= 1) {
        updatedChats = updatedChats.slice(1);
      }
      updatedChats.push({ id: chatRoomName, otherUser, status: 'full' });

      return {
        openedChats: updatedChats,
      };
    });
  },
  removeChatWindow: (id) => {
    set((state) => ({
      openedChats: state.openedChats.filter((chat) => chat.id !== id),
    }));
  },
}));
