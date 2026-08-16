import React, { createContext, useContext, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [courseProgress, setCourseProgress] = useState({}); // { courseId: [progressObj] }
  const [loadingProgress, setLoadingProgress] = useState(false);
  const { setUser } = useAuth();

  const fetchProgress = async (courseId) => {
    try {
      setLoadingProgress(true);
      const res = await api.get(`/courses/${courseId}/my-progress`);
      if (res.data.success) {
        setCourseProgress(prev => ({
          ...prev,
          [courseId]: res.data.progresses
        }));
      }
    } catch (err) {
      console.error('Progress Fetch Error:', err.message);
    } finally {
      setLoadingProgress(false);
    }
  };

  const markComplete = async (courseId, lessonId) => {
    try {
      const res = await api.post(`/progress/lesson/${lessonId}/complete`, { courseId });
      if (res.data.success) {
        // Update local progresses
        setCourseProgress(prev => {
          const current = prev[courseId] || [];
          const index = current.findIndex(p => p.lesson === lessonId);
          if (index !== -1) {
            const updated = [...current];
            updated[index] = res.data.progress;
            return { ...prev, [courseId]: updated };
          } else {
            return { ...prev, [courseId]: [...current, res.data.progress] };
          }
        });

        // Trigger XP Reward Toast
        if (res.data.xpResults) {
          toast.success(`⚡ +${res.data.xpResults.xp} XP - Lesson Complete!`);
          
          // Update User XP & Level in Auth Context
          setUser(prevUser => {
            if (!prevUser) return null;
            return {
              ...prevUser,
              xp: prevUser.xp + res.data.xpResults.xp,
              level: res.data.xpResults.level
            };
          });

          // Level Up Confetti!
          if (res.data.xpResults.leveledUp) {
            setTimeout(() => {
              toast(`🎉 Level Up! You reached ${res.data.xpResults.level.toUpperCase()} status!`, {
                duration: 6000,
                icon: '🏆',
                style: {
                  background: '#8b5cf6',
                  color: '#fff',
                  fontWeight: 'bold',
                  border: '2px solid #fff'
                }
              });
              // Fire confetti
              confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
              });
            }, 500);
          }
        }

        // Trigger Badge Modal notifications if badges earned
        if (res.data.badgeResults && res.data.badgeResults.length > 0) {
          res.data.badgeResults.forEach(badge => {
            toast(`🎖️ Badge Unlocked: ${badge.name}!`, {
              duration: 5000,
              icon: '🔥',
              style: {
                background: '#f97316',
                color: '#fff',
                border: '2px solid #fff'
              }
            });
          });
        }

        return { success: true };
      }
    } catch (err) {
      toast.error('Failed to update progress');
      return { success: false };
    }
  };

  const savePlaytime = async (courseId, lessonId, watchedSeconds) => {
    try {
      await api.post(`/progress/lesson/${lessonId}/watch-time`, { courseId, watchedSeconds });
    } catch (e) {
      // Slient failure for analytics ticks
    }
  };

  return (
    <ProgressContext.Provider value={{ courseProgress, fetchProgress, markComplete, savePlaytime, loadingProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
