import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { FileText, Search, Download, Trash2, Edit3, Save, X, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Edit states
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notes');
      if (res.data.success) {
        setNotes(res.data.notes);
        setFilteredNotes(res.data.notes);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load study notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Filter notes by search input
  useEffect(() => {
    if (!search.trim()) {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(
        notes.filter(note => 
          note.content.toLowerCase().includes(search.toLowerCase()) || 
          note.lesson?.title?.toLowerCase().includes(search.toLowerCase()) ||
          note.course?.title?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, notes]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      const res = await api.delete(`/notes/${id}`);
      if (res.data.success) {
        toast.success('Note deleted successfully.');
        setNotes(prev => prev.filter(n => n._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete note.');
    }
  };

  const handleEditStart = (note) => {
    setEditingNoteId(note._id);
    setEditContent(note.content);
  };

  const handleSaveEdit = async (id) => {
    if (!editContent.trim()) return;
    try {
      const res = await api.put(`/notes/${id}`, { content: editContent });
      if (res.data.success) {
        toast.success('Note updated!');
        setNotes(prev => 
          prev.map(n => n._id === id ? { ...n, content: editContent } : n)
        );
        setEditingNoteId(null);
      }
    } catch (err) {
      toast.error('Failed to update note.');
    }
  };

  const handleExport = () => {
    // Direct link trigger for notes CSV generation
    window.open('/api/notes/export', '_blank');
    toast.success('Study notes exported successfully!');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Study Notes</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Review lecture highlights and revision cards logged during lessons</p>
        </div>

        {notes.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 py-2 px-4 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-colors shadow-sm select-none"
          >
            <Download size={14} />
            Export Notes (CSV)
          </button>
        )}
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl shadow-sm w-full select-none">
        <Search size={14} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search note contents, course title, or lesson name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-xs text-slate-700 w-full placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* NOTES LIST GRID */}
      {loading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="min-h-[250px] flex flex-col items-center justify-center bg-white border border-slate-100 rounded-panel text-slate-400 p-8 select-none">
          <FileText size={42} className="text-slate-200 mb-2 animate-pulse" />
          <h3 className="font-extrabold text-slate-700 text-sm">No notes found</h3>
          <p className="text-xs text-slate-400 mt-1">Open the course player to jot down notes while learning!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => {
            const isEditing = editingNoteId === note._id;

            return (
              <div key={note._id} className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
                <div className="text-left">
                  {/* Note reference details */}
                  <div className="flex justify-between items-start select-none border-b border-slate-50 pb-2.5 mb-3">
                    <div className="min-w-0 pr-3">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block truncate">
                        {note.course?.title || 'Course'}
                      </span>
                      <h4 className="font-bold text-slate-700 text-xs truncate leading-snug mt-0.5">
                        {note.lesson?.title || 'Lesson'}
                      </h4>
                    </div>

                    <span className="shrink-0 px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold rounded-lg uppercase">
                      ⏱️ {Math.floor(note.noteTime / 60)}:{String(note.noteTime % 60).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Body area (editing or static) */}
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100/50 font-medium whitespace-pre-line">
                      {note.content}
                    </p>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center border-t border-slate-50 pt-4 mt-4 select-none">
                  <span className="text-[9px] font-semibold text-slate-400">
                    Saved {new Date(note.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(note._id)}
                          className="flex items-center gap-1 py-1.5 px-3 bg-success hover:bg-success-dark text-white font-bold text-[10px] rounded-lg transition-colors shadow-sm"
                        >
                          <Save size={12} />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="flex items-center gap-1 py-1.5 px-3 border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-[10px] rounded-lg transition-colors"
                        >
                          <X size={12} />
                          Discard
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(note)}
                          className="flex items-center gap-1.5 py-1.5 px-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-[10px] rounded-lg transition-colors"
                        >
                          <Edit3 size={11} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="flex items-center gap-1.5 py-1.5 px-3 border border-red-100 text-red-500 hover:bg-red-50 font-bold text-[10px] rounded-lg transition-colors"
                        >
                          <Trash2 size={11} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
