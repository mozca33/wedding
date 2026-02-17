-- Step 1: Drop the old category constraint
ALTER TABLE gifts DROP CONSTRAINT IF EXISTS gifts_category_check;

-- Step 2: Add new constraint with all categories including the new one
ALTER TABLE gifts ADD CONSTRAINT gifts_category_check
CHECK (category IN ('cozinha', 'limpeza', 'cama-e-banho', 'para-a-vida-de-casados'));

-- Step 3: Verify constraint was updated
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'gifts'::regclass
AND conname = 'gifts_category_check';
