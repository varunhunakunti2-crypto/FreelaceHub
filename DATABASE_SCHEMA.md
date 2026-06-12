-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Custom Types (Enums)
create type user_role as enum ('client', 'freelancer', 'admin');
create type project_status as enum ('open', 'in_progress', 'completed', 'cancelled');
create type proposal_status as enum ('pending', 'accepted', 'rejected');
create type contract_status as enum ('active', 'completed', 'disputed');
create type task_priority as enum ('low', 'medium', 'high');
create type payment_status as enum ('pending', 'completed', 'refunded');
create type invoice_status as enum ('draft', 'issued', 'paid', 'overdue', 'cancelled');

-- 2. Tables

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role user_role not null default 'client',
  full_name text,
  avatar_url text,
  bio text,
  hourly_rate numeric(10, 2),
  skills text[],
  location text,
  website text,
  is_active boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  budget_min numeric(10, 2),
  budget_max numeric(10, 2),
  status project_status not null default 'open',
  category text,
  skills_required text[],
  deadline timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Proposals table
create table proposals (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  freelancer_id uuid references profiles(id) on delete cascade not null,
  cover_letter text not null,
  bid_amount numeric(10, 2) not null,
  estimated_days integer not null,
  status proposal_status not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(project_id, freelancer_id)
);

