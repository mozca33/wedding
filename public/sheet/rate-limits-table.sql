-- Tabela usada por lib/rateLimit.ts para throttling de RSVP/orders por IP.
-- Rode uma vez no Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS rate_limits (
	id BIGSERIAL PRIMARY KEY,
	key TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rate_limits_key_created_at_idx
	ON rate_limits (key, created_at DESC);

-- Limpeza: registros velhos não servem pra nada
-- Rode periodicamente (ou crie um cron) para evitar inchar a tabela:
-- DELETE FROM rate_limits WHERE created_at < now() - INTERVAL '1 day';

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
-- Sem policies = ninguém via anon key. Service role (usado nas API routes) bypassa RLS.
