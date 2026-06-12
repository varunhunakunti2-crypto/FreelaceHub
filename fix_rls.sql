
-- Fix RLS policies for contracts
create policy "Clients can create contracts"
  on contracts for insert
  with check (auth.uid() = client_id or is_admin());

create policy "Participants can update their contracts"
  on contracts for update
  using (auth.uid() = client_id or auth.uid() = freelancer_id or is_admin());

-- Fix RLS policies for proposals (allow clients to update status)
create policy "Clients can update proposal status"
  on proposals for update
  using (exists (
    select 1 from projects
    where projects.id = proposals.project_id
    and projects.client_id = auth.uid()
  ) or is_admin())
  with check (status in ('accepted', 'rejected'));
