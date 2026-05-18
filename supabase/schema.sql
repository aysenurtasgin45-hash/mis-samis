create extension if not exists pgcrypto;

drop table if exists public.announcements cascade;
drop table if exists public.support_tickets cascade;
drop table if exists public.inventory_items cascade;
drop table if exists public.expenses cascade;
drop table if exists public.budgets cascade;
drop table if exists public.kpi_metrics cascade;
drop table if exists public.tasks cascade;
drop table if exists public.projects cascade;
drop table if exists public.employees cascade;
drop table if exists public.departments cascade;

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text not null unique,
  head_name text not null,
  location text not null,
  annual_budget numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null,
  employment_status text not null,
  hire_date date not null,
  monthly_salary numeric(10,2) not null
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  name text not null,
  status text not null,
  priority text not null,
  start_date date not null,
  due_date date not null,
  progress_percent integer not null check (progress_percent between 0 and 100),
  budget numeric(12,2) not null
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  assignee_id uuid not null references public.employees(id) on delete cascade,
  title text not null,
  status text not null,
  due_date date not null,
  effort_hours integer not null
);

create table public.kpi_metrics (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  metric_name text not null,
  period text not null,
  target_value numeric(12,2) not null,
  actual_value numeric(12,2) not null,
  unit text not null
);

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  fiscal_year integer not null,
  category text not null,
  allocated_amount numeric(12,2) not null,
  spent_amount numeric(12,2) not null
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  expense_date date not null,
  vendor text not null,
  category text not null,
  amount numeric(10,2) not null,
  approval_status text not null
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  item_name text not null,
  asset_tag text not null unique,
  quantity integer not null,
  condition text not null,
  last_audit_date date not null
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.employees(id) on delete cascade,
  department_id uuid not null references public.departments(id) on delete cascade,
  subject text not null,
  category text not null,
  priority text not null,
  status text not null,
  opened_at timestamptz not null,
  resolved_at timestamptz
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references public.departments(id) on delete set null,
  title text not null,
  audience text not null,
  body text not null,
  published_at timestamptz not null,
  expires_at timestamptz not null
);

insert into public.departments (name, code, head_name, location, annual_budget) values
('Executive Office', 'EXEC', 'Deniz Arslan', 'Istanbul HQ', 1250000),
('Finance', 'FIN', 'Merve Kaya', 'Istanbul HQ', 980000),
('Human Resources', 'HR', 'Selin Demir', 'Ankara Office', 640000),
('Information Technology', 'IT', 'Baran Yildiz', 'Istanbul HQ', 1420000),
('Operations', 'OPS', 'Ece Aydin', 'Izmir Campus', 1180000),
('Sales', 'SALES', 'Can Erdem', 'Istanbul HQ', 1100000),
('Marketing', 'MKT', 'Lara Sahin', 'Remote', 720000),
('Procurement', 'PROC', 'Ozan Celik', 'Bursa Office', 560000),
('Customer Success', 'CS', 'Nihan Aksoy', 'Istanbul HQ', 830000),
('Compliance', 'COMP', 'Kerem Polat', 'Ankara Office', 490000);

insert into public.employees (department_id, full_name, email, role, employment_status, hire_date, monthly_salary)
select d.id, e.full_name, e.email, e.role, e.status, e.hire_date::date, e.salary
from (values
('EXEC', 'Aylin Yilmaz', 'aylin.yilmaz@samis.example', 'Chief Operating Officer', 'Active', '2020-02-12', 14200),
('FIN', 'Burak Koc', 'burak.koc@samis.example', 'Financial Analyst', 'Active', '2021-06-21', 7200),
('HR', 'Ceren Oz', 'ceren.oz@samis.example', 'HR Business Partner', 'Active', '2022-03-14', 6800),
('IT', 'Emir Kaplan', 'emir.kaplan@samis.example', 'Systems Engineer', 'Active', '2020-11-02', 8100),
('OPS', 'Derya Kurt', 'derya.kurt@samis.example', 'Operations Lead', 'Active', '2019-08-19', 7900),
('SALES', 'Mert Sari', 'mert.sari@samis.example', 'Account Manager', 'Active', '2023-01-09', 6600),
('MKT', 'Irem Tan', 'irem.tan@samis.example', 'Campaign Manager', 'Active', '2022-09-05', 6500),
('PROC', 'Onur Acar', 'onur.acar@samis.example', 'Procurement Specialist', 'Active', '2021-04-26', 6100),
('CS', 'Yasemin Eren', 'yasemin.eren@samis.example', 'Customer Success Manager', 'Active', '2020-05-11', 7000),
('COMP', 'Tolga Uslu', 'tolga.uslu@samis.example', 'Compliance Officer', 'Active', '2021-12-01', 7300)
) as e(code, full_name, email, role, status, hire_date, salary)
join public.departments d on d.code = e.code;

