create extension if not exists "pgcrypto";

create type user_role as enum ('citizen', 'municipality_staff', 'field_officer_vet', 'adoption_officer', 'ministry_official', 'system_admin');
create type facility_type as enum ('Shelter', 'Rehab', 'VetClinic');
create type animal_species as enum ('Dog', 'Cat', 'Other');
create type animal_sex as enum ('M', 'F');
create type animal_status as enum ('Active', 'In_Shelter', 'Adopted', 'Deceased', 'Released');
create type housing_type as enum ('Apartment', 'House', 'House_with_Garden');
create type complaint_type as enum ('Bite', 'Aggressive', 'Sick_Injured', 'Nuisance', 'Lost', 'Found', 'Other');
create type complaint_status as enum ('Open', 'Assigned', 'In_Progress', 'Resolved', 'Closed');
create type adoption_status as enum ('Pending', 'Approved', 'Rejected', 'Returned', 'Completed');
create type operation_type as enum ('Catch', 'CNVR', 'Treatment', 'Relocation', 'Release', 'Euthanasia');

create table municipalities (
  mun_id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  district text,
  total_capacity integer default 0,
  contact_email text,
  is_active boolean not null default true
);

create table facilities (
  facility_id uuid primary key default gen_random_uuid(),
  municipality_id uuid not null references municipalities(mun_id) on delete cascade,
  name text not null,
  facility_type facility_type not null,
  capacity integer not null check (capacity >= 0),
  current_occupancy integer not null default 0 check (current_occupancy >= 0),
  address text,
  latitude numeric,
  longitude numeric,
  alert_threshold integer default 85,
  is_active boolean not null default true
);

create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text,
  role user_role not null default 'citizen',
  auth_level integer not null default 1,
  municipality_id uuid references municipalities(mun_id),
  facility_id uuid references facilities(facility_id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table citizens (
  user_id uuid primary key references profiles(user_id) on delete cascade,
  tc_kimlik_no text not null unique,
  address text,
  housing_type housing_type,
  has_garden boolean not null default false,
  prev_ownership_exp integer not null default 0,
  responsible_training boolean not null default false,
  financial_status text
);

create table animals (
  animal_id uuid primary key default gen_random_uuid(),
  microchip_id text not null unique,
  name text,
  species animal_species not null,
  breed text,
  age_estimate integer,
  sex animal_sex not null,
  sterilization_status boolean not null default false,
  color_markings text,
  status animal_status not null default 'Active',
  photo_url text,
  entry_date date not null default current_date,
  municipality_id uuid not null references municipalities(mun_id),
  current_facility_id uuid references facilities(facility_id),
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table complaints (
  complaint_id uuid primary key default gen_random_uuid(),
  incident_type complaint_type not null,
  description text not null,
  location_lat numeric,
  location_lng numeric,
  location_address text,
  animal_id uuid references animals(animal_id),
  submitted_by uuid references profiles(user_id),
  responsible_mun_id uuid references municipalities(mun_id),
  assigned_to uuid references profiles(user_id),
  status complaint_status not null default 'Open',
  submitted_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolution_notes text
);

create table adoptions (
  adoption_id uuid primary key default gen_random_uuid(),
  animal_id uuid not null references animals(animal_id),
  adopter_id uuid not null references profiles(user_id),
  adoption_officer_id uuid references profiles(user_id),
  application_date timestamptz not null default now(),
  approval_date timestamptz,
  status adoption_status not null default 'Pending',
  match_score numeric,
  checkin_count integer not null default 0,
  last_checkin_date timestamptz,
  checkin_notes text,
  rejection_reason text
);

create table operations (
  operation_id uuid primary key default gen_random_uuid(),
  animal_id uuid not null references animals(animal_id),
  operation_type operation_type not null,
  operation_date timestamptz not null default now(),
  location_lat numeric,
  location_lng numeric,
  result text,
  notes text,
  responsible_mun_id uuid references municipalities(mun_id),
  staff_user_id uuid references profiles(user_id)
);

create view animal_directory as
select
  a.*,
  m.city,
  m.district,
  f.name as facility_name
from animals a
left join municipalities m on m.mun_id = a.municipality_id
left join facilities f on f.facility_id = a.current_facility_id;

create view analytics_monthly_registrations as
select to_char(date_trunc('month', entry_date), 'Mon') as month, count(*)::integer as count
from animals
where entry_date >= current_date - interval '7 months'
group by date_trunc('month', entry_date)
order by min(entry_date);

create view analytics_status_distribution as
select
  case status
    when 'Active' then 'Aktif'
    when 'In_Shelter' then 'Barinakta'
    when 'Adopted' then 'Sahiplenildi'
    when 'Deceased' then 'Vefat'
    else 'Birakildi'
  end as name,
  round(count(*) * 100.0 / nullif(sum(count(*)) over (), 0))::integer as value,
  case status
    when 'Active' then '#1a5276'
    when 'In_Shelter' then '#f0a500'
    when 'Adopted' then '#10b981'
    else '#94a3b8'
  end as color
from animals
group by status;

create view analytics_kpis as
select 'total_registered' as key, 'Toplam Kayitli' as title, count(*)::text as value, '+0%' as trend, true as is_up from animals
union all
select 'sterilization_rate', 'Kisirlastirilma Orani', '%' || coalesce(round(avg(case when sterilization_status then 1 else 0 end) * 100, 1), 0)::text, '+0%', true from animals
union all
select 'shelter_occupancy', 'Barinak Doluluk', '%' || coalesce(round(sum(current_occupancy)::numeric / nullif(sum(capacity), 0) * 100, 1), 0)::text, '-0%', false from facilities
union all
select 'active_complaints', 'Aktif Ihbarlar', count(*)::text, '+0%', true from complaints where status in ('Open', 'Assigned', 'In_Progress');

create view municipality_performance as
select
  m.name,
  m.city,
  count(a.animal_id)::integer as count,
  least(100, round(count(a.animal_id) * 100.0 / nullif(max(greatest(m.total_capacity, 1)), 0))::integer) as progress
from municipalities m
left join animals a on a.municipality_id = m.mun_id
group by m.mun_id, m.name, m.city
order by count desc;

alter table municipalities enable row level security;
alter table facilities enable row level security;
alter table profiles enable row level security;
alter table citizens enable row level security;
alter table animals enable row level security;
alter table complaints enable row level security;
alter table adoptions enable row level security;
alter table operations enable row level security;

create policy "public can read active municipalities" on municipalities for select using (is_active);
create policy "public can read active facilities" on facilities for select using (is_active);
create policy "public can read adoptable animals" on animals for select using (status = 'In_Shelter');
create policy "authenticated can read animal registry" on animals for select to authenticated using (true);
create policy "staff can insert animals" on animals for insert to authenticated with check (true);
create policy "users can read own profile" on profiles for select to authenticated using (auth.uid() = user_id);
create policy "users can insert own profile" on profiles for insert to authenticated with check (auth.uid() = user_id);
create policy "users can read own citizen record" on citizens for select to authenticated using (auth.uid() = user_id);
create policy "users can insert own citizen record" on citizens for insert to authenticated with check (auth.uid() = user_id);
create policy "authenticated can read complaints" on complaints for select to authenticated using (true);
create policy "authenticated can read adoptions" on adoptions for select to authenticated using (true);
create policy "authenticated can read operations" on operations for select to authenticated using (true);
