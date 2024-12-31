-- Create service_usage table
create table public.service_usage (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  service_name text not null,
  input_image_timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  input_image_url text not null,
  output_image_timestamp timestamp with time zone,
  output_image_url text,
  tokens_deducted integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.service_usage enable row level security;

-- Create policies
create policy "Users can view own service usage" 
  on public.service_usage for select 
  using (auth.uid() = user_id);

create policy "Users can insert own service usage" 
  on public.service_usage for insert 
  with check (auth.uid() = user_id);

-- Create trigger for updating timestamp
create trigger set_service_usage_updated_at
  before update on public.service_usage
  for each row execute procedure public.set_updated_at();