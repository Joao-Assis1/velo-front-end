"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  MapPin,
  Car,
  Star,
  MessageCircle,
  CheckCircle2,
  Upload,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import { format, isBefore, startOfDay, isSameDay, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button, CalendarWidget } from "@/components/ui-custom";
import { Instructor } from "@/types";
import { MOCK_INSTRUCTORS } from "@/constants/mockData";

export const InstructorProfileView = ({
  instructor,
  onBack,
  hasLadv,
  onUploadLadv,
  onBookClass,
  busySlots,
}: {
  instructor: Instructor;
  onBack: () => void;
  hasLadv: boolean;
  onUploadLadv: () => void;
  onBookClass: (
    date: Date,
    startTime: string,
    endTime: string,
    instructor: Instructor,
  ) => void;
  busySlots?: Record<string, string[]>;
}) => {
  const [showWhatsAppAnim, setShowWhatsAppAnim] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLadvAlert, setShowLadvAlert] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleAddToCalendar = () => {
    if (!selectedTime) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startDate = new Date(selectedDate);
    startDate.setHours(hours, minutes);
    const endDate = new Date(startDate);
    endDate.setHours(hours + 1, minutes);

    const title = `Aula de Direção com ${instructor.name}`;
    const details = `Aula prática de direção veicular. Veículo: ${instructor.vehicleModel}`;
    const location = instructor.location;

    const formatGCalDate = (date: Date) =>
      date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

    window.open(googleUrl, "_blank");
  };

  // Mock available times based on selected date
  const getAvailableTimes = (date: Date) => {
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
      instructor.busySlots?.filter((slot) =>
        isSameDay(new Date(slot.date), date),
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

  const handleWhatsAppClick = () => {
    setShowWhatsAppAnim(true);
    setTimeout(() => {
      setShowWhatsAppAnim(false);
      alert("Redirecionando para o WhatsApp...");
    }, 1500);
  };

  const handleBookClick = () => {
    if (!selectedTime) {
      alert("Por favor, selecione um horário primeiro.");
      return;
    }
    if (!hasLadv) {
      setShowLadvAlert(true);
      return;
    }
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const endTime = `${(hours + 1).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      // Adaptation for booking logic with the updated Instructor interface
      const adaptedInstructor = {
        ...instructor,
        profilePicture: (instructor as any).image,
        pricePerClass: (instructor as any).price,
        instructorType: (instructor as any).type,
        reviewsCount: (instructor as any).reviews,
      } as unknown as Instructor;

      onBookClass(selectedDate, selectedTime, endTime, adaptedInstructor);
      setShowBookingModal(false);
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-32">
      <div className="pt-6 px-4 flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="px-6">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full p-1 border-2 border-slate-100">
              <img
                src={(instructor as any).image}
                alt={instructor.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border-2 border-white">
              <Star size={10} fill="currentColor" />
              {instructor.rating}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            {instructor.name}
          </h1>
          <p className="text-slate-500 text-sm flex items-center justify-center gap-1 mb-4">
            <MapPin size={14} /> {instructor.location}
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            <span
              className={cn(
                "text-xs px-3 py-1.5 rounded-full font-medium border transition-colors",
                (instructor as any).type === "Credenciado"
                  ? "bg-blue-50 text-velo-blue border-blue-100"
                  : "bg-orange-50 text-orange-600 border-orange-100",
              )}
            >
              {(instructor as any).type}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full font-medium border border-slate-100 bg-slate-50 text-slate-600 flex items-center gap-1">
              <Car size={12} />
              {instructor.vehicleModel}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full font-medium border border-slate-100 bg-slate-50 text-slate-600">
              {instructor.transmission}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              Valor Hora/Aula
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-slate-900">
                R$ {(instructor as any).price}
              </span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              Experiência
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-slate-900">
                {(instructor as any).reviews}
              </span>
              <span className="text-xs text-slate-500 font-medium">aulas</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-slate-900 mb-2 text-lg">Sobre</h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            {instructor.bio}
          </p>
        </div>

        <div className="mt-8">
          <h3 className="font-bold text-slate-900 mb-4">Disponibilidade</h3>

          <CalendarWidget
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
          />

          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-700 mb-3">
              Horários disponíveis para{" "}
              {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </h4>

            {availableTimes.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "py-2 px-1 rounded-lg border text-sm font-medium transition-colors",
                      selectedTime === time
                        ? "bg-velo-blue text-white border-velo-blue shadow-sm"
                        : "border-slate-200 hover:border-velo-blue hover:text-velo-blue bg-white",
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-100">
                <CalendarIcon
                  className="mx-auto text-slate-300 mb-2"
                  size={32}
                />
                <p className="text-slate-500 text-sm">
                  Não há horários disponíveis para esta data.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 z-50 flex flex-col md:flex-row md:left-64 gap-3">
        <Button
          className="w-full text-lg py-4 md:flex-1"
          onClick={handleBookClick}
        >
          Agendar agora {selectedTime ? `(${selectedTime})` : ""}
        </Button>

        <AnimatePresence>
          {showWhatsAppAnim ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-velo-green text-white p-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 w-full md:flex-1"
            >
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="font-bold">Abrindo WhatsApp...</span>
            </motion.div>
          ) : (
            <Button
              variant="secondary"
              className="w-full md:flex-1 shadow-none bg-transparent border-2 border-velo-green text-velo-green hover:bg-velo-green/10"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle size={24} />
              Combinar via WhatsApp
            </Button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowBookingModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Confirm Booking
              </h3>
              <p className="text-slate-600 mb-6">
                Do you want to book a class with{" "}
                <span className="font-bold">{instructor.name}</span> at{" "}
                <span className="font-bold">{selectedTime}</span>?
              </p>

              <div className="bg-slate-50 p-4 rounded-xl mb-6 flex justify-between items-center">
                <span className="text-slate-600">Preço Total</span>
                <span className="text-xl font-bold text-velo-blue">
                  R$ {instructor.pricePerClass}
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={confirmBooking}>
                  Confirm
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLadvAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowLadvAlert(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                LADV Necessária
              </h3>
              <p className="text-slate-600 mb-6">
                Para agendar aulas práticas, é obrigatório enviar sua Licença
                para Aprendizagem de Direção Veicular (LADV).
              </p>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowLadvAlert(false)}
                >
                  Depois
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setShowLadvAlert(false);
                    setShowUploadModal(true);
                  }}
                >
                  Enviar Agora
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowUploadModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-blue-50 text-velo-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Enviar LADV
              </h3>
              <p className="text-slate-600 mb-6 text-sm">
                Tire uma foto ou envie o PDF da sua Licença de Aprendizagem.
              </p>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 mb-6 flex flex-col items-center justify-center text-slate-400 gap-2 hover:bg-slate-50 transition-colors cursor-pointer">
                <Upload size={32} />
                <span className="text-sm font-medium">
                  Clique para selecionar arquivo
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setShowUploadModal(false);
                    onUploadLadv();
                    setShowBookingModal(true);
                  }}
                >
                  Enviar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Agendamento Confirmado!
              </h3>
              <p className="text-slate-500 mb-6">
                Sua aula foi agendada com sucesso.
              </p>

              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500 text-sm">Instrutor</span>
                  <span className="font-bold text-slate-900">
                    {instructor.name}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500 text-sm">Data</span>
                  <span className="font-bold text-slate-900">
                    {format(selectedDate, "dd 'de' MMM", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-500 text-sm">Horário</span>
                  <span className="font-bold text-slate-900">
                    {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Valor</span>
                  <span className="font-bold text-velo-blue">
                    R$ {(instructor as any).price}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={handleAddToCalendar}
                >
                  <CalendarIcon size={18} />
                  Adicionar ao Calendário
                </Button>

                <Button
                  className="w-full py-4 text-lg"
                  onClick={() => {
                    setShowSuccessModal(false);
                    onBack();
                  }}
                >
                  Voltar ao Início
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
