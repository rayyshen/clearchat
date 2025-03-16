import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/initFirebase';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import { PrivateChat } from '../types/chat';
import PrivateChatMessages from '../components/PrivateChatMessages';
import SignOutButton from '@/components/SignOutButton';
import { MessageSquare, ArrowLeft, Search, Users, LogOut, MessageSquareText } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

interface User {
    uid: string;
    name: string;
    email: string;
}

const ChatPage = () => {
    const [privateChats, setPrivateChats] = useState<PrivateChat[]>([]);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const { user } = useUser();

    // Custom animation styles
    const animationStyles = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
        }
    `;

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

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
            }
        });

        return () => unsubscribe();
    }, []);

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

    const sendPrivateMessage = async (message: string, emotion: string) => {
        if (!message.trim() || !user || !selectedChat) return;

        try {
            const messageRef = collection(db, `privateChats/${selectedChat}/messages`);
            await addDoc(messageRef, {
                text: message,
                senderId: user.uid,
                emotion: emotion,
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

    const filteredUsers = users.filter(u =>
        (u.name?.toLowerCase() || u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading ClearChat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white">
            <Head>
                <title>ClearChat - Messages</title>
                <meta name="description" content="Chat with emotional context in ClearChat" />
                <style>{animationStyles}</style>
            </Head>

            <header className="bg-white shadow-sm py-3 px-4 flex justify-between items-center">
                <Link href="/" className="flex items-center">
                    <span className="text-blue-600 mr-2">
                        <MessageSquareText size={28} />
                    </span>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ClearChat</h1>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 hidden md:block">{user.name || user.email?.split('@')[0]}</span>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-md">
                            <span className="text-sm font-medium">
                                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <SignOutButton className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 flex items-center gap-1 text-sm">
                            <LogOut size={14} />
                            Sign out
                        </SignOutButton>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden flex">
                {!selectedUser ? (
                    <div className="container mx-auto max-w-5xl p-4 animate-fadeIn">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                        <h2 className="text-lg font-semibold text-gray-800">Recent Chats</h2>
                                    </div>

                                    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                                        {privateChats.length > 0 ? (
                                            privateChats.map(chat => {
                                                const otherUserIds = chat.participants.filter(id => id !== user.uid);
                                                const otherUser = users.find(u => u.uid === otherUserIds[0]);

                                                if (!otherUser) return null;

                                                return (
                                                    <div
                                                        key={chat.id}
                                                        onClick={() => startPrivateChat(otherUser)}
                                                        className="p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 flex items-center"
                                                    >
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 text-white flex items-center justify-center mr-3 shadow-sm">
                                                            <span className="font-medium">
                                                                {otherUser.name?.charAt(0).toUpperCase() || otherUser.email?.charAt(0).toUpperCase() || 'U'}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-800 truncate">{otherUser.name || otherUser.email?.split('@')[0]}</p>
                                                            <p className="text-sm text-gray-500 truncate">Start a conversation</p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="p-6 text-center text-gray-500">
                                                <MessageSquare size={36} className="mx-auto mb-2 text-gray-300" />
                                                <p>No recent chats</p>
                                                <p className="text-sm text-gray-400 mt-1">Start a conversation with someone</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 flex flex-col">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Contacts</h2>

                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search contacts by name or email..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <Search size={18} />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto p-2">
                                        {filteredUsers.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {filteredUsers.map(u => (
                                                    <div
                                                        key={u.uid}
                                                        onClick={() => startPrivateChat(u)}
                                                        className="flex items-center cursor-pointer p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200 border border-gray-100 shadow-sm hover:shadow-md"
                                                    >
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 text-white flex items-center justify-center mr-3 shadow-sm">
                                                            <span className="font-medium">
                                                                {u.name?.charAt(0).toUpperCase() || u.email?.charAt(0).toUpperCase() || 'U'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800">{u.name || u.email?.split('@')[0]}</p>
                                                            {u.name && <p className="text-sm text-gray-500 truncate">{u.email}</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center text-gray-500">
                                                <Users size={48} className="mx-auto mb-3 text-gray-300" />
                                                <p className="font-medium">No users match your search</p>
                                                <p className="text-sm text-gray-400 mt-1">Try another search term</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (

                    <div className="container mx-auto max-w-5xl p-4 animate-fadeIn">
                        <div className="bg-white rounded-2xl shadow-lg flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
                            <div className="border-b p-4 flex items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                                <button
                                    onClick={handleBack}
                                    className="mr-3 text-gray-500 hover:text-blue-600 transition-colors duration-200 bg-white p-2 rounded-full shadow-sm"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 text-white flex items-center justify-center mr-3 shadow-md">
                                    <span className="font-medium">
                                        {selectedUser.name?.charAt(0).toUpperCase() || selectedUser.email?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-800">
                                        {selectedUser.name || selectedUser.email?.split('@')[0]}
                                    </h2>
                                    {selectedUser.name && (
                                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                                    )}
                                </div>
                            </div>

                            {selectedChat && (
                                <div className="flex-1 overflow-hidden flex flex-col">
                                    <PrivateChatMessages
                                        chatId={selectedChat}
                                        currentUser={user}
                                        onSend={sendPrivateMessage}
                                        newMessage={newMessage}
                                        setNewMessage={setNewMessage}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

        </div>
    );
};

export default ChatPage;