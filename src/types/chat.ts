export interface PrivateChat {
  id: string;
  participants: string[]; 
  lastMessage?: string;
  lastMessageTime?: Date;
}

export interface PrivateMessage {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  chatId: string;
}
