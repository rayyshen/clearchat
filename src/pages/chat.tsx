import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/initFirebase'; 
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import { PrivateChat, PrivateMessage } from '../types/chat';
import PrivateChatMessages from '../components/PrivateChatMessages';
import SignOutButton from '@/components/SignOutButton';


interface Message {
    id: string;
    text: string;
    userId: string;
    username: string;
    timestamp: any;
}

interface User {
  uid: string;
  name: string;
  email: string;
}

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [privateChats, setPrivateChats] = useState<PrivateChat[]>([]);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        // Fetch users
        const fetchUsers = async () => {
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);
            const userList = snapshot.docs
                .map(doc => ({ ...doc.data(), uid: doc.id } as User))
                .filter(u => u.uid !== user.uid);
            setUsers(userList);
        };

        fetchUsers();

        // Subscribe to private chats
        const chatsRef = collection(db, 'privateChats');
        const q = query(chatsRef, where('participants', 'array-contains', user.uid));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PrivateChat[];
            setPrivateChats(chats);
        });

        return () => unsubscribe();
    }, [user, router]);

    const startPrivateChat = async (otherUser: User) => {
        setSelectedUser(otherUser);
        const chatExists = privateChats.find(chat => 
            chat.participants.includes(otherUser.uid) && 
            chat.participants.includes(user!.uid)
        );

        if (chatExists) {
            setSelectedChat(chatExists.id);
            return;
        }

        const chatRef = await addDoc(collection(db, 'privateChats'), {
            participants: [user!.uid, otherUser.uid],
            createdAt: new Date()
        });

        setSelectedChat(chatRef.id);
    };

    const sendPrivateMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !selectedChat) return;

        try {
            const messageRef = collection(db, `privateChats/${selectedChat}/messages`);
            await addDoc(messageRef, {
                text: newMessage,
                senderId: user.uid,
                timestamp: new Date()
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleBack = () => {
        setSelectedUser(null);
        setSelectedChat(null);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <SignOutButton />
            {!selectedUser ? (
                // User selection view
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="font-bold mb-4">Select a User to Chat With</h2>
                    <div className="grid grid-cols-1 gap-2">
                        {users.map(u => (
                            <div
                                key={u.uid}
                                onClick={() => startPrivateChat(u)}
                                className="cursor-pointer p-3 hover:bg-gray-100 rounded border"
                            >
                                {u.name || u.email?.split('@')[0]}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Chat view
                <div className="bg-white rounded-lg shadow">
                    <div className="border-b p-4 flex items-center justify-between">
                        <h2 className="font-bold">
                            Chat with {selectedUser.name || selectedUser.email?.split('@')[0]}
                        </h2>
                        <button
                            onClick={handleBack}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            Back to Users
                        </button>
                    </div>
                    {selectedChat && (
                        <PrivateChatMessages 
                            chatId={selectedChat}
                            currentUser={user}
                            onSend={sendPrivateMessage}
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatPage;