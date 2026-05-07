import React from 'react';
import { CheckCircle2, CircleDollarSign, Lock, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EscrowStatus } from '@/types';

interface EscrowStepperProps {
  status: EscrowStatus;
  amount: number;
  fee: number;
}

/**
 * Componente para visualizar o ciclo de vida do pagamento (Escrow).
 * Exibe um stepper vertical com os estados do pagamento da aula.
 */
const EscrowStepper: React.FC<EscrowStepperProps> = ({ status, amount, fee }) => {
  const netAmount = amount - fee;

  const steps = [
    {
      label: 'Pago pelo Aluno',
      status: 'LOCKED',
      icon: Lock,
      activeColor: 'text-velo-gold',
      bgColor: 'bg-velo-gold-light',
      borderColor: 'border-velo-gold',
    },
    {
      label: 'Aula Iniciada',
      status: 'IN_PROGRESS',
      icon: PlayCircle,
      activeColor: 'text-velo-blue',
      bgColor: 'bg-velo-blue-light',
      borderColor: 'border-velo-blue',
    },
    {
      label: 'Saldo Liberado',
      status: 'RELEASED',
      icon: CircleDollarSign,
      activeColor: 'text-velo-green',
      bgColor: 'bg-velo-green-light',
      borderColor: 'border-velo-green',
    },
  ];

  const getStepState = (stepStatus: string) => {
    if (status === 'RELEASED') return 'completed';
    
    if (status === 'IN_PROGRESS') {
      if (stepStatus === 'LOCKED') return 'completed';
      if (stepStatus === 'IN_PROGRESS') return 'active';
      return 'pending';
    }
    
    if (status === 'LOCKED') {
      if (stepStatus === 'LOCKED') return 'active';
      return 'pending';
    }

    if (status === 'UNDER_ANALYSIS') {
      if (stepStatus === 'LOCKED' || stepStatus === 'IN_PROGRESS') return 'completed';
      return 'active'; // Mostra o último como ativo mas talvez com cor diferente? Seguindo o plano, focamos nos 3 principais.
    }

    return 'pending';
  };

  return (
    <div className="flex flex-col gap-6 p-5 bg-white rounded-2xl border border-border shadow-sm">
      <div className="flex justify-between items-end border-b border-border/50 pb-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
            Valor Líquido
          </span>
          <span className="text-2xl font-black text-foreground leading-none">
            R$ {netAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
            Taxa Velo
          </span>
          <span className="text-sm font-bold text-muted-foreground/80">
            R$ {fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="relative flex flex-col gap-8 py-2">
        {/* Linha conectora vertical */}
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border/40 -z-0" />

        {steps.map((step, index) => {
          const state = getStepState(step.status);
          const isCompleted = state === 'completed';
          const isActive = state === 'active';
          
          let colorClass = 'text-muted-foreground/40';
          let bgClass = 'bg-muted/30';
          let borderClass = 'border-transparent';
          let Icon = step.icon;

          if (isCompleted) {
            colorClass = 'text-velo-green';
            bgClass = 'bg-velo-green-light';
            Icon = CheckCircle2;
          } else if (isActive) {
            colorClass = step.activeColor;
            bgClass = step.bgColor;
            borderClass = cn("border-2", step.borderColor);
          }

          return (
            <div key={step.label} className="flex items-center gap-4 z-10 relative">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                bgClass,
                colorClass,
                isActive ? step.borderColor : "border-transparent"
              )}>
                <Icon size={20} strokeWidth={isActive ? 3 : 2} />
              </div>
              
              <div className="flex flex-col">
                <span className={cn(
                  "font-bold text-sm transition-colors duration-300",
                  isActive || isCompleted ? "text-foreground" : "text-muted-foreground/60"
                )}>
                  {step.label}
                </span>
                <span className={cn(
                  "text-[11px] font-medium transition-colors duration-300",
                  isActive ? step.activeColor : isCompleted ? "text-velo-green" : "text-muted-foreground/40"
                )}>
                  {isActive ? 'Em andamento' : isCompleted ? 'Concluído' : 'Aguardando'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EscrowStepper;
