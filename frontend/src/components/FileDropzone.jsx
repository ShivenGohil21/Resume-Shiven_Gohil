import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';

const FileDropzone = ({ onFileUpload, isUploading, error }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setDragActive(false);
    
    if (rejectedFiles.length > 0) {
      return;
    }
    
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const onDragEnter = useCallback(() => {
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxFiles: 1,
    disabled: isUploading
  });

  const getDropzoneClass = () => {
    let baseClass = "dropzone";
    if (isDragActive && !isDragReject) baseClass += " active";
    if (isDragReject) baseClass += " reject";
    if (isUploading) baseClass += " opacity-50 cursor-not-allowed";
    return baseClass;
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={getDropzoneClass()}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isUploading ? (
            <div className="animate-spin">
              <Upload className="w-12 h-12 text-primary-500" />
            </div>
          ) : (
            <FileText className="w-12 h-12 text-gray-400" />
          )}
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">
              {isUploading 
                ? 'Processing your PDF...' 
                : isDragActive 
                  ? 'Drop your PDF here!' 
                  : 'Drag & drop your PDF here'
              }
            </p>
            <p className="text-sm text-gray-500">
              {isUploading 
                ? 'Please wait while we extract the data' 
                : 'or click to browse files'
              }
            </p>
            {!isUploading && (
              <p className="text-xs text-gray-400">
                Only PDF files are accepted (max 1 file)
              </p>
            )}
          </div>

          {isDragReject && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Only PDF files are allowed</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;