// src/components/layout/BottomNav.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  CreditCard,
  User,
  Settings,
  Users,
  Grid3X3,
  Compass,
  BookOpen,
  FileText,
  Stethoscope,
  Brain,
  GraduationCap,
  IdCard,
  BarChart2,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MoreDrawer, NavItem } from "./MoreDrawer";

// ── Aluno: itens fixos (4) ────────────────────────────────────────────────
const studentPrimaryNav: NavItem[] = [
  { icon: Home, label: "Início", href: "/app/student/dashboard" },
  { icon: Calendar, label: "Agenda", href: "/app/student/schedule" },
  { icon: Users, label: "Instrutores", href: "/app/student/instructors" },
  { icon: CreditCard, label: "Pagamentos", href: "/app/student/payments" },
];

// ── Aluno: itens do drawer (10) ───────────────────────────────────────────
const studentSecondaryNav: NavItem[] = [
  { icon: Compass, label: "Jornada", href: "/app/student/concierge" },
  { icon: BookOpen, label: "Curso", href: "/app/student/theory-course" },
  { icon: FileText, label: "RENACH", href: "/app/student/renach" },
  { icon: Stethoscope, label: "Médico", href: "/app/student/exams/medical" },
  { icon: Brain, label: "Psicológico", href: "/app/student/exams/psychological" },
  { icon: GraduationCap, label: "Teórico", href: "/app/student/exams/theory-official" },
  { icon: IdCard, label: "LADV", href: "/app/student/ladv" },
  { icon: BarChart2, label: "Progresso", href: "/app/student/progress" },
  { icon: Scale, label: "Disputas", href: "/app/student/dispute" },
  { icon: User, label: "Perfil", href: "/app/student/profile" },
  { icon: Settings, label: "Config", href: "/app/student/settings" },
];

// ── Instrutor: sem mudança ─────────────────────────────────────────────────
const instructorNav: NavItem[] = [
  { icon: Home, label: "Início", href: "/app/instructor/dashboard" },
  { icon: Calendar, label: "Agenda", href: "/app/instructor/schedule" },
  { icon: CreditCard, label: "Finanças", href: "/app/instructor/finance" },
  { icon: User, label: "Perfil", href: "/app/instructor/profile" },
  { icon: Settings, label: "Config", href: "/app/instructor/settings" },
];

// ── Componente auxiliar reutilizável ──────────────────────────────────────
function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center justify-center flex-1 gap-0.5 py-1 rounded-xl transition-all duration-200 relative",
        isActive ? "text-blue-400" : "text-slate-500"
      )}
    >
      {isActive && (
        <div className="absolute -top-1 w-6 h-0.5 bg-blue-400 rounded-full" />
      )}
      <div className={cn("p-1.5 rounded-lg transition-colors", isActive && "bg-blue-400/10")}>
        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <span
        className={cn(
          "text-[10px] font-bold tracking-tight uppercase transition-all",
          isActive ? "opacity-100" : "opacity-60"
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

// ── Componente principal ──────────────────────────────────────────────────
export const BottomNav = () => {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isInstructor = pathname.startsWith("/app/instructor");

  // Instrutor: comportamento original sem mudanças
  if (isInstructor) {
    return (
      <div className="flex items-center justify-around h-full px-2">
        {instructorNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={
              pathname === item.href || pathname.startsWith(item.href + "/")
            }
          />
        ))}
      </div>
    );
  }

  // Botão central fica "ativo" quando a rota atual é um item secundário
  const isMoreActive =
    isDrawerOpen ||
    studentSecondaryNav.some(
      (item) =>
        pathname === item.href || pathname.startsWith(item.href + "/")
    );

  return (
    <>
      <div className="flex items-center justify-around h-full px-2">
        {/* 2 primeiros itens fixos */}
        {studentPrimaryNav.slice(0, 2).map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={
              pathname === item.href || pathname.startsWith(item.href + "/")
            }
          />
        ))}

        {/* Botão central "Mais" */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center flex-1 gap-0.5 py-1 rounded-xl transition-all duration-200 relative",
            isMoreActive ? "text-blue-400" : "text-slate-500"
          )}
          aria-label="Mais páginas"
          aria-expanded={isDrawerOpen}
        >
          {isMoreActive && (
            <div className="absolute -top-1 w-6 h-0.5 bg-blue-400 rounded-full" />
          )}
          <div
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isMoreActive && "bg-blue-400/10"
            )}
          >
            <Grid3X3 size={20} strokeWidth={isMoreActive ? 2.5 : 2} />
          </div>
          <span
            className={cn(
              "text-[10px] font-bold tracking-tight uppercase transition-all",
              isMoreActive ? "opacity-100" : "opacity-60"
            )}
          >
            Mais
          </span>
        </button>

        {/* 2 últimos itens fixos */}
        {studentPrimaryNav.slice(2).map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={
              pathname === item.href || pathname.startsWith(item.href + "/")
            }
          />
        ))}
      </div>

      {/* Bottom sheet com itens secundários */}
      <MoreDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        items={studentSecondaryNav}
        pathname={pathname}
      />
    </>
  );
};
