"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { addPaymentMethodAction } from '@/lib/actions/payment-methods';
import { maskCardNumber, maskCVV } from '@/lib/utils/masks';

interface AddCardFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const asaasErrorMap: Record<string, string> = {
  invalid_credit_card: 'Cartão inválido. Verifique o número.',
  expired_credit_card: 'Cartão vencido.',
  insufficient_funds: 'Cartão recusado por saldo insuficiente.',
  invalid_cvv: 'CVV inválido.',
};

export const AddCardForm: React.FC<AddCardFormProps> = ({ onSuccess, onClose }) => {
  const { studentProfile } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'expiryDate') {
      const cleanValue = value.replace(/\D/g, '').substring(0, 4);
      if (cleanValue.length >= 3) {
        setFormData(prev => ({ ...prev, [name]: `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}` }));
      } else {
        setFormData(prev => ({ ...prev, [name]: cleanValue }));
      }
    } else if (name === 'cardNumber') {
      setFormData(prev => ({ ...prev, [name]: maskCardNumber(value) }));
    } else if (name === 'cvv') {
      setFormData(prev => ({ ...prev, [name]: maskCVV(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentProfile?.id) return;

    setLoading(true);
    setError(null);

    const parts = formData.expiryDate.split('/');
    if (parts.length !== 2) {
      setError('Formato de validade inválido (MM/AA)');
      setLoading(false);
      return;
    }

    const month = parts[0].padStart(2, '0');
    const year = parts[1];

    try {
      const res = await addPaymentMethodAction({
        studentId: studentProfile.id,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        cardholderName: formData.cardholderName,
        expiryMonth: month,
        expiryYear: '20' + year,
        cvv: formData.cvv,
        isDefault: true
      });

      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        const mappedError =
          asaasErrorMap[res.error ?? ''] ??
          (res.error || 'Cartão não autorizado. Tente outro.');
        setError(mappedError);
      }
    } catch {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
      <h3 className="text-xl font-bold mb-4">Adicionar Cartão</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome no Cartão</label>
          <input
            name="cardholderName"
            value={formData.cardholderName}
            onChange={handleChange}
            placeholder="COMO ESTÁ NO CARTÃO"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
          <input
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="0000 0000 0000 0000"
            inputMode="numeric"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Validade (MM/AA)</label>
            <input
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/AA"
              inputMode="numeric"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <input
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              inputMode="numeric"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
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
            loading ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700 shadow-md'
          }`}
        >
          {loading ? 'Salvando...' : 'Adicionar Cartão'}
        </button>
      </div>
    </form>
  );
};
