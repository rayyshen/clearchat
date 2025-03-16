import { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/initFirebase';
import { PrivateMessage } from '../types/chat';
import { Send } from 'lucide-react';
import { detectEmotion } from '../utils/emotionDetection';

interface Props {
    chatId: string;
    currentUser: any;
    onSend: (message: string, emotion: string) => Promise<void>;
    newMessage: string;
    setNewMessage: (message: string) => void;
}

const PrivateChatMessages = ({ chatId, currentUser, onSend, newMessage, setNewMessage }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [messages, setMessages] = useState<PrivateMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize video
    useEffect(() => {
        const initializeVideo = async () => {
            try {
                setIsLoading(true);
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        width: 128,
                        height: 96,
                        facingMode: 'user'
                    } 
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setError(null);
            } catch (err) {
                setError('Camera access denied');
                console.error('Error accessing camera:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initializeVideo();

        // Cleanup
        return () => {
            const stream = videoRef.current?.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());
        };
    }, []);

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

    const captureFrame = (): Promise<string> => {
        return new Promise((resolve) => {
            if (!videoRef.current) {
                resolve('');
                return;
            }
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            resolve(canvas.toDataURL('image/jpeg'));
        });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const frameBase64 = await captureFrame();
            const emotion = await detectEmotion(frameBase64);
            console.log(emotion);
            await onSend(newMessage, emotion);
            setNewMessage('');
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
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
                                            className={`px-4 py-2 rounded-lg ${isSentByMe
                                                ? 'bg-blue-500 text-white rounded-br-none'
                                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                                }`}
                                        >
                                            <p>{message.text}</p>
                                            {message.emotion && (
                                                <div className="text-xs mt-1 opacity-75">
                                                    Emotion: {message.emotion}
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className={`text-xs mt-1 ${isSentByMe ? 'text-right text-gray-500' : 'text-left text-gray-500'
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

            <div className="border-t p-3 bg-white">
                <form onSubmit={handleSend} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative">
                                {error && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded">
                                        <div className="text-sm text-red-500">{error}</div>
                                    </div>
                                )}
                                {isLoading && !error && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                                        <div className="text-sm text-gray-500">Loading camera...</div>
                                    </div>
                                )}
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-32 h-24 rounded"
                                    style={{ display: isLoading || error ? 'none' : 'block' }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className={`p-3 rounded-lg ${newMessage.trim()
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    } transition-colors duration-200`}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrivateChatMessages;