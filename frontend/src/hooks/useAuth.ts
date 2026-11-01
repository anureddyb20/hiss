import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserRead } from '../schemas/user';

export const useAuth = () => {
  const [user, setUser] = useState<UserRead | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const resp = await axios.get<UserRead>('/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(resp.data);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return { user, loading };
};
