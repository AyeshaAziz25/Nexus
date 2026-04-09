import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, PenTool, X } from 'lucide-react';

interface Doc {
  id: number;
  name: string;
  status: 'Draft' | 'In Review' | 'Signed';
  date: string;
}

const DocumentChamber = () => {
  const [docs, setDocs] = useState<Doc[]>([
    { id: 1, name: 'Term_Sheet_v1.pdf', status: 'In Review', date: '2026-04-03' },
    { id: 2, name: 'NDA_Agreement.docx', status: 'Signed', date: '2026-03-25' }
  ]);
  const [signingDocId, setSigningDocId] = useState<number | null>(null);

  const handleSign = () => {
    if (signingDocId) {
      setDocs(docs.map(doc => doc.id === signingDocId ? { ...doc, status: 'Signed' } : doc));
      setSigningDocId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* MOCK UPLOAD */}
      {/* <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50 hover:border-indigo-400 cursor-pointer">
        <Upload className="mx-auto text-slate-400 mb-2" size={24} />
        <span className="text-sm text-slate-600 font-medium">Upload New Contract</span>
      </div> */}
      {/* MOCK UPLOAD - Now adds a dummy doc on click */}
<div 
  onClick={() => {
    const newDoc: Doc = {
      id: Date.now(),
      name: 'New_Contract_Upload.pdf',
      status: 'Draft',
      date: new Date().toISOString().split('T')[0]
    };
    setDocs([newDoc, ...docs]);
  }}
  className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50 hover:border-indigo-400 transition-all cursor-pointer active:scale-95"
>
  <Upload className="mx-auto text-slate-400 mb-2" size={24} />
  <span className="text-sm text-slate-600 font-medium">Upload New Contract (Simulated)</span>
</div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="p-4">Document Name</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="text-indigo-500" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{doc.name}</p>
                      <p className="text-[10px] text-slate-400">{doc.date}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    doc.status === 'Signed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {doc.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {doc.status !== 'Signed' ? (
                    <button onClick={() => setSigningDocId(doc.id)} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1 ml-auto">
                      <PenTool size={14} /> E-Sign
                    </button>
                  ) : (
                    <CheckCircle size={18} className="text-green-500 ml-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SIGNATURE MODAL MOCKUP */}
      {signingDocId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Sign Document</h3>
              <X className="cursor-pointer" onClick={() => setSigningDocId(null)} />
            </div>
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg h-40 flex items-center justify-center mb-4 relative">
               <p className="text-gray-400 italic">Draw your signature here...</p>
               <div className="absolute bottom-2 right-2 text-[10px] text-gray-400">Secure E-Signature Pad</div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSigningDocId(null)} className="flex-1 py-2 text-gray-600 font-medium">Cancel</button>
              <button onClick={handleSign} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium">Apply Signature</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentChamber;