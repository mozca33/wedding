-- Permite RSVPs sem email e com telefones repetidos (responsáveis cadastrando crianças)
ALTER TABLE rsvp ALTER COLUMN email DROP NOT NULL;

DO $$
DECLARE r record;
BEGIN
	FOR r IN
		SELECT conname FROM pg_constraint
		WHERE conrelid = 'rsvp'::regclass
		  AND contype = 'u'
		  AND (conname ILIKE '%email%' OR conname ILIKE '%phone%')
	LOOP
		EXECUTE format('ALTER TABLE rsvp DROP CONSTRAINT %I', r.conname);
	END LOOP;
END $$;

DROP INDEX IF EXISTS rsvp_email_key;
DROP INDEX IF EXISTS rsvp_phone_key;
