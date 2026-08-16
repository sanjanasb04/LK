import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, BookOpen, Video, FileText, HelpCircle, Save, ChevronRight, ChevronLeft } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function CourseBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Curriculum
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('PMP Exam Prep');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState('0');
  const [isFree, setIsFree] = useState(true);

  // Curriculum State: [ { title: '', lessons: [ { title: '', type: 'video', duration: 0 } ] } ]
  const [modules, setModules] = useState([
    { title: 'Introduction & Foundations', lessons: [{ title: 'Overview & Syllabus', type: 'video', duration: 10 }] }
  ]);

  const handleAddModule = () => {
    setModules(prev => [
      ...prev,
      { title: 'New Module Title', lessons: [] }
    ]);
  };

  const handleRemoveModule = (modIdx) => {
    setModules(prev => prev.filter((_, idx) => idx !== modIdx));
  };

  const handleModuleTitleChange = (modIdx, val) => {
    setModules(prev => 
      prev.map((mod, idx) => idx === modIdx ? { ...mod, title: val } : mod)
    );
  };

  const handleAddLesson = (modIdx, type) => {
    setModules(prev => 
      prev.map((mod, idx) => {
        if (idx !== modIdx) return mod;
        return {
          ...mod,
          lessons: [
            ...mod.lessons,
            { title: 'New Lesson Detail', type: type, duration: 15 }
          ]
        };
      })
    );
  };

  const handleRemoveLesson = (modIdx, lesIdx) => {
    setModules(prev => 
      prev.map((mod, idx) => {
        if (idx !== modIdx) return mod;
        return {
          ...mod,
          lessons: mod.lessons.filter((_, lIdx) => lIdx !== lesIdx)
        };
      })
    );
  };

  const handleLessonChange = (modIdx, lesIdx, field, val) => {
    setModules(prev => 
      prev.map((mod, idx) => {
        if (idx !== modIdx) return mod;
        const updatedLessons = mod.lessons.map((les, lIdx) => 
          lIdx === lesIdx ? { ...les, [field]: val } : les
        );
        return { ...mod, lessons: updatedLessons };
      })
    );
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error('Please enter course title.');
      return;
    }

    try {
      // Save Course details
      const courseRes = await api.post('/courses', {
        title,
        subtitle,
        description,
        category,
        level,
        price: isFree ? 0 : Number(price),
        isFree
      });

      if (courseRes.data.success) {
        const courseId = courseRes.data.course._id;
        
        // Save Module & Lesson structure
        // Simple sequential save for demo fallback
        await api.put(`/courses/${courseId}`, {
          modules,
          isPublished: true
        });

        toast.success('Course published successfully! Sent for review.');
        navigate('/lms/instructor/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to publish course.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      
      {/* Header */}
      <div className="flex justify-between items-center select-none">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Course Builder</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Step {step} of 2 — {step === 1 ? 'Configure Basic Details' : 'Compile Curriculum Outline'}</p>
        </div>
      </div>

      {/* STEP 1: BASIC INFO */}
      {step === 1 && (
        <div className="bg-white border border-slate-100 p-6 rounded-panel shadow-sm space-y-4">
          <h2 className="font-extrabold text-slate-800 text-xs border-b border-slate-50 pb-2.5 mb-4">Course Specifications</h2>
          
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Course Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. PMP® Exam Preparation Mastery"
              className="w-full border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Course Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Master the 3 domains (People, Process, Business) in 90 days"
              className="w-full border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none"
              >
                <option>PMP Exam Prep</option>
                <option>Agile & Scrum</option>
                <option>Prince2 Frameworks</option>
              </select>
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Price (INR)</label>
              <input
                type="number"
                disabled={isFree}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none disabled:bg-slate-50"
              />
            </div>
            
            <div className="flex items-center gap-2 pt-5 select-none">
              <input
                type="checkbox"
                id="isFree"
                checked={isFree}
                onChange={() => setIsFree(!isFree)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <label htmlFor="isFree" className="text-xs font-bold text-slate-600 cursor-pointer">
                This is a free preview course
              </label>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Course Long Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe curriculum coverage, target students, learning outcomes..."
              className="w-full border border-slate-200 px-3 py-2.5 text-xs rounded-xl outline-none"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1 py-2.5 px-6 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              Continue to Syllabus
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SYLLABUS CURRICULUM BUILDER */}
      {step === 2 && (
        <div className="space-y-6">
          
          {/* Modules outline list */}
          <div className="space-y-4">
            {modules.map((mod, modIdx) => (
              <div key={modIdx} className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <div className="flex-1 mr-4">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => handleModuleTitleChange(modIdx, e.target.value)}
                      placeholder={`Module ${modIdx + 1} Title`}
                      className="w-full border-b border-transparent focus:border-slate-300 font-extrabold text-slate-800 text-sm py-1 outline-none"
                    />
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveModule(modIdx)}
                    className="p-1.5 border border-red-100 text-red-500 rounded-lg hover:bg-red-50"
                    title="Delete Module"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Lessons list inside module */}
                <div className="space-y-3.5">
                  {mod.lessons.map((les, lesIdx) => (
                    <div key={lesIdx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                      <div className="flex-1 min-w-[200px]">
                        <input
                          type="text"
                          value={les.title}
                          onChange={(e) => handleLessonChange(modIdx, lesIdx, 'title', e.target.value)}
                          placeholder="Lesson title..."
                          className="w-full bg-transparent border-b border-transparent focus:border-slate-300 text-xs font-bold text-slate-700 py-0.5 outline-none"
                        />
                        <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400 font-semibold select-none">
                          <span className="capitalize">Type: {les.type}</span>
                          <span>Duration: {les.duration} min</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Adjust duration */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-400">MINS</span>
                          <input
                            type="number"
                            value={les.duration}
                            onChange={(e) => handleLessonChange(modIdx, lesIdx, 'duration', Number(e.target.value))}
                            className="w-12 border border-slate-200 px-1.5 py-1 text-[10px] font-bold rounded text-center outline-none"
                          />
                        </div>

                        {/* Delete lesson */}
                        <button 
                          onClick={() => handleRemoveLesson(modIdx, lesIdx)}
                          className="p-1.5 text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add lesson options */}
                <div className="flex gap-2 pt-3 border-t border-slate-50 select-none">
                  <button
                    onClick={() => handleAddLesson(modIdx, 'video')}
                    className="flex items-center gap-1 py-1 px-3 border border-slate-200 hover:border-slate-300 text-[10px] font-bold rounded-lg text-slate-600"
                  >
                    <Video size={12} />
                    + Video Lesson
                  </button>
                  <button
                    onClick={() => handleAddLesson(modIdx, 'pdf')}
                    className="flex items-center gap-1 py-1 px-3 border border-slate-200 hover:border-slate-300 text-[10px] font-bold rounded-lg text-slate-600"
                  >
                    <FileText size={12} />
                    + PDF Manual
                  </button>
                  <button
                    onClick={() => handleAddLesson(modIdx, 'quiz')}
                    className="flex items-center gap-1 py-1 px-3 border border-slate-200 hover:border-slate-300 text-[10px] font-bold rounded-lg text-slate-600"
                  >
                    <HelpCircle size={12} />
                    + Quiz Assessment
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Trigger buttons */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-5">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 py-2 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl transition-colors"
            >
              <ChevronLeft size={14} />
              Basic Info
            </button>

            <div className="flex gap-2.5">
              <button
                onClick={handleAddModule}
                className="py-2 px-4 border border-primary hover:bg-primary/5 text-primary font-bold text-xs rounded-xl transition-colors"
              >
                + Add Module
              </button>
              
              <button
                onClick={handlePublish}
                className="flex items-center gap-1.5 py-2.5 px-6 bg-accent hover:bg-accent-dark text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                <Save size={14} />
                Publish Course
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
