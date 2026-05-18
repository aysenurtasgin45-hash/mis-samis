import { supabase } from '@/lib/supabase';

export async function getAnalyticsDashboard() {
  const [registrations, statusDistribution, kpis, municipalityPerformance] = await Promise.all([
    supabase.from('analytics_monthly_registrations').select('*'),
    supabase.from('analytics_status_distribution').select('*'),
    supabase.from('analytics_kpis').select('*'),
    supabase.from('municipality_performance').select('*').limit(5),
  ]);

  const firstError = registrations.error ?? statusDistribution.error ?? kpis.error ?? municipalityPerformance.error;
  if (firstError) throw firstError;

  return {
    registrationData: registrations.data ?? [],
    statusDistribution: statusDistribution.data ?? [],
    kpis: kpis.data ?? [],
    municipalityPerformance: municipalityPerformance.data ?? [],
    projections: [
      { year: '2026', population: 4000000 },
      { year: '2027', population: 3800000 },
      { year: '2028', population: 3500000 },
      { year: '2029', population: 3100000 },
      { year: '2030', population: 2600000 },
    ],
  };
}
