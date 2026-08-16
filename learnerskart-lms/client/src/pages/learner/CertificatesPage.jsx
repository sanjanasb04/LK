import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import CertificateCard from '../../components/ui/CertificateCard';
import CertificateModal from '../../components/modals/CertificateModal';
import { Award, ShieldCheck, FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMyCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/certificates/me');
      if (res.data.success) {
        setCertificates(res.data.certificates);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load certificates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCertificates();
  }, []);

  const handleView = (cert) => {
    setSelectedCert(cert);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Verifiable Credentials</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Verifiable completion records. Share directly to your professional LinkedIn profiles.</p>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 bg-success/10 border border-success/20 px-4 py-2 rounded-xl text-success font-bold text-xs select-none">
          <ShieldCheck size={16} />
          <span>{certificates.length} Verifiable Diplomas</span>
        </div>
      </div>

      {/* CERTIFICATES GRID */}
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : certificates.length === 0 ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center bg-white border border-slate-100 rounded-panel text-slate-400 p-8 text-center select-none">
          <Award size={48} className="text-slate-200 mb-3 animate-pulse" />
          <h3 className="font-extrabold text-slate-700 text-sm">No certificates earned yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Complete PMP, Scrum, or Prince2 tracks with passing grades to automatically receive your credentials!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard 
              key={cert._id} 
              certificate={cert} 
              onViewClick={() => handleView(cert)}
            />
          ))}
        </div>
      )}

      {/* Certificate landscape preview modal overlay */}
      {modalOpen && selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => { setModalOpen(false); setSelectedCert(null); }}
        />
      )}

    </div>
  );
}
