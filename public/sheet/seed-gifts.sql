-- Complete seed script for gifts table
-- Contains only items with value >= R$100
-- Run this in Supabase SQL Editor to update your gifts

-- Clear existing data
TRUNCATE TABLE gifts RESTART IDENTITY;

-- ==================== COZINHA (26 items) ====================
INSERT INTO gifts (category, name, price, quantity, image, reserved, sold) VALUES
('cozinha', 'Kit Bowls de vidro 5pçs', 150, 3, '/images/gifts/Bowls de vidro.png', 0, 0),
('cozinha', 'Kit Bowls de Inox 5pçs', 150, 3, '/images/gifts/Bowls inox.png', 0, 0),
('cozinha', 'Kit potes de Inox com tampa 5pçs', 130, 3, '/images/gifts/Bowl inox tampa.jpg', 0, 0),
('cozinha', 'Kit Colheres de pau 6pçs', 140, 1, '/images/gifts/Kit colher de pau.png', 0, 0),
('cozinha', 'Kit Utensílios para servir 5pçs', 100, 2, '/images/gifts/Kit utensilios par servir.png', 0, 0),
('cozinha', 'Faca Profissional', 200, 2, '/images/gifts/Faca profissional.png', 0, 0),
('cozinha', 'Jogo de facas 10pçs', 100, 1, '/images/gifts/Jogo de Facas.png', 0, 0),
('cozinha', 'Escorredor de louça e talheres', 120, 1, '/images/gifts/escorredor de louça.png', 0, 0),
('cozinha', 'Frigideira Inox', 200, 2, '/images/gifts/frigideira inox.jpg', 0, 0),
('cozinha', 'Kit Panelas 8pçs', 650, 1, '/images/gifts/kit panelas.png', 0, 0),
('cozinha', 'Kit Tábuas de corte 3pçs', 130, 1, '/images/gifts/tabuas de corte.jpg', 0, 0),
('cozinha', 'Kit Travessa/refratários 3pçs', 200, 4, '/images/gifts/travessas refratarias.jpg', 0, 0),
('cozinha', 'Sanduicheira', 120, 1, '/images/gifts/sanduicheira.png', 0, 0),
('cozinha', 'Air Fryer', 300, 1, '/images/gifts/airfryer.png', 0, 0),
('cozinha', 'Forno', 500, 1, '/images/gifts/forno.png', 0, 0),
('cozinha', 'Batedeira', 450, 1, '/images/gifts/batedeira.png', 0, 0),
('cozinha', 'Liquidificador', 180, 1, '/images/gifts/liquidificador.png', 0, 0),
('cozinha', 'Mixer', 100, 1, '/images/gifts/mixer 3 em 1.png', 0, 0),
('cozinha', 'Panela de Pressão', 185, 1, '/images/gifts/panela de pressão.png', 0, 0),
('cozinha', 'Filtro de água', 700, 1, '/images/gifts/filtro de agua.png', 0, 0),
('cozinha', 'Jogo de xícaras e pires 12pçs', 170, 2, '/images/gifts/jogo de xicaras e pires.jpg', 0, 0),
('cozinha', 'Jogo de jantar completo 30pçs', 700, 1, '/images/gifts/jogo de jantar.png', 0, 0),
('cozinha', 'Jogo de pratos rasos 6pçs', 180, 3, '/images/gifts/prato raso.jpg', 0, 0),
('cozinha', 'Jogo de pratos de sobremesa 6pçs', 100, 3, '/images/gifts/pratos de sobremesa.jpg', 0, 0),
('cozinha', 'Jogo de tijelas 6pçs', 150, 3, '/images/gifts/tijelas.jpg', 0, 0),
('cozinha', 'Jogo de Taças 6pçs', 100, 1, '/images/gifts/taças.jpg', 0, 0);

-- ==================== LIMPEZA (2 items) ====================
INSERT INTO gifts (category, name, price, quantity, image, reserved, sold) VALUES
('limpeza', 'Ferro de passar roupa', 100, 1, '/images/gifts/ferro de passar.jpg', 0, 0),
('limpeza', 'Aspirador de pó', 200, 1, '/images/gifts/aspirador de pó.png', 0, 0);

-- ==================== CAMA E BANHO (3 items) ====================
INSERT INTO gifts (category, name, price, quantity, image, reserved, sold) VALUES
('cama-e-banho', 'Jogo de cama de casal', 430, 4, '/images/gifts/jogo de cama png.png', 0, 0),
('cama-e-banho', 'Edredom de casal', 550, 2, '/images/gifts/edredom.png', 0, 0),
('cama-e-banho', 'Jogo de banho', 350, 4, '/images/gifts/jogo de banho.png', 0, 0);

-- Total: 31 items (Cozinha: 26, Limpeza: 2, Cama e Banho: 3)
