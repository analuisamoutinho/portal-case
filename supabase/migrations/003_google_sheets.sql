-- Vinculação de planilhas Google Sheets por cliente
ALTER TABLE clients ADD COLUMN IF NOT EXISTS google_sheet_id TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS google_sheet_last_sync TIMESTAMPTZ;

-- Campos extras em oportunidades (para refletir o que a CASE preenche na planilha)
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS deadline TEXT;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS workflow_status TEXT DEFAULT 'nova'
  CHECK (workflow_status IN ('nova','em_analise','aprovada'));

-- Campos extras em reuniões
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS meeting_time TEXT;
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS duration_minutes INT;
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS meeting_type TEXT;
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS agenda TEXT; -- pipe-separated items

-- Campos extras em materiais
ALTER TABLE materials ADD COLUMN IF NOT EXISTS file_size TEXT;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE materials ADD COLUMN IF NOT EXISTS preview_url TEXT;

-- Campos extras em content_items para planejamento
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS theme TEXT;
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS copy TEXT;
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS hashtags TEXT;
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS week_label TEXT;
