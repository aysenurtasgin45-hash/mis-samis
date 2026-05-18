import { supabase } from '@/lib/supabase';
import { listAdoptableAnimals } from '@/lib/animals';

export async function getCitizenDashboard() {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;

  const [{ data: profile }, recommendations] = await Promise.all([
    userId
      ? supabase.from('profiles').select('first_name, last_name').eq('user_id', userId).maybeSingle()
      : Promise.resolve({ data: null }),
    listAdoptableAnimals(),
  ]);

  const [applications, complaints] = await Promise.all([
    userId ? supabase.from('adoptions').select('adoption_id', { count: 'exact', head: true }).eq('adopter_id', userId) : Promise.resolve({ count: 0 }),
    userId ? supabase.from('complaints').select('complaint_id', { count: 'exact', head: true }).eq('submitted_by', userId) : Promise.resolve({ count: 0 }),
  ]);

  return {
    profile,
    recommendations: recommendations.slice(0, 2),
    applicationsCount: applications.count ?? 0,
    complaintsCount: complaints.count ?? 0,
  };
}

export async function getStaffDashboard() {
  const [{ data: facilities }, { count: pendingAdoptions }, { count: criticalComplaints }, { data: operations }] = await Promise.all([
    supabase.from('facilities').select('name, capacity, current_occupancy').eq('is_active', true).limit(3),
    supabase.from('adoptions').select('adoption_id', { count: 'exact', head: true }).eq('status', 'Pending'),
    supabase.from('complaints').select('complaint_id', { count: 'exact', head: true }).in('status', ['Open', 'Assigned', 'In_Progress']),
    supabase
      .from('operations')
      .select('operation_id, operation_type, operation_date, result')
      .order('operation_date', { ascending: false })
      .limit(5),
  ]);

  return {
    facilities: facilities ?? [],
    pendingAdoptions: pendingAdoptions ?? 0,
    criticalComplaints: criticalComplaints ?? 0,
    recentOperations: operations ?? [],
  };
}
