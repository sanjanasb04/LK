import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function useXP() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [xpHistory, setXpHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/xp/leaderboard');
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard);
      }
    } catch (err) {
      console.error('Leaderboard error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/xp/me');
      if (res.data.success) {
        setXpHistory(res.data.history);
      }
    } catch (err) {
      console.error('XP history error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  // Determine user level parameters
  const getLevelDetails = (xp) => {
    if (xp >= 6000) return { name: 'Diamond', nextName: 'Max Level', nextThreshold: 6000, percentage: 100 };
    if (xp >= 3000) return { name: 'Platinum', nextName: 'Diamond', nextThreshold: 6000, percentage: Math.round(((xp - 3000) / 3000) * 100) };
    if (xp >= 1500) return { name: 'Gold', nextName: 'Platinum', nextThreshold: 3000, percentage: Math.round(((xp - 1500) / 1500) * 100) };
    if (xp >= 500) return { name: 'Silver', nextName: 'Gold', nextThreshold: 1500, percentage: Math.round(((xp - 500) / 1000) * 100) };
    return { name: 'Bronze', nextName: 'Silver', nextThreshold: 500, percentage: Math.round((xp / 500) * 100) };
  };

  return {
    leaderboard,
    xpHistory,
    loading,
    fetchLeaderboard,
    fetchHistory,
    getLevelDetails
  };
}
