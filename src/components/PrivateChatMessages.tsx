import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/initFirebase';
import { PrivateMessage } from '../types/chat';

interface Props {
    chatId: string;
    currentUser: any;
    onSend: (e: React.FormEvent) => Promise<void>;
    newMessage: string;
    setNewMessage: (message: string) => void;
}

const PrivateChatMessages = ({ chatId, currentUser, onSend, newMessage, setNewMessage }: Props) => {
    const [messages, setMessages] = useState<PrivateMessage[]>([]);

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
        <div>
            <div className="h-[500px] overflow-y-auto p-4">
                {messages.map((message) => {
                    const isSentByMe = message.senderId === currentUser.uid;
                    return (
                        <div
                            key={message.id}
                            className={`mb-6 flex ${
                                isSentByMe ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div className={`max-w-[70%] ${isSentByMe ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`rounded-2xl px-4 py-2 ${
                                        isSentByMe
                                            ? 'bg-blue-500 text-white rounded-br-none'
                                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                <div 
                                    className={`text-xs mt-1 text-gray-500 ${
                                        isSentByMe ? 'text-right' : 'text-left'
                                    }`}
                                >
                                    {formatTime(message.timestamp)}
                                    {isSentByMe ? ' • Sent' : ' • Received'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <form onSubmit={onSend} className="border-t p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 border rounded-lg px-4 py-2"
                        placeholder="Type a message..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PrivateChatMessages;
