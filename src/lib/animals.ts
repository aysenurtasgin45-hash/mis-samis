import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

export type AnimalDirectoryRow = Database['public']['Views']['animal_directory']['Row'];
export type AnimalInsert = Database['public']['Tables']['animals']['Insert'];

export async function listAdoptableAnimals(searchQuery = '') {
  let query = supabase
    .from('animal_directory')
    .select('*')
    .eq('status', 'In_Shelter')
    .order('entry_date', { ascending: false });

  if (searchQuery.trim()) {
    const term = `%${searchQuery.trim()}%`;
    query = query.or(`name.ilike.${term},microchip_id.ilike.${term},breed.ilike.${term}`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function listAnimals(searchQuery = '') {
  let query = supabase
    .from('animal_directory')
    .select('*')
    .order('entry_date', { ascending: false });

  if (searchQuery.trim()) {
    const term = `%${searchQuery.trim()}%`;
    query = query.or(`name.ilike.${term},microchip_id.ilike.${term},breed.ilike.${term}`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createAnimal(input: AnimalInsert) {
  const { data, error } = await supabase
    .from('animals')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listFacilities() {
  const { data, error } = await supabase
    .from('facilities')
    .select('facility_id, name, municipality_id')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data ?? [];
}