insert into public.projects (department_id, name, status, priority, start_date, due_date, progress_percent, budget)
select d.id, p.name, p.status, p.priority, p.start_date::date, p.due_date::date, p.progress, p.budget
from (values
('IT', 'ERP Modernization', 'In progress', 'High', '2026-01-15', '2026-09-30', 74, 310000),
('OPS', 'Branch Operations Audit', 'At risk', 'High', '2026-02-01', '2026-07-15', 48, 185000),
('MKT', 'Customer Portal Refresh', 'In progress', 'Medium', '2026-03-04', '2026-08-20', 61, 126000),
('FIN', 'Quarterly Budget Review', 'Complete', 'Medium', '2026-01-03', '2026-03-31', 100, 54000),
('HR', 'Talent Development Program', 'In progress', 'Medium', '2026-02-12', '2026-10-01', 37, 92000),
('SALES', 'Regional Sales Enablement', 'In progress', 'High', '2026-02-20', '2026-08-31', 58, 140000),
('PROC', 'Supplier Risk Scoring', 'Planned', 'Medium', '2026-06-01', '2026-11-15', 8, 67000),
('CS', 'Support SLA Improvement', 'In progress', 'High', '2026-01-22', '2026-06-30', 83, 88000),
('COMP', 'Policy Renewal Cycle', 'In progress', 'High', '2026-03-18', '2026-07-30', 44, 45000),
('EXEC', 'Strategic Planning Office', 'Planned', 'Medium', '2026-05-01', '2026-12-20', 15, 160000)
) as p(code, name, status, priority, start_date, due_date, progress, budget)
join public.departments d on d.code = p.code;

insert into public.tasks (project_id, assignee_id, title, status, due_date, effort_hours)
select p.id, e.id, t.title, t.status, t.due_date::date, t.hours
from (values
('ERP Modernization', 'emir.kaplan@samis.example', 'Complete finance module mapping', 'In progress', '2026-05-24', 32),
('Branch Operations Audit', 'derya.kurt@samis.example', 'Review Izmir site controls', 'Blocked', '2026-05-28', 24),
('Customer Portal Refresh', 'irem.tan@samis.example', 'Approve dashboard wireframes', 'In progress', '2026-05-22', 18),
('Quarterly Budget Review', 'burak.koc@samis.example', 'Publish Q1 variance report', 'Done', '2026-04-02', 12),
('Talent Development Program', 'ceren.oz@samis.example', 'Finalize leadership curriculum', 'In progress', '2026-06-03', 20),
('Regional Sales Enablement', 'mert.sari@samis.example', 'Prepare partner training pack', 'In progress', '2026-05-30', 16),
('Supplier Risk Scoring', 'onur.acar@samis.example', 'Normalize supplier score fields', 'Todo', '2026-06-07', 26),
('Support SLA Improvement', 'yasemin.eren@samis.example', 'Analyze escalation causes', 'In review', '2026-05-21', 14),
('Policy Renewal Cycle', 'tolga.uslu@samis.example', 'Update data retention policy', 'In progress', '2026-06-10', 22),
('Strategic Planning Office', 'aylin.yilmaz@samis.example', 'Draft FY2027 planning calendar', 'Todo', '2026-06-14', 10)
) as t(project_name, email, title, status, due_date, hours)
join public.projects p on p.name = t.project_name
join public.employees e on e.email = t.email;

insert into public.kpi_metrics (department_id, metric_name, period, target_value, actual_value, unit)
select d.id, k.metric, k.period, k.target, k.actual, k.unit
from (values
('EXEC', 'Strategic initiatives on track', '2026-Q2', 85, 78, 'percent'),
('FIN', 'Budget variance', '2026-Q2', 5, 3.6, 'percent'),
('HR', 'Employee engagement', '2026-Q2', 82, 79, 'score'),
('IT', 'System uptime', '2026-Q2', 99.5, 99.8, 'percent'),
('OPS', 'Process cycle time reduction', '2026-Q2', 12, 9, 'percent'),
('SALES', 'Pipeline coverage', '2026-Q2', 3.5, 3.1, 'ratio'),
('MKT', 'Campaign conversion rate', '2026-Q2', 7.5, 8.2, 'percent'),
('PROC', 'Supplier compliance rate', '2026-Q2', 94, 91, 'percent'),
('CS', 'First response SLA', '2026-Q2', 90, 93, 'percent'),
('COMP', 'Audit findings closed', '2026-Q2', 88, 84, 'percent')
) as k(code, metric, period, target, actual, unit)
join public.departments d on d.code = k.code;

