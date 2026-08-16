import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressRing from './ProgressRing';
import ProgressBar from './ProgressBar';
import { Award, BookOpen, Star } from 'lucide-react';

export default function CourseCard({ course, enrollment = null }) {
  const navigate = useNavigate();
  
  // Calculate completion percentage and current lesson statuses
  const percentage = enrollment ? (enrollment.isCompleted ? 100 : 38) : 0; // Default mock progress if enrolled
  const hasStarted = enrollment ? true : false;
  const isCompleted = enrollment ? enrollment.isCompleted : false;
  const currentModule = enrollment ? 'Module 3 of 6' : '';
  const currentLesson = enrollment ? 'Lesson 7 of 50' : '';

  const handleCTA = () => {
    if (hasStarted) {
      // Direct to Course Player with first incomplete lesson (mocked slug/lesson ID)
      navigate(`/lms/course/${course.slug}/lesson/l101`);
    } else {
      // Navigate to detailed syllabus or direct enroll
      navigate(`/lms/my-courses`); // Simple redirect
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Course Thumbnail */}
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        {course.thumbnail ? (
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-light to-primary text-white text-lg font-bold">
            {course.title.slice(0, 3).toUpperCase()}
          </div>
        )}

        {/* Status Badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm ${
          isCompleted 
            ? 'bg-success text-white' 
            : hasStarted 
            ? 'bg-primary text-white' 
            : 'bg-slate-500 text-white'
        }`}>
          {isCompleted ? '✅ Completed' : hasStarted ? '🔵 In Progress' : '○ Not Started'}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h3 className="font-bold text-slate-800 text-base leading-snug mb-2 hover:text-primary transition-colors cursor-pointer" onClick={handleCTA}>
          {course.title}
        </h3>

        {/* Instructor Row */}
        <div className="flex items-center gap-2 mb-4">
          <img 
            src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'} 
            alt={course.instructor?.name || 'Instructor'} 
            className="w-6 h-6 rounded-full object-cover border border-slate-200"
          />
          <span className="text-xs text-slate-500 font-medium">
            {course.instructor?.name || 'Lead Instructor'}
          </span>
        </div>

        {/* Statistics Grid */}
        <div className="flex justify-between items-center mb-4 text-xs font-medium text-slate-500 border-t border-slate-50 pt-3">
          <span className="flex items-center gap-1">
            <BookOpen size={14} className="text-slate-400" />
            {course.totalLessons || 50} Lessons
          </span>
          {hasStarted && (
            <span className="text-slate-400">
              {currentModule} • {currentLesson}
            </span>
          )}
        </div>

        {/* Progress Section */}
        {hasStarted && (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-500">Progress</span>
                <span className="text-slate-800">{percentage}%</span>
              </div>
              <ProgressBar percentage={percentage} color="bg-primary" height="h-1.5" />
            </div>
            <ProgressRing percentage={percentage} size={42} strokeWidth={3} />
          </div>
        )}

        {/* Action Button Row */}
        <div className="flex items-center gap-2 mt-4">
          <button 
            onClick={handleCTA}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all duration-200 ${
              isCompleted 
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                : 'bg-accent text-white hover:bg-accent-dark shadow-sm'
            }`}
          >
            {isCompleted ? 'Review Course' : hasStarted ? 'Continue Learning →' : 'Start Course'}
          </button>
          
          {isCompleted && (
            <button 
              onClick={() => navigate('/lms/certificates')}
              className="p-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors"
              title="View Certificate"
            >
              <Award size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
