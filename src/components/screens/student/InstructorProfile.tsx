"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  MapPin,
  Car,
  Star,
  CheckCircle2,
  Upload,
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { format, isBefore, startOfDay, isSameDay, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { parseBRDate } from "@/lib/utils/dates";
import { Button, CalendarWidget } from "@/components/ui-custom";
import { Instructor } from "@/types";

export const InstructorProfileView = ({
  instructor,
  onBack,
  hasLadv,
  hasPaymentMethod,
  onUploadLadv,
  onAddPaymentMethod,
  onBookClass,
  busySlots,
}: {
  instructor: Instructor;
  onBack: () => void;
  hasLadv: boolean;
  hasPaymentMethod: boolean;
  onUploadLadv: () => void;
  onAddPaymentMethod: () => void;
  onBookClass: (
    date: Date,
    startTime: string,
    endTime: string,
    instructor: Instructor,
  ) => Promise<{ success: boolean; error?: string }> | void;
  busySlots?: Record<string, string[]>;
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLadvAlert, setShowLadvAlert] = useState(false);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const handleAddToCalendar = () => {
    if (!selectedTime) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startDate = new Date(selectedDate);
    startDate.setHours(hours, minutes);
    const endDate = new Date(startDate);
    endDate.setHours(hours + 1, minutes);

    const title = `Aula de Direção com ${instructor.name}`;
    const details = `Aula prática de direção veicular. Veículo: ${instructor.vehicleModel}`;
    const location = instructor.location || "Autoescola Velo";

    const formatGCalDate = (date: Date) =>
      date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

    window.open(googleUrl, "_blank");
  };

  const getAvailableTimes = (date: Date) => {
    if (!instructor) {
      return [];
    }

    const dateKey = format(date, "yyyy-MM-dd");
    const globalBusyTimes = busySlots?.[dateKey] || [];

    const dayOfWeek = date.getDay();
    const defaultAvailability = {
      isEnabled: dayOfWeek !== 0, // Closed on Sunday
      startTime: dayOfWeek === 6 ? "08:00" : "08:00",
      endTime: dayOfWeek === 6 ? "12:00" : "18:00",
    };

    const dayConfig =
      instructor?.availability?.find((d) => d.dayOfWeek === dayOfWeek) ||
      (instructor?.availability
        ? { isEnabled: false, startTime: "", endTime: "", dayOfWeek }
        : defaultAvailability);

    if (!dayConfig?.isEnabled) {
      return [];
    }

    let slots = [];
    let startHour = parseInt(dayConfig.startTime?.split(":")[0] || "8");
    const endHour = parseInt(dayConfig.endTime?.split(":")[0] || "18");

    for (let h = startHour; h < endHour; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
    }

    const now = new Date();
    if (isBefore(date, startOfDay(now))) {
      return [];
    }

    if (isSameDay(date, now)) {
      const currentHour = now.getHours();
      slots = slots.filter((time) => {
        const slotHour = parseInt(time.split(":")[0]);
        return slotHour > currentHour;
      });
    }

    const instructorBusySlots =
      instructor?.busySlots?.filter((slot) =>
        isSameDay(parseBRDate(slot.date) ?? new Date(), date),
      ) || [];

    const busyTimesFromSlots = instructorBusySlots.flatMap((slot) => {
      const start = parseInt(slot.startTime.split(":")[0]);
      const end = parseInt(slot.endTime.split(":")[0]);
      const times = [];
      for (let h = start; h < end; h++) {
        times.push(`${h.toString().padStart(2, "0")}:00`);
      }
      return times;
    });

    const allBusyTimes = [...busyTimesFromSlots, ...globalBusyTimes];

    return slots.filter((time) => !allBusyTimes.includes(time));
  };

  const availableTimes = getAvailableTimes(selectedDate);

  const handleBookClick = () => {
    if (!hasLadv) {
      setShowLadvAlert(true);
      return;
    }

    if (!hasPaymentMethod) {
      setShowPaymentAlert(true);
      return;
    }

    if (!instructor.cnhNumber || instructor.cnhNumber.replace(/\D/g, "").length !== 11) {
      setBookingError("Este instrutor não possui CNH cadastrada. Escolha outro instrutor.");
      return;
    }

    setBookingError("");
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (selectedTime) {
      setIsBooking(true);
      setBookingError("");
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const endTime = `${(hours + 1).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      try {
        const result = await onBookClass(
          selectedDate,
          selectedTime,
          endTime,
          instructor,
        );
        if (result && result.success === false) {
          setBookingError(result.error || "Erro ao agendar aula.");
        } else {
          setShowBookingModal(false);
          setShowSuccessModal(true);
        }
      } catch (error: any) {
        const msg: string = error?.message || "";
        const isConflict = /409|reservado|conflict|already booked|already/i.test(msg);
        const isCnhError = /CNH number.*validation|cnhNumber|cnh.*invalid/i.test(msg);
        if (isConflict) {
          setBookingError("Este horário acabou de ser reservado. Escolha outro horário.");
          setShowBookingModal(false);
          setSelectedTime(null);
        } else if (isCnhError) {
          setBookingError("Instrutor sem CNH válida cadastrada. Escolha outro instrutor.");
        } else {
          setBookingError(msg || "Erro inesperado ao agendar.");
        }
      } finally {
        setIsBooking(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Hero Header no padrão Structured & Bold */}
      <div className="sticky top-0 z-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden shadow-md">
        <div className="absolute bottom-0 right-0 w-44 h-44 bg-blue-600/10 rounded-full translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto w-full px-4 md:px-6 pt-6 pb-6 relative z-10">
          {/* Top Back e Título */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={onBack}
              className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-400">Perfil do Instrutor</p>
          </div>

          {/* Info do Instrutor no Header */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className={cn(
                "w-16 h-16 rounded-2xl overflow-hidden border-2 bg-slate-800 shadow-xl flex items-center justify-center",
                instructor.instructorType === "Credenciado" ? "border-blue-500" : "border-emerald-500"
              )}>
                {instructor.profilePicture ? (
                  <img src={instructor.profilePicture} alt={instructor.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-extrabold text-2xl">{instructor.name?.charAt(0)}</span>
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black text-slate-50 leading-tight truncate">{instructor.name}</h1>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="bg-blue-600/20 text-blue-300 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  ★ {instructor.rating?.toFixed(1) || '—'} ({instructor.reviewsCount})
                </span>
                {instructor.transmission && (
                  <span className="bg-white/10 text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {instructor.transmission === 'Automatic' ? 'Automático' : 'Manual'}
                  </span>
                )}
                {instructor.location && (
                  <span className="bg-white/10 text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 truncate max-w-[120px]">
                    <MapPin size={9} /> {instructor.location}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-lg font-black text-white leading-none">R$ {instructor.pricePerClass}</p>
              <p className="text-[10px] text-slate-400 mt-1">por aula</p>
            </div>
          </div>
        </div>
      </div>

      {/* pb-52 mobile: reserva espaço para BottomNav (64px) + footer de ações (~140px) */}
      <div className="max-w-6xl mx-auto w-full px-4 md:px-6 pt-6 pb-52 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Coluna Esquerda: Alertas, Bio e Veículo */}
          <div className="md:col-span-7 space-y-4">
            {/* Alertas de dependências LADV ou Cartão */}
            {!hasLadv && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex gap-3 items-center justify-between shadow-sm">
                <div className="flex gap-2 items-center min-w-0">
                  <AlertCircle size={16} className="text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-800 font-semibold truncate">É obrigatório enviar a LADV para agendar</p>
                </div>
                <button
                  onClick={() => setShowLadvAlert(true)}
                  className="text-xs font-black text-amber-700 underline underline-offset-2 hover:text-amber-800 shrink-0 cursor-pointer"
                >
                  Enviar ›
                </button>
              </div>
            )}

            {!hasPaymentMethod && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex gap-3 items-center justify-between shadow-sm">
                <div className="flex gap-2 items-center min-w-0">
                  <CreditCard size={16} className="text-blue-600 shrink-0" />
                  <p className="text-xs text-blue-800 font-semibold truncate">Cadastre um cartão para realizar o agendamento</p>
                </div>
                <button
                  onClick={onAddPaymentMethod}
                  className="text-xs font-black text-blue-700 underline underline-offset-2 hover:text-blue-800 shrink-0 cursor-pointer"
                >
                  Adicionar ›
                </button>
              </div>
            )}

            {/* Biografia do Instrutor */}
            {instructor.bio && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sobre</p>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{instructor.bio}</p>
              </div>
            )}

            {/* Informações Complementares do Veículo */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Veículo de instrução</p>
                <p className="text-sm font-extrabold text-slate-900">{instructor.vehicleModel || "Modelo não informado"}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                <Car size={20} />
              </div>
            </div>
          </div>

          {/* Coluna Direita: Agendamento, Horários e Botões (Sticky no Desktop) */}
          <div className="md:col-span-5 md:sticky md:top-36 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-5">
              {/* Widget de Agendamento */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Escolha uma data</p>
                <CalendarWidget
                  selectedDate={selectedDate}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                    setBookingError("");
                  }}
                />
              </div>

              {/* Horários */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Disponíveis em {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </p>

                {availableTimes.length > 0 ? (
                  <div className="grid grid-cols-4 md:grid-cols-3 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => { setSelectedTime(time); setBookingError(""); }}
                        className={cn(
                          "py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                          selectedTime === time
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10"
                            : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                    <CalendarIcon className="mx-auto text-slate-300 mb-2" size={28} />
                    <p className="text-slate-500 text-xs font-semibold">
                      Nenhum horário disponível para esta data.
                    </p>
                  </div>
                )}

                {bookingError && (
                  <div className="mt-3.5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600">
                    <AlertCircle size={16} className="shrink-0 text-red-500" />
                    <span>{bookingError}</span>
                  </div>
                )}
              </div>

              {/* Ações de Agendamento Inline no Desktop */}
              <div className="hidden md:flex md:flex-col md:gap-2.5 border-t border-slate-100 pt-4">
                <button
                  onClick={handleBookClick}
                  disabled={!selectedTime || !hasLadv || !hasPaymentMethod}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-600/15 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Clock size={16} />
                  {selectedTime ? `Agendar para as ${selectedTime} — R$ ${instructor.pricePerClass}` : "Selecione data e horário"}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Ações Fixas no Rodapé (Somente no Mobile) — posicionado acima do BottomNav (bottom-16 = h-16) */}
      <div className="fixed bottom-16 left-0 right-0 px-4 py-3 bg-white/95 backdrop-blur-sm border-t border-slate-100 z-30 flex flex-col gap-2 md:hidden">
        <button
          onClick={handleBookClick}
          disabled={!selectedTime || !hasLadv || !hasPaymentMethod}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-600/15 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Clock size={16} />
          {selectedTime ? `Agendar para as ${selectedTime} — R$ ${instructor.pricePerClass}` : "Selecione data e horário"}
        </button>
      </div>

      {/* Modais Customizados como Bottom Sheets */}
      <AnimatePresence>
        {/* Modal de Confirmação de Reserva */}
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowBookingModal(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-3xl p-6 w-full max-w-md relative z-10 shadow-2xl border-t border-slate-100 pb-8 text-center"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />
              
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Confirmar Agendamento</h3>
              <p className="text-slate-500 text-xs px-4 mb-5 leading-relaxed">
                Você agendará uma aula prática com o instrutor <span className="font-bold text-slate-800">{instructor.name}</span> no dia <span className="font-bold text-slate-800">{format(selectedDate, "dd/MM/yyyy")}</span> às <span className="font-bold text-slate-800">{selectedTime}</span>.
              </p>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl mb-6 flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-500">Valor da aula</span>
                <span className="text-lg font-black text-blue-600">R$ {instructor.pricePerClass}</span>
              </div>

              {bookingError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl">
                  {bookingError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  onClick={confirmBooking}
                  disabled={isBooking}
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold rounded-xl transition-all cursor-pointer disabled:opacity-40"
                >
                  {isBooking ? "Agendando..." : "Confirmar"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Alerta de LADV Necessária */}
        {showLadvAlert && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowLadvAlert(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-3xl p-6 w-full max-w-md relative z-10 shadow-2xl border-t border-slate-100 pb-8 text-center"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">LADV Obrigatória</h3>
              <p className="text-slate-500 text-xs px-4 mb-6 leading-relaxed">
                Segundo as regras do DETRAN, é obrigatório portar a Licença de Aprendizagem de Direção Veicular (LADV) antes de realizar aulas práticas nas ruas.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLadvAlert(false)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer"
                >
                  Depois
                </button>
                <button
                  onClick={() => {
                    setShowLadvAlert(false);
                    setShowUploadModal(true);
                  }}
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold rounded-xl transition-all cursor-pointer"
                >
                  Enviar LADV agora
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal de Upload de LADV */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowUploadModal(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-3xl p-6 w-full max-w-md relative z-10 shadow-2xl border-t border-slate-100 pb-8 text-center"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Upload size={20} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Enviar LADV</h3>
              <p className="text-slate-500 text-xs px-4 mb-5 leading-relaxed">
                Tire uma foto nítida do documento físico ou faça o upload do PDF oficial gerado pelo DETRAN.
              </p>

              <div
                onClick={() => {
                  setShowUploadModal(false);
                  onUploadLadv();
                }}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 mb-6 flex flex-col items-center justify-center text-slate-400 gap-2 hover:bg-slate-50 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Upload size={28} />
                <span className="text-xs font-bold">Selecionar arquivo de LADV</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Alerta de Cartão de Crédito Necessário */}
        {showPaymentAlert && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowPaymentAlert(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-3xl p-6 w-full max-w-md relative z-10 shadow-2xl border-t border-slate-100 pb-8 text-center"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
                <CreditCard size={22} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Cadastrar Cartão</h3>
              <p className="text-slate-500 text-xs px-4 mb-6 leading-relaxed">
                Para efetuar a reserva e confirmar seu horário na agenda do instrutor, você precisa registrar um cartão de crédito principal.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentAlert(false)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer"
                >
                  Depois
                </button>
                <button
                  onClick={() => {
                    setShowPaymentAlert(false);
                    onAddPaymentMethod();
                  }}
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold rounded-xl transition-all cursor-pointer"
                >
                  Cadastrar agora
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal de Agendamento com Sucesso */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-3xl p-6 w-full max-w-md relative z-10 shadow-2xl border-t border-slate-100 pb-8 text-center"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />
              <div className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="fill-green-50 text-green-500" />
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">Agendamento Confirmado!</h3>
              <p className="text-slate-400 text-xs px-4 mb-5">Sua aula foi agendada e salva com sucesso.</p>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 text-left text-xs font-semibold space-y-3.5">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Instrutor</span>
                  <span className="font-extrabold text-slate-900">{instructor.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Data</span>
                  <span className="font-extrabold text-slate-900">
                    {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Horário</span>
                  <span className="font-extrabold text-slate-900">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Valor total</span>
                  <span className="font-extrabold text-blue-600 text-sm">R$ {instructor.pricePerClass}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={handleAddToCalendar}
                  className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                >
                  <CalendarIcon size={16} />
                  Adicionar ao Google Agenda
                </button>

                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    onBack();
                  }}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm transition-all cursor-pointer active:scale-[0.98]"
                >
                  Voltar ao início
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
