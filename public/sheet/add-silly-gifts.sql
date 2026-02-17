-- Add "Para a vida de casados" gifts
-- All gifts have quantity = 999

INSERT INTO gifts (category, name, price, quantity, image, reserved, sold) VALUES
('para-a-vida-de-casados', 'Avental Rafa e Ju', 50, 999, '/images/gifts/silly/avental rafa e ju.png', 0, 0),
('para-a-vida-de-casados', 'Bateria Eletrônica', 30000, 999, '/images/gifts/silly/bateria eletronica.png', 0, 0),
('para-a-vida-de-casados', 'Bateria Turma do Rock', 300, 999, '/images/gifts/silly/bateria turma do rock.png', 0, 0),
('para-a-vida-de-casados', 'Café', 100, 999, '/images/gifts/silly/cafe.png', 0, 0),
('para-a-vida-de-casados', 'Cuequinha Sexy', 30, 999, '/images/gifts/silly/cuequinha sexy.png', 0, 0),
('para-a-vida-de-casados', 'Emo', 70, 999, '/images/gifts/silly/emo.png', 0, 0),
('para-a-vida-de-casados', 'Fantasia Rafa e Ju', 275, 999, '/images/gifts/silly/fantasia rafa e ju.png', 0, 0),
('para-a-vida-de-casados', 'Keychron', 2200, 999, '/images/gifts/silly/keychron.png', 0, 0),
('para-a-vida-de-casados', 'KitchenAid', 3000, 999, '/images/gifts/silly/kitchenaid.png', 0, 0),
('para-a-vida-de-casados', 'Luffy', 672, 999, '/images/gifts/silly/luffy.jpg', 0, 0),
('para-a-vida-de-casados', 'Pop Cat Eat Chocolate', 20, 999, '/images/gifts/silly/Pop cat eat chocolate.jpg', 0, 0),
('para-a-vida-de-casados', 'Urubici', 111, 999, '/images/gifts/silly/urubici.jpg', 0, 0),
('para-a-vida-de-casados', 'Zoro', 713.99, 999, '/images/gifts/silly/zoro.png', 0, 0);

-- Verify the new gifts were added
SELECT
  name,
  price,
  quantity,
  image
FROM gifts
WHERE category = 'para-a-vida-de-casados'
ORDER BY name;

-- Summary
SELECT
  category,
  COUNT(*) as total_gifts,
  SUM(quantity) as total_quantity
FROM gifts
GROUP BY category
ORDER BY category;