insert into public.budgets (department_id, fiscal_year, category, allocated_amount, spent_amount)
select d.id, 2026, b.category, b.allocated, b.spent
from (values
('EXEC', 'Strategy', 250000, 112000),
('FIN', 'Reporting Tools', 160000, 76000),
('HR', 'Training', 135000, 52000),
('IT', 'Cloud Infrastructure', 420000, 268000),
('OPS', 'Facilities', 310000, 191000),
('SALES', 'Travel', 180000, 94000),
('MKT', 'Digital Campaigns', 220000, 124000),
('PROC', 'Vendor Platforms', 85000, 44000),
('CS', 'Support Systems', 145000, 89000),
('COMP', 'External Audits', 98000, 61000)
) as b(code, category, allocated, spent)
join public.departments d on d.code = b.code;

insert into public.expenses (department_id, expense_date, vendor, category, amount, approval_status)
select d.id, x.expense_date::date, x.vendor, x.category, x.amount, x.status
from (values
('EXEC', '2026-05-02', 'Northstar Advisory', 'Consulting', 18500, 'Approved'),
('FIN', '2026-05-04', 'LedgerWorks', 'Software', 7200, 'Approved'),
('HR', '2026-05-05', 'SkillPath Academy', 'Training', 9600, 'Pending'),
('IT', '2026-05-07', 'CloudGrid', 'Infrastructure', 31800, 'Approved'),
('OPS', '2026-05-08', 'Metro Facilities', 'Maintenance', 14600, 'Approved'),
('SALES', '2026-05-09', 'Atlas Travel', 'Travel', 5200, 'Pending'),
('MKT', '2026-05-10', 'BrightReach Media', 'Advertising', 21400, 'Approved'),
('PROC', '2026-05-11', 'VendorLens', 'Subscription', 3900, 'Rejected'),
('CS', '2026-05-12', 'HelpdeskPro', 'Software', 8700, 'Approved'),
('COMP', '2026-05-13', 'AssureAudit', 'Audit', 12500, 'Pending')
) as x(code, expense_date, vendor, category, amount, status)
join public.departments d on d.code = x.code;

insert into public.inventory_items (department_id, item_name, asset_tag, quantity, condition, last_audit_date)
select d.id, i.item_name, i.asset_tag, i.quantity, i.condition, i.audit_date::date
from (values
('EXEC', 'Executive conference tablet', 'MIS-EXEC-001', 4, 'Good', '2026-04-15'),
('FIN', 'Secure document scanner', 'MIS-FIN-002', 2, 'Excellent', '2026-04-18'),
('HR', 'Training room laptop', 'MIS-HR-003', 8, 'Good', '2026-04-20'),
('IT', 'Core network switch', 'MIS-IT-004', 6, 'Excellent', '2026-05-01'),
('OPS', 'Warehouse barcode scanner', 'MIS-OPS-005', 12, 'Fair', '2026-04-29'),
('SALES', 'Demo tablet kit', 'MIS-SALES-006', 10, 'Good', '2026-05-03'),
('MKT', 'Video production camera', 'MIS-MKT-007', 3, 'Good', '2026-04-25'),
('PROC', 'Supplier kiosk terminal', 'MIS-PROC-008', 2, 'Fair', '2026-04-27'),
('CS', 'Call center headset', 'MIS-CS-009', 30, 'Good', '2026-05-05'),
('COMP', 'Encrypted evidence drive', 'MIS-COMP-010', 5, 'Excellent', '2026-05-06')
) as i(code, item_name, asset_tag, quantity, condition, audit_date)
join public.departments d on d.code = i.code;

