insert into storage.buckets (id, name, public, allowed_mime_types)
values (
  'incident-photos',
  'incident-photos',
  false,
  array['image/jpeg']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Authenticated users can upload incident photos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'incident-photos');
