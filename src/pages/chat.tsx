import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/initFirebase';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import { PrivateChat, PrivateMessage, Message } from '../types/chat';
import PrivateChatMessages from '../components/PrivateChatMessages';
import SignOutButton from '@/components/SignOutButton';
import { UserCircle, MessageSquare, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';


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
    const [searchTerm, setSearchTerm] = useState('');
    const [username, setUsername] = useState<string>('');
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

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUsername(user.email || user.displayName || '');
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

    const filteredUsers = users.filter(u =>
        (u.name?.toLowerCase() || u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <Link href="/"><div className="text-xl font-semibold text-gray-800">ClearChat</div></Link>
                <div className="flex items-center gap-4">
                    {username && <span className="text-sm">{user.name}</span>}
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                        <span className="text-sm font-medium">
                            {username ? user.email?.charAt(0).toUpperCase() || 'U' : 'G'}
                        </span>
                    </div>
                    <SignOutButton className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 flex items-center gap-2" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto p-4 max-w-5xl overflow-hidden">
                {!selectedUser ? (
                    // User selection view
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contacts</h2>

                            {/* Search bar */}
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-3 pl-4 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="absolute right-3 top-3 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                            </div>

                            {/* User list */}
                            <div className="max-h-96 overflow-y-auto">
                                {filteredUsers.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-2">
                                        {filteredUsers.map(u => (
                                            <div
                                                key={u.uid}
                                                onClick={() => startPrivateChat(u)}
                                                className="flex items-center cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                            >
                                                <div className="bg-blue-100 text-blue-500 rounded-full p-2 mr-3">
                                                    <UserCircle size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{u.name || u.email?.split('@')[0]}</p>
                                                    {u.name && <p className="text-sm text-gray-500">{u.email}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center text-gray-500">
                                        No users match your search
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Chat view
                    <div className="bg-white rounded-lg shadow-md flex flex-col h-[calc(100vh-8rem)]">
                        {/* Chat Header */}
                        <div className="border-b p-4 flex items-center">
                            <button
                                onClick={handleBack}
                                className="mr-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div className="bg-blue-100 text-blue-500 rounded-full p-2 mr-3">
                                <UserCircle size={20} />
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

                        {/* Chat Messages */}
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
                )}
            </main>
        </div>
    );
};

export default ChatPage;