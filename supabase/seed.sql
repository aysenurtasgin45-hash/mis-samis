insert into municipalities (mun_id, name, city, district, total_capacity, contact_email) values
  ('11111111-1111-1111-1111-111111111111', 'Istanbul Buyuksehir', 'Istanbul', 'Kadikoy', 60000, 'samis@ibb.gov.tr'),
  ('22222222-2222-2222-2222-222222222222', 'Ankara Buyuksehir', 'Ankara', 'Cankaya', 42000, 'samis@ankara.bel.tr')
on conflict (mun_id) do nothing;

insert into facilities (facility_id, municipality_id, name, facility_type, capacity, current_occupancy, address) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Merkez Barinak', 'Shelter', 1200, 840, 'Kadikoy, Istanbul'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Baskent Rehabilitasyon Merkezi', 'Rehab', 900, 610, 'Cankaya, Ankara')
on conflict (facility_id) do nothing;

insert into animals (
  microchip_id,
  name,
  species,
  breed,
  age_estimate,
  sex,
  sterilization_status,
  status,
  photo_url,
  entry_date,
  municipality_id,
  current_facility_id
) values
  ('900115000123456', 'Pamuk', 'Dog', 'Golden Retriever Mix', 24, 'F', true, 'In_Shelter', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400', '2026-03-12', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('900115000123789', 'Duman', 'Cat', 'Tekir', 18, 'M', true, 'In_Shelter', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400', '2026-02-05', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('900115000124111', 'Zeytin', 'Dog', 'Kangal Mix', 36, 'M', false, 'Active', null, '2026-04-20', '11111111-1111-1111-1111-111111111111', null)
on conflict (microchip_id) do nothing;

insert into operations (animal_id, operation_type, operation_date, result, responsible_mun_id)
select animal_id, 'CNVR', now() - interval '2 hours', name || ' - Kuduz asisi', municipality_id
from animals
where microchip_id = '900115000123456'
on conflict do nothing;
