"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { uploadLadvAction } from '@/lib/actions/students';

interface LadvUploadProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const LadvUpload: React.FC<LadvUploadProps> = ({ onSuccess, onClose }) => {
  const { studentProfile, setStudentProfile, setHasLadv } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !studentProfile?.id) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadLadvAction(studentProfile.id, formData);
      if (res.success) {
        setHasLadv(true);
        if (studentProfile) {
          setStudentProfile({
            ...studentProfile,
            ladvUploaded: true,
            ladvDocumentUrl: res.data?.ladv_document_url
          });
        }
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || 'Erro ao enviar LADV');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
      <h3 className="text-xl font-bold mb-4">Upload de LADV</h3>
      <p className="text-gray-600 mb-6 text-sm">
        Para agendar aulas prontas, você precisa enviar sua LADV (Licença de Aprendizagem de Direção Veicular).
      </p>

      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center mb-6 hover:border-blue-500 transition-colors cursor-pointer relative">
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          accept=".pdf,image/*"
          onChange={handleFileChange}
        />
        {file ? (
          <div className="text-center">
            <span className="text-blue-600 font-medium block mb-1">{file.name}</span>
            <span className="text-gray-400 text-xs">{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-gray-500 font-medium">Selecionar arquivo</span>
            <span className="text-gray-400 text-xs mt-1">PDF ou Imagem</span>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {onClose && (
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button 
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all ${
            !file || isUploading ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700 shadow-md active:scale-95'
          }`}
        >
          {isUploading ? 'Enviando...' : 'Enviar LADV'}
        </button>
      </div>
    </div>
  );
};
