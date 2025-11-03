// src/hooks/useAuth.js
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null); // null = loading, true/false = ready

  const checkAdminStatus = useCallback(async (userId) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    try {
      // tentar buscar apenas a própria role (policy acima permite isso)
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(!!data);
    } catch (err) {
      console.error('Unexpected error checking admin status:', err);
      setIsAdmin(false);
    }
  }, []);

  const initFromSession = useCallback(async (s) => {
    setSession(s ?? null);
    const u = s?.user ?? null;
    setUser(u);
    if (u) {
      await checkAdminStatus(u.id);
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }, [checkAdminStatus]);

  useEffect(() => {
    let mounted = true;

    // inicializa a partir de sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      initFromSession(session);
    }).catch((err) => {
      console.error('getSession error', err);
      if (mounted) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    // listener para mudanças de auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      // ao mudar auth refazemos tudo
      initFromSession(session);
    });

    return () => {
      mounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, [initFromSession]);

  const signOut = async () => {
    await supabase.auth.signOut();
    // limpeza local imediata
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const refetch = async () => {
    setLoading(true);
    const { data: { session } = {} } = await supabase.auth.getSession();
    await initFromSession(session);
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    signOut,
    refetch
  };
};