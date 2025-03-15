import { LogOut } from 'lucide-react';
import { useRouter } from 'next/router';
import { signOut } from "firebase/auth";
import { auth } from "../firebase/initFirebase";

interface SignOutButtonProps {
  className?: string;
}

const SignOutButton = ({ className = '' }: SignOutButtonProps) => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Signed out");
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className={`flex items-center gap-2 ${className}`}
    >
      <LogOut size={18} />
      <span>Sign Out</span>
    </button>
  );
};

export default SignOutButton;