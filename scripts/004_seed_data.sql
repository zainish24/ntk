-- North Town Residency - Seed Data
-- UPDATED: Simplified blocks and default admin

-- Insert Phases
INSERT INTO public.phases (name, location, description, display_order, is_active) VALUES
('Phase 1', 'Near 4K Chowrangi', 'The flagship phase of North Town Residency with premium commercial and residential options.', 1, true),
('Phase 2', 'Hub Dam Road', 'Modern development along Hub Dam Road with diverse block options.', 2, true),
('Phase 4', 'Near Gulshan e Maymar', 'Latest phase offering residential plots near Gulshan e Maymar.', 3, true)
ON CONFLICT (name) DO NOTHING;

-- Insert Blocks for Phase 1
INSERT INTO public.blocks (phase_id, name, block_type, description, is_active)
SELECT p.id, b.name, b.block_type, b.description, true
FROM public.phases p
CROSS JOIN (VALUES
  ('Titanium Block', 'mixed', 'Premium block with residential and commercial options'),
  ('GFS Mega Bazaar', 'commercial', 'Large commercial complex with diverse shops'),
  ('Chase Mall', 'commercial', 'Modern shopping mall with retail spaces'),
  ('Mehran Block', 'residential', 'Family-friendly residential area')
) AS b(name, block_type, description)
WHERE p.name = 'Phase 1'
ON CONFLICT (phase_id, name) DO NOTHING;

-- Insert Blocks for Phase 2
INSERT INTO public.blocks (phase_id, name, block_type, description, is_active)
SELECT p.id, b.name, b.block_type, b.description, true
FROM public.phases p
CROSS JOIN (VALUES
  ('Block A', 'residential', 'Residential plots'),
  ('Block B', 'residential', 'Residential plots'),
  ('Premium Block', 'mixed', 'Premium block with exclusive plots'),
  ('Commercial', 'commercial', 'Commercial shops and offices')
) AS b(name, block_type, description)
WHERE p.name = 'Phase 2'
ON CONFLICT (phase_id, name) DO NOTHING;

-- Insert Blocks for Phase 4
INSERT INTO public.blocks (phase_id, name, block_type, description, is_active)
SELECT p.id, b.name, b.block_type, b.description, true
FROM public.phases p
CROSS JOIN (VALUES
  ('Block C', 'residential', 'New residential development'),
  ('Block D', 'residential', 'Premium residential plots')
) AS b(name, block_type, description)
WHERE p.name = 'Phase 4'
ON CONFLICT (phase_id, name) DO NOTHING;

-- Insert default admin profile
INSERT INTO public.profiles (id, phone, full_name, role) VALUES
('11111111-1111-1111-1111-111111111111', '+923001234567', 'NTR Admin', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT 'Seed data complete!' as status;
SELECT COUNT(*) as phases FROM public.phases;
SELECT COUNT(*) as blocks FROM public.blocks;
