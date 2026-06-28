import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({ type: '', message: '' });

  const onDrop = useCallback((acceptedFiles) => {
    setStatus({ type: '', message: '' });
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDropRejected: (fileRejections) => {
      setStatus({
        type: 'error',
        message: fileRejections[0].errors[0].message || 'Invalid file type or size (Max 5MB PDF/DOCX)',
      });
    }
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setStatus({ type: '', message: '' });

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      setStatus({ type: 'success', message: res.data.message });
      setFile(null);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || 'Failed to upload resume'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus({ type: '', message: '' });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Upload Resume</h2>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          Upload your latest resume in PDF or DOCX format for analysis.
        </p>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-8">
        {!file ? (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200",
              isDragActive ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10" : "border-surface-300 dark:border-surface-600 hover:border-primary-400 dark:hover:border-primary-500",
              isDragReject && "border-red-500 bg-red-50 dark:bg-red-900/10"
            )}
          >
            <input {...getInputProps()} />
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
              <UploadCloud className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-surface-900 dark:text-white font-medium text-lg">
              {isDragActive ? 'Drop your resume here' : 'Click or drag file to this area'}
            </p>
            <p className="text-surface-500 dark:text-surface-400 mt-2 text-sm">
              Supports PDF and DOCX up to 5MB
            </p>
          </div>
        ) : (
          <div className="border border-surface-200 dark:border-surface-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  <File className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-surface-900 dark:text-white font-medium truncate max-w-xs">{file.name}</p>
                  <p className="text-surface-500 dark:text-surface-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={removeFile}
                  className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {uploading && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-surface-700 dark:text-surface-300 font-medium">Uploading...</span>
                  <span className="text-primary-600 dark:text-primary-400 font-medium">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Processing...' : 'Upload Resume'}
            </button>
          </div>
        )}

        {status.message && (
          <div className={cn(
            "mt-6 p-4 rounded-lg flex items-start gap-3",
            status.type === 'success' ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
          )}>
            {status.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" /> : <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />}
            <p className="text-sm font-medium">{status.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