insert into public.support_tickets (requester_id, department_id, subject, category, priority, status, opened_at, resolved_at)
select e.id, d.id, s.subject, s.category, s.priority, s.status, s.opened_at::timestamptz, nullif(s.resolved_at, '')::timestamptz
from (values
('aylin.yilmaz@samis.example', 'EXEC', 'Board report export issue', 'Reporting', 'High', 'Open', '2026-05-14 09:20+03', ''),
('burak.koc@samis.example', 'FIN', 'Budget dashboard totals mismatch', 'Data', 'High', 'In progress', '2026-05-13 11:10+03', ''),
('ceren.oz@samis.example', 'HR', 'Unable to update training attendance', 'Application', 'Medium', 'Resolved', '2026-05-11 13:30+03', '2026-05-12 10:05+03'),
('emir.kaplan@samis.example', 'IT', 'VPN policy approval needed', 'Access', 'Medium', 'Open', '2026-05-15 08:45+03', ''),
('derya.kurt@samis.example', 'OPS', 'Scanner sync failure', 'Hardware', 'High', 'In progress', '2026-05-12 16:40+03', ''),
('mert.sari@samis.example', 'SALES', 'CRM export timeout', 'Application', 'Medium', 'Resolved', '2026-05-09 10:15+03', '2026-05-09 15:50+03'),
('irem.tan@samis.example', 'MKT', 'Campaign report access request', 'Access', 'Low', 'Resolved', '2026-05-10 09:05+03', '2026-05-10 12:00+03'),
('onur.acar@samis.example', 'PROC', 'Supplier portal attachment missing', 'Application', 'Medium', 'Open', '2026-05-16 14:25+03', ''),
('yasemin.eren@samis.example', 'CS', 'Ticket queue automation delayed', 'Workflow', 'High', 'In progress', '2026-05-14 17:00+03', ''),
('tolga.uslu@samis.example', 'COMP', 'Audit evidence upload blocked', 'Storage', 'High', 'Open', '2026-05-15 12:35+03', '')
) as s(email, code, subject, category, priority, status, opened_at, resolved_at)
join public.employees e on e.email = s.email
join public.departments d on d.code = s.code;

insert into public.announcements (department_id, title, audience, body, published_at, expires_at)
select d.id, a.title, a.audience, a.body, a.published_at::timestamptz, a.expires_at::timestamptz
from (values
('EXEC', 'Quarterly leadership review', 'Managers', 'Leadership review packets are due before Friday noon.', '2026-05-13 09:00+03', '2026-06-01 18:00+03'),
('FIN', 'Expense cutoff reminder', 'All Staff', 'Submit May expenses by the last business day of the month.', '2026-05-12 09:00+03', '2026-05-31 18:00+03'),
('HR', 'Learning week registration', 'All Staff', 'Registration is open for the June learning week sessions.', '2026-05-10 10:00+03', '2026-06-05 18:00+03'),
('IT', 'Scheduled maintenance window', 'All Staff', 'Core systems maintenance is planned for Saturday evening.', '2026-05-14 08:30+03', '2026-05-19 09:00+03'),
('OPS', 'Warehouse safety inspection', 'Operations', 'Safety inspection rounds begin next Monday morning.', '2026-05-11 15:00+03', '2026-05-27 18:00+03'),
('SALES', 'Partner demo update', 'Sales', 'The new partner demo deck is available in the portal.', '2026-05-09 12:00+03', '2026-06-09 18:00+03'),
('MKT', 'Brand asset refresh', 'Marketing', 'Updated brand files are ready for campaign teams.', '2026-05-08 11:30+03', '2026-06-15 18:00+03'),
('PROC', 'Supplier review cycle', 'Procurement', 'Quarterly supplier review forms are now live.', '2026-05-07 09:45+03', '2026-06-07 18:00+03'),
('CS', 'SLA playbook update', 'Customer Success', 'The revised escalation playbook is published.', '2026-05-13 14:15+03', '2026-06-13 18:00+03'),
('COMP', 'Policy acknowledgement', 'All Staff', 'Please acknowledge the updated data handling policy.', '2026-05-15 10:00+03', '2026-06-15 18:00+03')
) as a(code, title, audience, body, published_at, expires_at)
join public.departments d on d.code = a.code;

alter table public.departments enable row level security;
alter table public.employees enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.kpi_metrics enable row level security;
alter table public.budgets enable row level security;
alter table public.expenses enable row level security;
alter table public.inventory_items enable row level security;
alter table public.support_tickets enable row level security;
alter table public.announcements enable row level security;

create policy "Public dashboard read access" on public.departments for select using (true);
create policy "Public dashboard read access" on public.employees for select using (true);
create policy "Public dashboard read access" on public.projects for select using (true);
create policy "Public dashboard read access" on public.tasks for select using (true);
create policy "Public dashboard read access" on public.kpi_metrics for select using (true);
create policy "Public dashboard read access" on public.budgets for select using (true);
create policy "Public dashboard read access" on public.expenses for select using (true);
create policy "Public dashboard read access" on public.inventory_items for select using (true);
create policy "Public dashboard read access" on public.support_tickets for select using (true);
create policy "Public dashboard read access" on public.announcements for select using (true);
