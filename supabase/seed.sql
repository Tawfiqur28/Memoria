insert into public.patient_profiles (
  id,
  full_name,
  age,
  phone_number,
  hometown,
  spouse_name,
  children,
  pets,
  hobbies,
  daily_routine,
  trigger_topics
) values (
  '11111111-1111-1111-1111-111111111111',
  'Margaret Hill',
  74,
  '+447000111222',
  'Leeds',
  'Thomas Hill',
  '["David Hill", "Sophie Hill"]'::jsonb,
  '["Milo the cat"]'::jsonb,
  '["gardening", "crosswords", "tea with neighbors"]'::jsonb,
  '[
    {"time":"07:30","activity":"Morning tea"},
    {"time":"09:00","activity":"Short walk"},
    {"time":"12:30","activity":"Lunch"},
    {"time":"16:00","activity":"Phone call with family"}
  ]'::jsonb,
  '{"bereavement details", "financial scams"}'
) on conflict do nothing;

insert into public.contacts (
  patient_id,
  full_name,
  relationship,
  phone_number,
  photo_url,
  memory_notes,
  shared_memories,
  last_interaction_at,
  city
) values
(
  '11111111-1111-1111-1111-111111111111',
  'David Hill',
  'Son',
  '+447123456789',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
  '{"Calls every Sunday","Lives in London","Works in architecture"}',
  '["Visited last Christmas","Helped paint the kitchen"]'::jsonb,
  now() - interval '2 days',
  'London'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Sophie Hill',
  'Daughter',
  '+447111222333',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  '{"Prefers video calls","Has two children"}',
  '["Beach trip in Brighton","Birthday party in 2022"]'::jsonb,
  now() - interval '5 days',
  'Manchester'
)
on conflict do nothing;

insert into public.life_facts (patient_id, category, fact) values
('11111111-1111-1111-1111-111111111111', 'career', 'Retired primary school teacher'),
('11111111-1111-1111-1111-111111111111', 'health', 'Prefers calm and short explanations'),
('11111111-1111-1111-1111-111111111111', 'routine', 'Tea every morning at 7:30')
on conflict do nothing;

insert into public.caregivers (patient_id, full_name, email, phone_number) values
('11111111-1111-1111-1111-111111111111', 'Nina Carter', 'nina@example.com', '+447999111222')
on conflict do nothing;
