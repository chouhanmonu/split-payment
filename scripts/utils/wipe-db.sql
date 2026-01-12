BEGIN;

-- Store expected DB name in session
SET app.expected_db TO :'EXPECTED_DB';

-- Safety check
DO $$
BEGIN
   IF current_database() <> current_setting('app.expected_db') THEN
    RAISE EXCEPTION
      '❌ Refusing to wipe DB %. Expected %',
      current_database(),
      current_setting('app.expected_db');
  END IF;
END $$;

-- Wipe data
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public'
      AND tablename NOT IN (
        'migrations',
        'typeorm_metadata'
      )

  LOOP
    EXECUTE format(
      'TRUNCATE TABLE public.%I RESTART IDENTITY CASCADE;',
      r.tablename
    );
  END LOOP;
END $$;

COMMIT;
