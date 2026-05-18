import { supabase } from '@/lib/supabase';

export type CitizenRegistrationInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tcNo: string;
  phone: string;
  address: string;
  housingType: string;
  hasGarden: boolean;
  prevExperience: number;
  trainingCompleted: boolean;
  financialStatus: string;
};

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', data.user.id)
    .single();

  if (profileError) throw profileError;
  return profile;
}

export async function registerCitizen(input: CitizenRegistrationInput) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        role: 'citizen',
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error('Kullanici olusturulamadi.');

  const { error: profileError } = await supabase.from('profiles').insert({
    user_id: data.user.id,
    first_name: input.firstName,
    last_name: input.lastName,
    phone: input.phone || null,
    role: 'citizen',
    auth_level: 1,
  });
  if (profileError) throw profileError;

  const { error: citizenError } = await supabase.from('citizens').insert({
    user_id: data.user.id,
    tc_kimlik_no: input.tcNo,
    address: input.address || null,
    housing_type: (input.housingType || null) as 'Apartment' | 'House' | 'House_with_Garden' | null,
    has_garden: input.hasGarden,
    prev_ownership_exp: input.prevExperience,
    responsible_training: input.trainingCompleted,
    financial_status: input.financialStatus || null,
  });
  if (citizenError) throw citizenError;

  return data.user;
}

export function routeForRole(role?: string) {
  switch (role) {
    case 'system_admin':
    case 'ministry_official':
      return '/panel/analytics';
    case 'municipality_staff':
    case 'field_officer_vet':
    case 'adoption_officer':
      return '/panel/hayvanlar';
    default:
      return '/portal';
  }
}
