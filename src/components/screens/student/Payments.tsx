"use client";

import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Plus, Clock, Trash2, Edit2, X, Check } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui-custom';

interface CardData {
  id: string;
  number: string;
  holder: string;
  expiry: string;
  type: string;
}

export const StudentPayments = ({ 
  onBack 
}: { 
  onBack: () => void 
}) => {
  const [cards, setCards] = useState<CardData[]>([
    { id: '1', number: '•••• •••• •••• 4582', holder: 'GABRIEL SILVA', expiry: '12/28', type: 'Crédito' }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ number: '', holder: '', expiry: '', cvv: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCards(cards.map(c => c.id === editingId ? { ...c, holder: formData.holder, expiry: formData.expiry, number: `•••• •••• •••• ${formData.number.slice(-4)}` } : c));
    } else {
      const newCard: CardData = {
        id: Date.now().toString(),
        number: `•••• •••• •••• ${formData.number.slice(-4)}`,
        holder: formData.holder,
        expiry: formData.expiry,
        type: 'Crédito'
      };
      setCards([...cards, newCard]);
    }
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ number: '', holder: '', expiry: '', cvv: '' });
  };

  const startEdit = (card: CardData) => {
    setEditingId(card.id);
    setIsAdding(true);
    setFormData({ number: card.number, holder: card.holder, expiry: card.expiry, cvv: '***' });
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  return (
    <div className="pb-24 pt-6 px-4 space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pagamentos</h1>
          <p className="text-slate-500 text-sm">Gerencie seus métodos de pagamento</p>
        </div>
      </header>

      {isAdding ? (
        <Card className="p-6 border-slate-200 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-900">{editingId ? 'Editar Cartão' : 'Novo Cartão'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Número do Cartão</label>
              <Input 
                placeholder="0000 0000 0000 0000"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Nome no Cartão</label>
              <Input 
                placeholder="Ex: GABRIEL SILVA"
                value={formData.holder}
                onChange={(e) => setFormData({ ...formData, holder: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Validade</label>
                <Input 
                  placeholder="MM/AA"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">CVV</label>
                <Input 
                  placeholder="000"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {editingId ? 'Salvar Alterações' : 'Adicionar Cartão'}
            </Button>
          </form>
        </Card>
      ) : (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900">Meus Cartões</h3>
            <button 
              onClick={() => setIsAdding(true)}
              className="text-velo-blue font-bold text-sm flex items-center gap-1"
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>
          
          <div className="space-y-4">
            {cards.map((card) => (
              <div key={card.id} className="relative group">
                <Card className="bg-slate-900 text-white border-none p-6 relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="flex justify-between items-start mb-12">
                    <CreditCard size={32} />
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(card)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteCard(card.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors text-red-200">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xl font-medium tracking-widest mb-4">{card.number}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Titular</p>
                      <p className="text-sm font-bold">{card.holder}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Validade</p>
                      <p className="text-sm font-bold">{card.expiry}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
            
            {cards.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm">Nenhum cartão cadastrado.</p>
              </div>
            )}
          </div>
        </section>
      )}

      <section>
        <h3 className="font-bold text-slate-900 mb-4">Atividade Recente</h3>
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Aula com Carlos Silva</p>
                <p className="text-xs text-slate-500">12 Abr, 14:00</p>
              </div>
            </div>
            <p className="font-bold text-slate-900">R$ 60,00</p>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Aula com Carlos Silva</p>
                <p className="text-xs text-slate-500">09 Abr, 10:00</p>
              </div>
            </div>
            <p className="font-bold text-slate-900">R$ 60,00</p>
          </div>
        </div>
      </section>
    </div>
  );
};
