import { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/initFirebase';
import { PrivateMessage } from '../types/chat';
import { Send } from 'lucide-react';

interface Props {
    chatId: string;
    currentUser: any;
    onSend: (e: React.FormEvent) => Promise<void>;
    newMessage: string;
    setNewMessage: (message: string) => void;
}

const PrivateChatMessages = ({ chatId, currentUser, onSend, newMessage, setNewMessage }: Props) => {
    const [messages, setMessages] = useState<PrivateMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Autoscroll
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const messagesRef = collection(db, `privateChats/${chatId}/messages`);
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messageList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PrivateMessage[];
            setMessages(messageList);
        });

        return () => unsubscribe();
    }, [chatId]);

    const formatTime = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* Message List */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <div className="mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="text-sm">Send a message to start chatting</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {messages.map((message) => {
                            const isSentByMe = message.senderId === currentUser.uid;
                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isSentByMe ? 'items-end' : 'items-start'}`}>
                                        <div
                                            className={`px-4 py-2 rounded-lg ${
                                                isSentByMe
                                                    ? 'bg-blue-500 text-white rounded-br-none'
                                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                            }`}
                                        >
                                            <p>{message.text}</p>
                                        </div>
                                        <div 
                                            className={`text-xs mt-1 ${
                                                isSentByMe ? 'text-right text-gray-500' : 'text-left text-gray-500'
                                            }`}
                                        >
                                            {formatTime(message.timestamp)}
                                            {isSentByMe ? ' • Sent' : ' • Received'}
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
            <div className="border-t p-3">
                <form onSubmit={onSend} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`p-3 rounded-lg ${
                            newMessage.trim() 
                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        } transition-colors duration-200`}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </>
    );
};

export default PrivateChatMessages;