-- Contracts table
create table contracts (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  client_id uuid references profiles(id) on delete cascade not null,
  freelancer_id uuid references profiles(id) on delete cascade not null,
  proposal_id uuid references proposals(id) on delete set null,
  agreed_amount numeric(10, 2) not null,
  status contract_status not null default 'active',
  start_date timestamp with time zone default timezone('utc'::text, now()) not null,
  end_date timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Kanban Columns table
create table kanban_columns (
  id uuid default uuid_generate_v4() primary key,
  contract_id uuid references contracts(id) on delete cascade not null,
  title text not null,
  position integer not null default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tasks table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  column_id uuid references kanban_columns(id) on delete cascade not null,
  contract_id uuid references contracts(id) on delete cascade not null,
  title text not null,
  description text,
  assignee_id uuid references profiles(id) on delete set null,
  due_date timestamp with time zone,
  priority task_priority not null default 'medium',
  position integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Conversations table
create table conversations (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade,
  participant_ids uuid[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  file_url text,
  read_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payments table
create table payments (
  id uuid default uuid_generate_v4() primary key,
  contract_id uuid references contracts(id) on delete cascade not null,
  client_id uuid references profiles(id) on delete cascade not null,
  freelancer_id uuid references profiles(id) on delete cascade not null,
  amount numeric(10, 2) not null,
  status payment_status not null default 'pending',
  payment_method text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Invoices table
create table invoices (
  id uuid default uuid_generate_v4() primary key,
  payment_id uuid references payments(id) on delete cascade,
  contract_id uuid references contracts(id) on delete cascade not null,
  invoice_number text unique not null,
  issued_at timestamp with time zone default timezone('utc'::text, now()) not null,
  due_date timestamp with time zone not null,
  line_items jsonb not null default '[]'::jsonb,
  total_amount numeric(10, 2) not null,
  status invoice_status not null default 'draft',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications table
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. RLS - Row Level Security

alter table profiles enable row level security;
alter table projects enable row level security;
alter table proposals enable row level security;
alter table contracts enable row level security;
alter table kanban_columns enable row level security;
alter table tasks enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table payments enable row level security;
alter table invoices enable row level security;
alter table notifications enable row level security;

-- Utility function to check if user is admin
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 4. RLS Policies

-- Profiles: 
-- Public profiles (others can see name/avatar/skills/bio), 
-- but only owner can update
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Projects:
-- Open projects viewable by freelancers
-- Participants (client/freelancer) can see their own
-- Admins see everything
create policy "Users can view relevant projects"
  on projects for select
  using (
    status = 'open' 
    or client_id = auth.uid() 
    or exists (
      select 1 from contracts 
      where contracts.project_id = projects.id 
      and contracts.freelancer_id = auth.uid()
    )
    or is_admin()
  );

create policy "Clients can manage their own projects"
  on projects for all
  using (client_id = auth.uid() or is_admin());

-- Proposals:
-- Freelancers see their own proposals
-- Clients see proposals for their projects
create policy "Freelancers can manage own proposals"
  on proposals for all
  using (freelancer_id = auth.uid() or is_admin());

create policy "Clients can view proposals for their projects"
  on proposals for select
  using (exists (
    select 1 from projects
    where projects.id = proposals.project_id
    and projects.client_id = auth.uid()
  ) or is_admin());

-- Contracts:
-- Participants (client/freelancer) can see their contracts
create policy "Participants can view their contracts"
  on contracts for select
  using (auth.uid() = client_id or auth.uid() = freelancer_id or is_admin());

-- Kanban/Tasks:
-- Contract participants can manage
create policy "Contract participants can view kanban"
  on kanban_columns for select
  using (exists (
    select 1 from contracts
    where contracts.id = kanban_columns.contract_id
    and (contracts.client_id = auth.uid() or contracts.freelancer_id = auth.uid())
  ) or is_admin());

create policy "Contract participants can manage kanban"
  on kanban_columns for all
  using (exists (
    select 1 from contracts
    where contracts.id = kanban_columns.contract_id
    and (contracts.client_id = auth.uid() or contracts.freelancer_id = auth.uid())
  ) or is_admin());

create policy "Contract participants can view tasks"
  on tasks for select
  using (exists (
    select 1 from contracts
    where contracts.id = tasks.contract_id
    and (contracts.client_id = auth.uid() or contracts.freelancer_id = auth.uid())
  ) or is_admin());

create policy "Contract participants can manage tasks"
  on tasks for all
  using (exists (
    select 1 from contracts
    where contracts.id = tasks.contract_id
    and (contracts.client_id = auth.uid() or contracts.freelancer_id = auth.uid())
  ) or is_admin());

-- Conversations/Messages:
-- Participants can view
create policy "Participants can view conversations"
  on conversations for select
  using (auth.uid() = any(participant_ids) or is_admin());

create policy "Participants can view messages"
  on messages for select
  using (exists (
    select 1 from conversations
    where conversations.id = messages.conversation_id
    and auth.uid() = any(conversations.participant_ids)
  ) or is_admin());

create policy "Participants can send messages"
  on messages for insert
  with check (auth.uid() = sender_id and exists (
    select 1 from conversations
    where conversations.id = messages.conversation_id
    and auth.uid() = any(conversations.participant_ids)
  ));

-- Payments/Invoices:
-- Participants can view
create policy "Participants can view payments"
  on payments for select
  using (auth.uid() = client_id or auth.uid() = freelancer_id or is_admin());

create policy "Participants can view invoices"
  on invoices for select
  using (exists (
    select 1 from contracts
    where contracts.id = invoices.contract_id
    and (contracts.client_id = auth.uid() or contracts.freelancer_id = auth.uid())
  ) or is_admin());

-- Notifications:
-- Users see their own
create policy "Users can view own notifications"
  on notifications for select
  using (auth.uid() = user_id or is_admin());

create policy "Users can update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

-- 5. Automation (Triggers)

-- Automatically handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role, is_active)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client'::user_role),
    true
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on profiles for each row execute procedure update_updated_at_column();
create trigger update_projects_updated_at before update on projects for each row execute procedure update_updated_at_column();
create trigger update_proposals_updated_at before update on proposals for each row execute procedure update_updated_at_column();
create trigger update_contracts_updated_at before update on contracts for each row execute procedure update_updated_at_column();
create trigger update_kanban_columns_updated_at before update on kanban_columns for each row execute procedure update_updated_at_column();
create trigger update_tasks_updated_at before update on tasks for each row execute procedure update_updated_at_column();
create trigger update_conversations_updated_at before update on conversations for each row execute procedure update_updated_at_column();
create trigger update_payments_updated_at before update on payments for each row execute procedure update_updated_at_column();
create trigger update_invoices_updated_at before update on invoices for each row execute procedure update_updated_at_column();

-- Notify all freelancers of new projects
create or replace function public.notify_freelancers_of_new_project()
returns trigger as $$
begin
  insert into public.notifications (user_id, type, title, message, metadata)
  select 
    id, 
    'project_posted', 
    'New Project Posted!', 
    'A new project "' || new.title || '" has been posted in ' || coalesce(new.category, 'General') || '.',
    jsonb_build_object('project_id', new.id)
  from public.profiles
  where role = 'freelancer';
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_project_created
  after insert on public.projects
  for each row execute procedure public.notify_freelancers_of_new_project();
