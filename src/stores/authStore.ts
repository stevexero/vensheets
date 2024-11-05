import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supaClient } from '../supabase/supaClient';

// interface AuthResponse {
//   success: boolean;
//   data: any | null;
//   message: string;
// }

interface AuthState {
  session: Session | null;
  //   profile: any | null;

  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  //   getUserProfile: () => Promise<AuthResponse>;
  //   setProfile: (prof: any) => void;
}

// const useAuthStore = create<AuthState>((set, get) => ({
const useAuthStore = create<AuthState>((set) => ({
  session: null,
  //   profile: null,

  initializeAuth: async () => {
    try {
      const { data, error } = await supaClient.auth.getSession();

      if (error) {
        console.error('Error during login:', error.message);
        return;
      }

      if (data) {
        set({ session: data.session });
      }

      supaClient.auth.onAuthStateChange((_event, session) => {
        if (session) {
          //   set({ session, profile: null });
          set({ session });
        } else {
          //   set({ session: null, profile: null });
          set({ session: null });
        }
      });
    } catch (error) {
      console.error('Unexpected error during auth initialization:', error);
    }
  },

  login: async (email, password) => {
    try {
      const { error, data: sessionData } =
        await supaClient.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        console.error('Error during login:', error.message);
        return error.message;
      }

      if (sessionData) {
        set({ session: sessionData.session });

        // await get().getUserProfile();
      }

      return null;
    } catch (err) {
      console.error('Unexpected error during login:', err);
      return 'Unexpected error during login';
    }
  },

  logout: async () => {
    await supaClient.auth.signOut();
    // set({ session: null, profile: null });
    set({ session: null });
  },

  //   getUserProfile: async (): Promise<AuthResponse> => {
  //     const { session } = get();

  //     if (session?.user) {
  //       try {
  //         const { data, error } = await supaClient
  //           .from('user_profiles')
  //           .select('*')
  //           .eq('user_id', session?.user.id);
  //         // .single();

  //         if (error) {
  //           return { success: false, data: null, message: error.message };
  //         }

  //         if (data.length > 0) {
  //           set({ profile: data[0], userRole: data[0].role });
  //           return {
  //             success: true,
  //             data: data[0],
  //             message: 'Successfully fetched user profile',
  //           };
  //         } else {
  //           return { success: false, data: null, message: error.message };
  //         }
  //       } catch (err) {
  //         console.error('Unexpected error fetching user profile:', err);
  //         return { success: false, data: null, message: err };
  //       }
  //     }

  //     return { success: false, data: null, message: 'No Session' };
  //   },

  //   setProfile: (prof) => {
  //     set({ profile: prof });
  //   },
}));

export default useAuthStore;
