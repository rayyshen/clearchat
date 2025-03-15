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

export interface Message {
    id: string;
    text: string;
    userId: string;
    username: string;
    timestamp: any;
}