import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import AdminFileUpload from '../../components/admin/AdminFileUpload';
import { 
  Tv, Calendar, User, Users, Play, Search, Video, ArrowRight, ExternalLink, 
  FileText, FileSpreadsheet, Award, Download, Eye, BookOpen, Sparkles, 
  CheckCircle2, Printer, X, ShieldAlert, Plus, ShieldCheck, Lock, CheckCircle, Trash2 
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useLocation, useNavigate } from 'react-router-dom';

export default function LiveSessionsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const location = useLocation();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'certificate' || location.state?.activeTab === 'Get Certificate') {
      return 'Get Certificate';
    }
    return 'Live Recorded Sessions';
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'certificate' || location.state?.activeTab === 'Get Certificate') {
      setActiveTab('Get Certificate');
    }
  }, [location]);
  const [loading, setLoading] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  
  // Custom states for interactive modals
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [certificateName, setCertificateName] = useState('');
  const [certificateCourse, setCertificateCourse] = useState('');

  // Admin upload forms modals
  const [showVideoUploadModal, setShowVideoUploadModal] = useState(false);
  const [showMaterialUploadModal, setShowMaterialUploadModal] = useState(false);

  // Form Fields: Video
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDuration, setVideoDuration] = useState('60');
  const [videoCourse, setVideoCourse] = useState('Project Management Professional (PMP)');
  const [videoUrl, setVideoUrl] = useState('https://www.w3schools.com/html/mov_bbb.mp4');

  // Form Fields: Material
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDesc, setMaterialDesc] = useState('');
  const [materialSize, setMaterialSize] = useState('2.4 MB');
  const [materialType, setMaterialType] = useState('PDF Document');
  const [materialTag, setMaterialTag] = useState('PMP Study Resource');
  const [materialUrl, setMaterialUrl] = useState('');

  // Persistent user learning progress tracking
  const [customVideos, setCustomVideos] = useState(() => {
    const saved = localStorage.getItem('lk_custom_videos');
    return saved ? JSON.parse(saved) : [];
  });

  const [customMaterials, setCustomMaterials] = useState(() => {
    const saved = localStorage.getItem('lk_custom_materials');
    return saved ? JSON.parse(saved) : [];
  });

  const [watchedVideos, setWatchedVideos] = useState(() => {
    const saved = localStorage.getItem('lk_watched_videos');
    return saved ? JSON.parse(saved) : [];
  });

  // Track read materials (renamed from downloadedMaterials to align with download-free requirement)
  const [readMaterials, setReadMaterials] = useState(() => {
    const saved = localStorage.getItem('lk_read_materials');
    return saved ? JSON.parse(saved) : [];
  });

  // Track deleted video recordings & study materials
  const [deletedVideoIds, setDeletedVideoIds] = useState(() => {
    const saved = localStorage.getItem('lk_deleted_videos');
    return saved ? JSON.parse(saved) : [];
  });

  const [deletedMaterialIds, setDeletedMaterialIds] = useState(() => {
    const saved = localStorage.getItem('lk_deleted_materials');
    return saved ? JSON.parse(saved) : [];
  });

  const certificateRef = useRef(null);

  // Sync progress tracking to localStorage
  useEffect(() => {
    localStorage.setItem('lk_custom_videos', JSON.stringify(customVideos));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('live_session_updated'));
  }, [customVideos]);

  useEffect(() => {
    localStorage.setItem('lk_custom_materials', JSON.stringify(customMaterials));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('materials_updated'));
  }, [customMaterials]);

  useEffect(() => {
    localStorage.setItem('lk_watched_videos', JSON.stringify(watchedVideos));
  }, [watchedVideos]);

  useEffect(() => {
    localStorage.setItem('lk_read_materials', JSON.stringify(readMaterials));
  }, [readMaterials]);

  useEffect(() => {
    localStorage.setItem('lk_deleted_videos', JSON.stringify(deletedVideoIds));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('live_session_updated'));
  }, [deletedVideoIds]);

  useEffect(() => {
    localStorage.setItem('lk_deleted_materials', JSON.stringify(deletedMaterialIds));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('materials_updated'));
  }, [deletedMaterialIds]);

  // Real-time synchronization listener across tabs/views
  useEffect(() => {
    const handleSync = () => {
      try {
        const savedVideos = localStorage.getItem('lk_custom_videos');
        if (savedVideos) setCustomVideos(JSON.parse(savedVideos));
        const savedMats = localStorage.getItem('lk_custom_materials');
        if (savedMats) setCustomMaterials(JSON.parse(savedMats));
        const savedDelVids = localStorage.getItem('lk_deleted_videos');
        if (savedDelVids) setDeletedVideoIds(JSON.parse(savedDelVids));
        const savedDelMats = localStorage.getItem('lk_deleted_materials');
        if (savedDelMats) setDeletedMaterialIds(JSON.parse(savedDelMats));
      } catch (e) {}
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('live_session_updated', handleSync);
    window.addEventListener('materials_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('live_session_updated', handleSync);
      window.removeEventListener('materials_updated', handleSync);
    };
  }, []);

  const handleDeleteRecording = async (recId, topic) => {
    const name = topic || 'this recording';
    if (!window.confirm(`Are you sure you want to permanently remove "${name}"?`)) return;

    try {
      await api.delete(`/live-sessions/${recId}`);
    } catch (e) {
      console.warn('API delete recording notice:', e.message);
    }

    setCustomVideos(prev => prev.filter(v => v._id !== recId && v.id !== recId));
    setSessions(prev => prev.filter(s => s._id !== recId));
    setDeletedVideoIds(prev => [...prev, recId]);
    toast.success(`Removed "${name}" successfully.`);
  };

  const handleDeleteMaterial = async (matId, matTitle) => {
    const name = matTitle || 'this material';
    if (!window.confirm(`Are you sure you want to permanently remove "${name}"?`)) return;

    setCustomMaterials(prev => prev.filter(m => m.id !== matId && m._id !== matId));
    setDeletedMaterialIds(prev => [...prev, matId]);
    toast.success(`Removed "${name}" successfully.`);
  };

  // Fetch Live Sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const res = await api.get('/live-sessions');
        if (res.data.success) {
          setSessions(res.data.sessions);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load sessions.');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // Fetch Enrollments
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoadingEnrollments(true);
        const res = await api.get('/enrollments/me');
        if (res.data.success) {
          setEnrollments(res.data.enrollments);
        }
      } catch (err) {
        console.error('Failed to load enrollments:', err);
      } finally {
        setLoadingEnrollments(false);
      }
    };
    fetchEnrollments();
  }, []);

  // Default PMP Self-Paced Training Day 01 through Day 04 recordings
  const defaultRecordings = [
    {
      _id: 'rec_pmp_day01',
      topic: 'PMP Self-Paced Training [Day 01]',
      duration: 300,
      startTime: '2026-08-01T09:00:00.000Z',
      recordingUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      course: { title: 'Project Management Professional (PMP)' },
      instructor: { name: 'Super Admin' }
    },
    {
      _id: 'rec_pmp_day02',
      topic: 'PMP Self-Paced Training [Day 02]',
      duration: 300,
      startTime: '2026-08-02T09:00:00.000Z',
      recordingUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      course: { title: 'Project Management Professional (PMP)' },
      instructor: { name: 'Super Admin' }
    },
    {
      _id: 'rec_pmp_day03',
      topic: 'PMP Self-Paced Training [Day 03]',
      duration: 300,
      startTime: '2026-08-03T09:00:00.000Z',
      recordingUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      course: { title: 'Project Management Professional (PMP)' },
      instructor: { name: 'Super Admin' }
    },
    {
      _id: 'rec_pmp_day04',
      topic: 'PMP Self-Paced Training [Day 04]',
      duration: 300,
      startTime: '2026-08-04T09:00:00.000Z',
      recordingUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      course: { title: 'Project Management Professional (PMP)' },
      instructor: { name: 'Super Admin' }
    }
  ];

  const defaultMaterials = [
    {
      id: 'mat_pmp_01',
      title: 'PMP® Exam Quick Reference Formula Sheet 2026',
      description: 'Comprehensive EVM formulas, PERT estimations, and critical path calculation cheatsheet.',
      filename: 'PMP_Formula_Sheet_2026.pdf',
      filepath: '#',
      size: '2.4 MB',
      type: 'PDF Document',
      color: 'from-blue-500 to-indigo-600',
      tag: 'PMP Study Resource'
    }
  ];

  // Resolve consolidated recordings & materials list filtered strictly by user enrollments
  const enrolledTitles = (enrollments || []).map(e => (e.course?.title || e.title || '').toLowerCase()).filter(Boolean);
  const localEnrolled = JSON.parse(localStorage.getItem('lk_enrolled_courses') || '[]');
  if (Array.isArray(localEnrolled)) {
    localEnrolled.forEach(t => enrolledTitles.push(String(t).toLowerCase()));
  }

  const allRecordingsList = [...customVideos, ...sessions, ...defaultRecordings].filter((rec, index, self) => {
    if (!rec || (!rec._id && !rec.id)) return false;
    const id = rec._id || rec.id;
    if (deletedVideoIds.includes(id)) return false;

    const topicLower = (rec.topic || '').toLowerCase().replace(/\s+/g, '');
    
    // Exclude old random demo recordings
    if (topicLower.includes('earnedvalue') || topicLower.includes('standarddeviation') || topicLower.includes('dmaic') || topicLower.includes('masterclassworkshop')) {
      return false;
    }

    // Dedupe by normalized topic string so Day 01 through Day 04 each appear EXACTLY ONCE (4 cards total)
    const firstIdx = self.findIndex(r => (r.topic || '').toLowerCase().replace(/\s+/g, '') === topicLower);
    if (index !== firstIdx) return false;

    // Admin has full access to all recordings
    if (isAdmin) return true;

    // Learners get access ONLY after course enrollment!
    if (enrolledTitles.length === 0) return false;

    const recCourseTitle = (rec.course?.title || '').toLowerCase();
    return enrolledTitles.some(t => 
      recCourseTitle.includes(t) || 
      t.includes(recCourseTitle) || 
      (t.includes('pmp') && recCourseTitle.includes('pmp'))
    );
  });

  const allMaterialsList = [...customMaterials, ...defaultMaterials].filter((mat, index, self) => {
    if (!mat || (!mat.id && !mat._id)) return false;
    const id = mat.id || mat._id;
    if (deletedMaterialIds.includes(id)) return false;

    const firstIdx = self.findIndex(m => (m.id || m._id) === id);
    if (index !== firstIdx) return false;

    if (isAdmin) return true;
    if (enrolledTitles.length === 0) return false;

    const matTag = (mat.tag || '').toLowerCase();
    const matTitle = (mat.title || '').toLowerCase();
    return enrolledTitles.some(t => 
      matTag.includes(t) || 
      matTitle.includes(t) || 
      (t.includes('pmp') && (matTag.includes('pmp') || matTitle.includes('pmp'))) || 
      (t.includes('six sigma') && (matTag.includes('six sigma') || matTitle.includes('six sigma')))
    );
  });

  // Group completed live recordings by course name
  const groupedRecordings = (() => {
    const map = {};
    allRecordingsList.forEach(rec => {
      const key = rec.course?.title || 'General Webinars & Strategies';
      if (!map[key]) map[key] = [];
      if (!map[key].some(item => item._id === rec._id)) {
        map[key].push(rec);
      }
    });
    return map;
  })();

  // Retrieve course assets checklist stats
  const getCourseAssetsChecklist = (courseTitle) => {
    const courseVideos = allRecordingsList.filter(rec => 
      (rec.course?.title || 'General').toLowerCase() === courseTitle.toLowerCase()
    );
    const courseMats = allMaterialsList.filter(mat => {
      const tag = mat.tag.toLowerCase();
      if (courseTitle.includes('PMP') && (tag.includes('pmp') || tag.includes('formula'))) return true;
      if (courseTitle.includes('Six Sigma') && tag.includes('six sigma')) return true;
      if (courseTitle.includes('Agile') && tag.includes('agile')) return true;
      return false;
    });

    const totalVideos = courseVideos.length;
    const totalMats = courseMats.length;
    const watchedCount = courseVideos.filter(v => watchedVideos.includes(v._id)).length;
    const readCount = courseMats.filter(m => readMaterials.includes(m.id)).length;

    return {
      totalVideos,
      totalMats,
      watchedCount,
      readCount
    };
  };

  // Core Progress Calculation formula (STRICTLY progress based)
  const getCourseProgress = (courseTitle) => {
    const { totalVideos, totalMats, watchedCount, readCount } = getCourseAssetsChecklist(courseTitle);
    
    if (totalVideos === 0 && totalMats === 0) return 100; // Auto-unlock if no assets exist

    const videoProgress = totalVideos > 0 ? (watchedCount / totalVideos) * 100 : 100;
    const matProgress = totalMats > 0 ? (readCount / totalMats) * 100 : 100;

    return Math.round((videoProgress + matProgress) / 2);
  };

  // Video Completed Trigger
  const handleWatchVideo = (video) => {
    setSelectedVideo(video);
    if (!watchedVideos.includes(video._id)) {
      setWatchedVideos(prev => [...prev, video._id]);
      toast.success('Marked video recording study hours as completed!');
    }
  };

  // Materials Read Trigger
  const handleReadMaterial = (mat) => {
    setSelectedMaterial(mat);
    if (!readMaterials.includes(mat.id)) {
      setReadMaterials(prev => [...prev, mat.id]);
      toast.success(`Opened material: "${mat.title}" marked as read!`);
    }
  };

  // Admin upload actions
  const handleAddVideoSubmit = (e) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      toast.error('Please enter a video topic.');
      return;
    }

    const newVideo = {
      _id: `cust_rec_${Date.now()}`,
      topic: videoTitle,
      duration: parseInt(videoDuration) || 60,
      startTime: new Date().toISOString(),
      recordingUrl: videoUrl,
      course: { title: videoCourse },
      instructor: { name: user?.name || 'Administrator' }
    };

    setCustomVideos(prev => [newVideo, ...prev]);
    toast.success('Recorded webinar uploaded and cataloged successfully!');
    
    // Clear & close
    setVideoTitle('');
    setShowVideoUploadModal(false);
  };

  const handleAddMaterialSubmit = (e) => {
    e.preventDefault();
    if (!materialTitle.trim() || !materialDesc.trim()) {
      toast.error('Please complete all material fields.');
      return;
    }

    const newMaterial = {
      id: `cust_mat_${Date.now()}`,
      title: materialTitle,
      description: materialDesc,
      filename: materialTitle.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf',
      filepath: materialUrl || '#',
      size: materialSize,
      type: materialType,
      color: materialType.includes('Excel') 
        ? 'from-emerald-500 to-teal-600' 
        : materialType.includes('PowerPoint') 
          ? 'from-orange-500 to-amber-600' 
          : 'from-blue-500 to-indigo-600',
      tag: materialTag,
      content: `Study Notes for: ${materialTitle}.\n\nCurriculum content detailing ${materialDesc}. Keep this material referenced during mock assessments.`
    };

    setCustomMaterials(prev => [newMat, ...prev]);
    toast.success('Study material resource added successfully!');

    // Clear & close
    setMaterialTitle('');
    setMaterialDesc('');
    setShowMaterialUploadModal(false);
  };

  const tabs = ['Live Recorded Sessions', 'Course Materials', 'Get Certificate'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            {isAdmin ? 'LMS Instructor Management Console' : 'Resources & Live Sessions Hub'}
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {isAdmin 
              ? 'Upload video recordings, add curriculum documents, and verify course access keys'
              : 'Review live class recordings, access study worksheets, and retrieve your credentials'}
          </p>
        </div>

        {/* Admin floating controls */}
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowVideoUploadModal(true)}
              className="inline-flex items-center gap-1.5 py-2 px-4 bg-primary text-white hover:bg-primary-dark text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              Upload Webinar
            </button>
            <button
              onClick={() => setShowMaterialUploadModal(true)}
              className="inline-flex items-center gap-1.5 py-2 px-4 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              Add Material
            </button>
          </div>
        )}
      </div>

      {/* TABS SELECTOR */}
      <div className="flex bg-white border border-slate-100 p-2 rounded-xl shadow-sm select-none justify-start w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-1.5 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-primary text-white shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Non-enrolled Learner Access Lock Banner */}
      {!isAdmin && enrollments.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100 shadow-sm">
            <Lock size={30} />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-black text-slate-800 text-base">Course Enrollment Required</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Please enroll in a course to access live video recordings, study worksheets, and materials.
            </p>
          </div>
          <button
            onClick={() => navigate('/lms/my-courses')}
            className="py-3 px-6 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-2 active:scale-95"
          >
            <BookOpen size={16} />
            Enroll in a Course
          </button>
        </div>
      ) : (
        <>
          {/* Tab 1: Live Recorded Sessions (Watch online only, no download) */}
          {activeTab === 'Live Recorded Sessions' && (
            <div className="space-y-8 text-left">
              {Object.keys(groupedRecordings).length === 0 ? (
                <div className="p-10 bg-white border border-slate-200/80 rounded-2xl text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100 shadow-sm">
                    <Lock size={30} />
                  </div>
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h3 className="font-black text-slate-800 text-base uppercase tracking-wide">Enroll to Get Videos</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Please enroll in a course to access live video recordings, webinars, and masterclass replays.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/lms/my-courses')}
                    className="py-3 px-6 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-2 active:scale-95 uppercase tracking-wider"
                  >
                    <BookOpen size={16} />
                    Enroll in Course Now
                  </button>
                </div>
              ) : (
            Object.entries(groupedRecordings).map(([courseName, list]) => (
              <div key={courseName} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  <h2 className="text-base font-black text-slate-700">{courseName}</h2>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {list.length} Videos
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list.map((rec) => {
                    const isWatched = watchedVideos.includes(rec._id);
                    return (
                      <div 
                        key={rec._id} 
                        className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div 
                          onClick={() => handleWatchVideo(rec)}
                          className="relative h-40 bg-slate-900 flex items-center justify-center cursor-pointer group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-slate-950 opacity-90" />
                          
                          {/* Play overlay button */}
                          <div className="absolute w-12 h-12 rounded-full bg-white/20 group-hover:bg-white/30 group-hover:scale-105 transition-all backdrop-blur-sm flex items-center justify-center text-white border border-white/25">
                            <Play size={20} fill="currentColor" className="ml-0.5" />
                          </div>

                          <span className="absolute bottom-3 right-3 text-[10px] font-bold text-white bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-sm">
                            ⏱️ {rec.duration} mins
                          </span>

                          {/* Completion watch indicator badge */}
                          {isWatched && (
                            <span className="absolute top-3 left-3 text-[9px] font-black text-emerald-600 bg-emerald-55 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm bg-white/95">
                              <CheckCircle2 size={10} className="fill-emerald-600 text-white" />
                              WATCHED
                            </span>
                          )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug">{rec.topic}</h4>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-[10px] font-bold text-slate-400">
                                📅 {new Date(rec.startTime).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-3">
                            <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[120px]">
                              Host: {rec.instructor?.name || 'Authorized Instructor'}
                            </span>
                            <div className="flex items-center gap-2">
                              {isAdmin && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRecording(rec._id, rec.topic);
                                  }}
                                  className="p-1.5 px-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1 font-extrabold text-[10px]"
                                  title="Remove Recording"
                                >
                                  <Trash2 size={12} />
                                  Remove
                                </button>
                              )}
                              <button
                                onClick={() => handleWatchVideo(rec)}
                                className="text-[10px] font-extrabold text-primary flex items-center gap-0.5 hover:underline cursor-pointer"
                              >
                                Watch Recording
                                <ArrowRight size={10} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Course Materials (Open/Read online only, no download) */}
      {activeTab === 'Course Materials' && (
        <div>
          {allMaterialsList.length === 0 ? (
            <div className="p-12 bg-white border border-slate-100 rounded-2xl text-center space-y-3">
              <FileText size={42} className="mx-auto text-slate-200" />
              <div>
                <h3 className="font-extrabold text-slate-700 text-sm">No Course Materials Available</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Study materials and worksheets will appear here once added by the Admin.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {allMaterialsList.map((mat) => {
                const isExcel = mat.type.includes('Excel');
                const isRead = readMaterials.includes(mat.id);
                return (
                  <div 
                    key={mat.id} 
                    className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex gap-4 items-start relative overflow-hidden"
                  >
                    <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${mat.color} flex items-center justify-center text-white`}>
                      {isExcel ? <FileSpreadsheet size={24} /> : <FileText size={24} />}
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">
                          {mat.tag}
                        </span>
                        <span className="text-[9px] font-extrabold text-slate-400">
                          {mat.size}
                        </span>
                        {isRead && (
                          <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <CheckCircle2 size={8} />
                            READ
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{mat.title}</h3>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{mat.description}</p>

                      <div className="pt-2 flex items-center justify-between">
                        <button 
                          onClick={() => handleReadMaterial(mat)}
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={12} />
                          Read Study Guide
                        </button>

                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMaterial(mat.id, mat.title);
                            }}
                            className="p-1.5 px-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1 font-extrabold text-[10px]"
                            title="Remove Material"
                          >
                            <Trash2 size={12} />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Get Certificate (Strict progress verification) */}
      {activeTab === 'Get Certificate' && (
        <div className="space-y-4 text-left">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-2.5">
            <Award size={18} className="text-primary mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-primary">Dynamic Progress Lock Active</h4>
              <p className="text-[10px] text-primary/80 font-semibold leading-relaxed mt-0.5">
                Certificates are unlocked strictly based on your actual study progress. Complete all video recording lectures and read all assigned course documents to achieve 100% completion.
              </p>
            </div>
          </div>

          {loadingEnrollments ? (
            <div className="p-10 text-center text-slate-400">Loading your certificates...</div>
          ) : enrollments.length === 0 ? (
            <div className="p-10 bg-white border border-slate-100 rounded-panel text-center text-slate-400">
              <Award size={48} className="mx-auto text-slate-200 mb-3" />
              <h3 className="font-extrabold text-slate-700 text-sm">No Active Course Enrollments Found</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Enroll in course modules to unlock your credentials</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enroll) => {
                const courseId = enroll.course?._id || enroll.course?.id;
                const progressPercent = getCourseProgress(enroll.course?.title);
                const isCompleted = progressPercent === 100;

                const { totalVideos, totalMats, watchedCount, readCount } = getCourseAssetsChecklist(enroll.course?.title);

                return (
                  <div 
                    key={enroll._id} 
                    className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-slate-400">
                          Enrolled: {new Date(enroll.enrolledAt).toLocaleDateString()}
                        </span>
                        
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          isCompleted 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}>
                          {isCompleted ? '✓ Completed' : 'In Progress'}
                        </span>
                      </div>

                      <h3 className="font-black text-slate-800 text-sm mt-3 leading-snug">{enroll.course?.title}</h3>
                      
                      {/* Detailed Checklist statistics */}
                      <div className="mt-3 space-y-1 bg-slate-50 border border-slate-100 p-3 rounded-xl select-none">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                          <span className="flex items-center gap-1.5">
                            🎥 Video Lectures:
                          </span>
                          <span className={watchedCount === totalVideos ? 'text-emerald-600' : 'text-slate-600'}>
                            {watchedCount} / {totalVideos} Watched
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                          <span className="flex items-center gap-1.5">
                            📄 Study Guides:
                          </span>
                          <span className={readCount === totalMats ? 'text-emerald-600' : 'text-slate-600'}>
                            {readCount} / {totalMats} Read
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1 mt-4">
                        <div className="flex justify-between text-[9px] font-black text-slate-400">
                          <span>TOTAL SYLLABUS COMPLETED</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-primary'}`} 
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-t border-slate-50 pt-4 mt-5">
                      {isCompleted ? (
                        <button
                          onClick={() => {
                            setCertificateName(user?.name || '');
                            setCertificateCourse(enroll.course?.title);
                            setSelectedCertificate({
                              userName: user?.name || 'Sanjana S B',
                              courseTitle: enroll.course?.title,
                              completionDate: new Date(enroll.enrolledAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                              certificateId: `LK-CERT-${courseId.substring(0, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
                            });
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer animate-pulse"
                        >
                          <Award size={14} />
                          Claim Certificate
                        </button>
                      ) : (
                        <div className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 text-slate-400 text-xs font-black rounded-xl select-none border border-slate-200/50">
                          <Lock size={12} className="text-slate-400" />
                          Locked (Complete checklist above)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      </>
      )}

      {/* VIDEO PREVIEW MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative text-left">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-black/40 hover:bg-black/60 p-2 rounded-full cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>

            <div className="relative aspect-video bg-black rounded-t-xl overflow-hidden select-none">
              <video 
                src={selectedVideo.recordingUrl} 
                controls 
                autoPlay
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full"
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded text-[9px] font-extrabold text-emerald-400 border border-emerald-500/20 pointer-events-none">
                🔒 Protected Webinar Stream (Download Disabled)
              </div>
            </div>

            <div className="p-5 bg-slate-900 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-primary tracking-widest block uppercase">
                Recorded Webinar Player
              </span>
              <h3 className="text-white text-base font-black leading-snug">{selectedVideo.topic}</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Course Track: {selectedVideo.course?.title || 'Certification Webinar'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STUDY MATERIAL PREVIEW MODAL (Online only, no download) */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative text-left flex flex-col max-h-[85vh]">
            <div className="p-5 bg-slate-55 border-b border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black text-primary uppercase tracking-wide bg-primary/10 px-2.5 py-0.5 rounded-full">
                  {selectedMaterial.tag}
                </span>
                <h3 className="text-slate-800 text-sm font-black mt-1.5">{selectedMaterial.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-full cursor-pointer hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-slate-600 text-xs leading-relaxed font-sans bg-slate-50/50">
              <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-sm space-y-3 font-serif">
                <p className="whitespace-pre-line text-slate-800 text-xs leading-loose">
                  {selectedMaterial.content}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="py-1.5 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-black rounded-xl cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM CERTIFICATE CLAIM & VIEW MODAL */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:absolute print:inset-0">
          <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl p-6 relative flex flex-col gap-6 text-left print:p-0 print:shadow-none print:w-full print:max-w-none print:rounded-none">
            
            {/* Modal Controls (Hidden during print) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 print:hidden">
              <div className="space-y-1">
                <h3 className="font-black text-slate-800 text-sm">Configure & Retrieve Certificate</h3>
                <p className="text-[10px] text-slate-400 font-semibold">LK Credentials ID: {selectedCertificate.certificateId}</p>
              </div>

              {/* Real-time Name Customizer */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="w-full sm:w-60">
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                    placeholder="Enter Certificate Name"
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-primary font-bold text-slate-800"
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto pt-4 sm:pt-0">
                  <button
                    onClick={handlePrintCertificate}
                    disabled={!certificateName.trim()}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-primary text-white hover:bg-primary-dark text-xs font-black rounded-xl transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Printer size={14} />
                    Print Credentials
                  </button>
                  <button 
                    onClick={() => setSelectedCertificate(null)}
                    className="text-slate-400 hover:text-slate-700 p-2.5 rounded-full cursor-pointer hover:bg-slate-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* PRINT CERTIFICATE AREA */}
            <div 
              ref={certificateRef}
              id="print-area-wrapper" 
              className="border-[14px] border-slate-800 p-8 rounded-xl bg-slate-50 relative flex flex-col justify-between items-center min-h-[520px] text-center select-none print:border-[16px] print:m-0 print:p-10 print:h-screen print:w-screen"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {/* Double interior gold border */}
              <div className="absolute inset-2 border border-amber-600/35 pointer-events-none" />
              <div className="absolute inset-3 border border-amber-600/35 pointer-events-none" />

              {/* Seal Badge background watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
                <Award size={350} />
              </div>

              {/* Certificate Head */}
              <div className="space-y-3 pt-4">
                <span className="text-[10px] font-sans tracking-[0.3em] font-extrabold text-amber-700 uppercase">
                  LEARNERSKART EDUCATION
                </span>
                <h2 className="text-3xl font-bold tracking-wide text-slate-800">
                  CERTIFICATE OF COMPLETION
                </h2>
                <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-2" />
              </div>

              {/* Certificate Body */}
              <div className="space-y-4 my-6">
                <p className="text-xs italic text-slate-500 font-sans">
                  This credentials sheet hereby certifies that
                </p>
                <h1 className="text-4xl font-extrabold text-slate-900 py-1" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                  {certificateName || selectedCertificate.userName}
                </h1>
                <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed font-sans">
                  has completed the classroom instruction hours, simulated examinations, and evaluation modules required to attain professional authorization as a practitioner of
                </p>
                <h3 className="text-xl font-bold text-amber-800 uppercase tracking-wide">
                  {certificateCourse || selectedCertificate.courseTitle}
                </h3>
              </div>

              {/* Certificate Footer */}
              <div className="w-full flex justify-between items-end border-t border-slate-200/60 pt-6 mt-4 px-6 font-sans">
                {/* Left Side: Verification */}
                <div className="text-left space-y-1 text-slate-400 shrink-0">
                  <p className="text-[8px] font-bold uppercase tracking-wider">Credentials Verification Key</p>
                  <p className="text-[9px] font-mono font-bold text-slate-600">{selectedCertificate.certificateId}</p>
                  <p className="text-[8px] text-slate-400">Date: {selectedCertificate.completionDate}</p>
                </div>

                {/* Center: Gold Stamp Seal */}
                <div className="flex flex-col items-center select-none opacity-90 shrink-0">
                  <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-600 flex items-center justify-center text-amber-700 shadow-inner relative">
                    <Award size={26} />
                  </div>
                  <span className="text-[8px] font-black uppercase text-amber-700 mt-1 tracking-wider">AUTHORIZED PROVIDER</span>
                </div>

                {/* Right Side: Signatures */}
                <div className="text-right space-y-3 shrink-0">
                  <div className="space-y-1">
                    <p className="text-[12px] font-serif italic text-slate-700 tracking-wide font-black">Rahul Krishnamurthy</p>
                    <div className="w-32 h-[1px] bg-slate-300 ml-auto" />
                    <p className="text-[8px] font-bold uppercase text-slate-500 tracking-wide">Platform Director</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN WEB-RECORDING UPLOAD MODAL */}
      {showVideoUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-left">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary" size={20} />
                <h3 className="font-black text-slate-800 text-sm">Upload Class Webinar Recording</h3>
              </div>
              <button 
                onClick={() => setShowVideoUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddVideoSubmit} className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Webinar Topic / Title</label>
                <input
                  type="text"
                  required
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g. Mastering Agile Sprint Backlogs"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary font-bold text-slate-800 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    required
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    placeholder="60"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary font-bold text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Course Assignment</label>
                  <select
                    value={videoCourse}
                    onChange={(e) => setVideoCourse(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary font-bold text-slate-800 bg-white"
                  >
                    <option value="Project Management Professional (PMP)">PMP</option>
                    <option value="Lean Six Sigma Green Belt (LSSGB)">LSSGB</option>
                    <option value="Agile & Scrum Practitioner">Agile & Scrum</option>
                  </select>
                </div>
              </div>

              <div>
                <AdminFileUpload
                  label="Recorded Video Source"
                  currentUrl={videoUrl}
                  accept="video/*"
                  onUploadSuccess={(url) => setVideoUrl(url)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-xl transition-colors cursor-pointer shadow-sm text-center"
              >
                Catalog recorded session
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN STUDY-MATERIAL ADD MODAL */}
      {showMaterialUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-left">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={20} />
                <h3 className="font-black text-slate-800 text-sm">Add Curriculum Study Material</h3>
              </div>
              <button 
                onClick={() => setShowMaterialUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  placeholder="e.g. Six Sigma DMAIC Cheat Sheet"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary font-bold text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Resource Description</label>
                <textarea
                  required
                  value={materialDesc}
                  onChange={(e) => setMaterialDesc(e.target.value)}
                  placeholder="Provide a detailed brief of the workbook/cheat sheet..."
                  rows={2}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary font-semibold text-slate-800 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Size (e.g. 1.2 MB)</label>
                  <input
                    type="text"
                    required
                    value={materialSize}
                    onChange={(e) => setMaterialSize(e.target.value)}
                    placeholder="1.2 MB"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary font-bold text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">File Type</label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary font-bold text-slate-800 bg-white"
                  >
                    <option value="PDF Document">PDF</option>
                    <option value="Excel Sheet">Excel</option>
                    <option value="PowerPoint Deck">Slides</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Course Tag</label>
                  <select
                    value={materialTag}
                    onChange={(e) => setMaterialTag(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:border-primary font-bold text-slate-800 bg-white"
                  >
                    <option value="PMP Study Resource">PMP Resource</option>
                    <option value="Six Sigma Calculator">Six Sigma Calc</option>
                    <option value="Agile Slide Deck">Agile Slides</option>
                    <option value="Formula Cheat Sheet">Cheat Sheet</option>
                  </select>
                </div>
              </div>

              <div>
                <AdminFileUpload
                  label="Study Material File"
                  currentUrl={materialUrl}
                  accept="*/*"
                  onUploadSuccess={(url) => setMaterialUrl(url)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-colors cursor-pointer shadow-sm text-center"
              >
                Register study material
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
