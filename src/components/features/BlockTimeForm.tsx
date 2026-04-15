"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { createBusySlotAction } from '@/lib/actions/busy-slots';

interface BlockTimeFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const BlockTimeForm: React.FC<BlockTimeFormProps> = ({ onSuccess, onClose }) => {
  const { instructorProfile } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '09:00',
    reason: 'Compromisso pessoal'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructorProfile?.id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await createBusySlotAction({
        instructorId: instructorProfile.id,
        date: new Date(formData.date).toISOString(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        reason: formData.reason
      });

      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || 'Erro ao bloquear horário');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
      <h3 className="text-xl font-bold mb-4">Bloquear Horário</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <input 
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
            <input 
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fim</label>
            <input 
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
          <input 
            type="text"
            value={formData.reason}
            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="Ex: Manutenção do veículo"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-600"
          >
            Cancelar
          </button>
        )}
        <button 
          type="submit"
          disabled={loading}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all ${
            loading ? 'bg-gray-300' : 'bg-orange-500 hover:bg-orange-600 shadow-md'
          }`}
        >
          {loading ? 'Bloqueando...' : 'Bloquear Horário'}
        </button>
      </div>
    </form>
  );
};
