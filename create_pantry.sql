-- Create the pantry_items table if it doesn't exist
create table if not exists public.pantry_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  quantity numeric,
  unit text,
  expiry_date date,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.pantry_items enable row level security;

-- Create policies
create policy "Users can view their own pantry items"
  on public.pantry_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own pantry items"
  on public.pantry_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own pantry items"
  on public.pantry_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own pantry items"
  on public.pantry_items for delete
  using (auth.uid() = user_id);
