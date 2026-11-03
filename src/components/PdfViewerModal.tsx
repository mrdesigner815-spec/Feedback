import React from 'react';
import { X, FileText, Download, ExternalLink } from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pdfUrl = '/assets/aistudio/__________________f2b5c9aa.pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/60 rounded-lg">
              <FileText className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg">الملف الأصلي المرفق: دليل التغذية الراجعة للطلاب</h3>
              <p className="text-xs text-emerald-100">نماذج متنوعة للتعزيز والتوجيه مضبوطة بالشكل (صفحتان)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              download="دليل_التغذية_الراجعة_للطلاب.pdf"
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-1.5 text-white"
            >
              <Download className="w-3.5 h-3.5" />
              تحميل الملف
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-emerald-700 rounded-lg transition-colors text-white"
              title="فتح في نافذة مستقلة"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-emerald-700 rounded-lg transition-colors text-emerald-100 hover:text-white"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Object / Iframe Viewer */}
        <div className="flex-1 bg-slate-100 p-2 overflow-hidden flex flex-col min-h-[500px]">
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full rounded-lg border border-slate-300"
          >
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-lg">
              <FileText className="w-16 h-16 text-emerald-600 mb-3" />
              <h4 className="text-base font-bold text-slate-800 mb-1">دليل التغذية الراجعة للطلاب (PDF)</h4>
              <p className="text-sm text-slate-600 mb-4 max-w-md">
                يمكنك تحميل أو فتح الملف مباشرة للاطلاع على الصفحتين كاملتين.
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
              >
                فتح المستند مباشرة
              </a>
            </div>
          </object>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>تم تضمين كامل النصوص من الصفحتين مع ضبط التشكيل وصياغة اللهجة السعودية المطابقة.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
