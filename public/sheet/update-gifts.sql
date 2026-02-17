-- SQL Script to update gifts in Supabase
-- 1. Remove all gifts with price < 100
-- 2. Add the new "cama-e-banho" category items

-- First, delete all gifts with price under 100
DELETE FROM gifts WHERE CAST(price AS DECIMAL) < 100;

-- Insert new "Cama e Banho" category items (if they don't exist)
INSERT INTO gifts (category, name, price, quantity, image, reserved, sold)
VALUES
  ('cama-e-banho', 'Jogo de cama de casal', 430, 4, '/images/gifts/jogo de cama png.png', 0, 0),
  ('cama-e-banho', 'Edredom de casal', 550, 2, '/images/gifts/edredom.png', 0, 0),
  ('cama-e-banho', 'Jogo de banho', 350, 4, '/images/gifts/jogo de banho.png', 0, 0)
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  quantity = EXCLUDED.quantity,
  image = EXCLUDED.image;

-- Verify remaining gifts (should only have items >= 100)
-- SELECT * FROM gifts ORDER BY category, name;
