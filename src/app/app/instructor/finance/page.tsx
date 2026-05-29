"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { InstructorFinance, EarningsData } from "@/components/screens/instructor/Finance";
import { useApp } from "@/context/AppContext";
import { getInstructorEarningsAction } from "@/lib/actions/instructors";
import { getConnectStatusAction } from "@/lib/actions/connect";

export default function InstructorFinancePage() {
  const router = useRouter();
  const { instructorProfile } = useApp();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [earningsData, setEarningsData] = useState<EarningsData | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [stripePayoutsEnabled, setStripePayoutsEnabled] = useState<boolean>(
    instructorProfile?.stripePayoutsEnabled ?? false
  );

  useEffect(() => {
    getConnectStatusAction().then((res) => {
      if (res.success) setStripePayoutsEnabled(res.data.stripePayoutsEnabled);
    });
  }, []);

  const fetchEarnings = useCallback(async (month: number, year: number) => {
    if (!instructorProfile?.id) return;

    setIsLoading(true);
    try {
      const result = await getInstructorEarningsAction(instructorProfile.id, month, year);
      if (result.success) {
        setEarningsData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch earnings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [instructorProfile?.id]);

  useEffect(() => {
    fetchEarnings(selectedMonth, selectedYear);
  }, [fetchEarnings, selectedMonth, selectedYear]);

  const handleMonthYearChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <div className="px-4 md:px-8 py-6">
      <InstructorFinance
        earningsData={earningsData}
        stripePayoutsEnabled={stripePayoutsEnabled}
        onBack={() => router.back()}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthYearChange={handleMonthYearChange}
        isLoading={isLoading}
      />
    </div>
  );
}
