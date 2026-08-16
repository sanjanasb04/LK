import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProgress from '../../hooks/useProgress';
import { useAuth } from '../../context/AuthContext';
import VideoPlayer from '../../components/ui/VideoPlayer';
import PDFViewer from '../../components/ui/PDFViewer';
import QuizWidget from '../../components/ui/QuizWidget';
import LessonRow from '../../components/ui/LessonRow';
import ProgressBar from '../../components/ui/ProgressBar';
import { 
  ChevronLeft, CheckCircle, ChevronDown, ChevronUp, BookOpen 
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function CoursePlayerPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courseProgress, fetchProgress, markComplete } = useProgress();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Accordion collapsed state: { [moduleId]: boolean }
  const [moduleCollapse, setModuleCollapse] = useState({});

  // Load Course and Progress
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true);
        const courseRes = await api.get(`/courses/${slug}`);
        if (courseRes.data.success) {
          setCourse(courseRes.data.course);
          
          // Fetch learner progress
          await fetchProgress(courseRes.data.course._id);

          // Select first lesson by default
          if (courseRes.data.course.modules?.length > 0) {
            const firstMod = courseRes.data.course.modules[0];
            if (firstMod.lessons?.length > 0) {
              setCurrentLesson(firstMod.lessons[0]);
            }
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load course player.');
      } finally {
        setLoading(false);
      }
    };
    loadCourseData();
  }, [slug]);

  if (loading || !course) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Progress map
  const progressList = courseProgress[course._id] || [];
  const completedLessons = progressList.filter(p => p.isCompleted).map(p => p.lesson);

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
  };

  const toggleModule = (mId) => {
    setModuleCollapse(prev => ({
      ...prev,
      [mId]: !prev[mId]
    }));
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    const res = await markComplete(course._id, currentLesson._id);
    if (res.success) {
      // Reload progress state
      fetchProgress(course._id);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] relative">
      
      {/* LEFT: Curriculum Syllabus Accordion (320px) */}
      <div className="w-full lg:w-[320px] bg-white border border-slate-100 rounded-panel shadow-sm flex flex-col h-full overflow-hidden select-none">
        
        {/* Course Title and Progress Header */}
        <div className="p-4 border-b border-slate-100 text-left bg-slate-50">
          <button 
            onClick={() => navigate('/lms/my-courses')} 
            className="flex items-center gap-1 text-[10px] font-black text-primary hover:underline uppercase mb-2"
          >
            <ChevronLeft size={14} />
            Back to courses
          </button>
          <h2 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-2">{course.title}</h2>
          
          <div className="mt-3">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
              <span>Course Progress</span>
              <span>{Math.round((completedLessons.length / course.totalLessons) * 100 || 38)}%</span>
            </div>
            <ProgressBar percentage={Math.round((completedLessons.length / course.totalLessons) * 100 || 38)} color="bg-primary" height="h-1.5" />
          </div>
        </div>

        {/* Modules Accordion List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
          {course.modules?.map((mod, modIdx) => {
            const isCollapsed = moduleCollapse[mod._id];
            
            // Check completed count inside module
            const moduleLessonIds = mod.lessons.map(l => l._id.toString());
            const moduleDoneCount = completedLessons.filter(lId => moduleLessonIds.includes(lId)).length;
            const moduleProgressPercent = Math.round((moduleDoneCount / mod.lessons.length) * 100);

            return (
              <div key={mod._id} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                
                {/* Accordion Trigger Header */}
                <div 
                  onClick={() => toggleModule(mod._id)}
                  className="p-3 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                >
                  <div className="text-left min-w-0 pr-2">
                    <span className="text-[9px] font-black text-slate-400 block uppercase">
                      Module {modIdx + 1} • {moduleProgressPercent}%
                    </span>
                    <h3 className="font-bold text-xs text-slate-700 truncate leading-snug">{mod.title}</h3>
                  </div>
                  <button className="text-slate-400">
                    {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </button>
                </div>

                {/* Lessons Rows */}
                {!isCollapsed && (
                  <div className="p-2 bg-white space-y-1.5 border-t border-slate-100">
                    {mod.lessons.map((lesson) => {
                      const isCurrent = currentLesson && currentLesson._id.toString() === lesson._id.toString();
                      const isDone = completedLessons.includes(lesson._id.toString());

                      return (
                        <LessonRow
                          key={lesson._id}
                          lesson={lesson}
                          isCurrent={isCurrent}
                          isCompleted={isDone}
                          onClick={() => handleLessonSelect(lesson)}
                        />
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

      {/* CENTER: Video/PDF/Quiz content player (Flex-1) */}
      <div className="flex-1 bg-white border border-slate-100 rounded-panel shadow-sm p-4 flex flex-col justify-between h-full overflow-hidden">
        
        {/* Player Window */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {currentLesson ? (
            <div className="space-y-4">
              
              {/* Lesson details header */}
              <div className="flex justify-between items-start border-b border-slate-50 pb-3 text-left select-none">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    CURRENT LESSON • {currentLesson.type.toUpperCase()}
                  </span>
                  <h2 className="font-extrabold text-slate-800 text-sm mt-0.5">{currentLesson.title}</h2>
                </div>
              </div>

              {/* Player element dynamically based on type */}
              {currentLesson.type === 'video' && (
                <VideoPlayer
                  url={currentLesson.content || 'https://www.w3schools.com/html/mov_bbb.mp4'}
                  savedPosition={0}
                  onEnded={handleMarkComplete}
                />
              )}

              {currentLesson.type === 'pdf' && (
                <PDFViewer
                  url={currentLesson.content || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                  title={currentLesson.title}
                />
              )}

              {currentLesson.type === 'quiz' && (
                <QuizWidget
                  quiz={{
                    _id: 'q101',
                    title: 'Module Assessment Assessment Checkpoint',
                    timeLimit: 10,
                    passPercentage: 80,
                    questions: [
                      {
                        _id: 'ques1',
                        questionText: 'A project manager is facing a risk of scheduling delays due to weather disruptions. They decide to outsource the construction work to a local firm, transferring the risk. What response strategy is this?',
                        options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
                        correctAnswer: 'Transfer',
                        explanation: 'Transferring risk allocates ownership of threat consequences to a third party (like signing contracts or hiring local firms).'
                      },
                      {
                        _id: 'ques2',
                        questionText: 'Activities on the critical path of a scheduling network have a total float of how many days?',
                        options: ['0 days', '1 day', 'Depends on milestones', 'Infinity'],
                        correctAnswer: '0 days',
                        explanation: 'Activities on the critical path dictate the project deadline and thus have ZERO float (slack).'
                      }
                    ]
                  }}
                  lessonId={currentLesson._id}
                  courseId={course._id}
                  onFinished={() => fetchProgress(course._id)}
                />
              )}

              {currentLesson.type === 'text' && (
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl text-left text-xs leading-relaxed max-w-none prose">
                  <h3 className="font-bold text-slate-700 mb-3">Key Concepts Summary</h3>
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.content || 'Lesson content is empty' }} />
                </div>
              )}

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <BookOpen size={48} className="animate-pulse" />
              <p className="text-xs font-semibold mt-2">Select a lesson from the curriculum to begin</p>
            </div>
          )}
        </div>

        {/* Player controls footer */}
        {currentLesson && currentLesson.type !== 'quiz' && (
          <div className="border-t border-slate-100 pt-4 flex justify-between items-center mt-4 select-none">
            <button 
              onClick={handleMarkComplete}
              className={`flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                completedLessons.includes(currentLesson._id.toString())
                  ? 'bg-success/10 text-success border border-success/30 cursor-default'
                  : 'bg-accent hover:bg-accent-dark text-white'
              }`}
            >
              <CheckCircle size={15} />
              {completedLessons.includes(currentLesson._id.toString()) ? 'Completed ✅' : 'Mark as Complete'}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
