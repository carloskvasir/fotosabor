import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebaseConfig';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    // Aguardar um pouco para garantir que o Firebase foi inicializado
    const initAuth = async () => {
      try {
        // Pequeno delay para garantir inicialização
        await new Promise(resolve => setTimeout(resolve, 100));

        unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            setUser(user);
            setIsLoading(false);
            setError(null);
          },
          (error) => {
            console.error('Firebase Auth Error:', error);
            setError(error.message);
            setIsLoading(false);
          },
        );
      } catch (error) {
        console.error('Firebase Auth Initialization Error:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { user, isLoading, error };
};
