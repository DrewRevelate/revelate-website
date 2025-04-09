"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: any;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Function to get the current session
  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
    } catch (err) {
      console.error('Unexpected error refreshing session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const initAuth = async () => {
      setIsLoading(true);
      await refreshSession();
    };
    
    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          router.push('/auth/signin');
        } else if (event === 'USER_UPDATED') {
          console.log('User updated');
          await refreshSession();
        } else if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery requested');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      return { 
        data: null, 
        error: new Error('An unexpected error occurred') as unknown as AuthError 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
      return { 
        data: null, 
        error: new Error('An unexpected error occurred') as unknown as AuthError 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      router.push('/auth/signin');
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
