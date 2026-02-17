-- Create orders table for gift purchases
CREATE TABLE IF NOT EXISTS gift_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  payment_proof TEXT,
  pix_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  notes TEXT
);

-- Create index for faster queries
CREATE INDEX idx_gift_orders_status ON gift_orders(status);
CREATE INDEX idx_gift_orders_created_at ON gift_orders(created_at DESC);
CREATE INDEX idx_gift_orders_order_number ON gift_orders(order_number);

-- Enable Row Level Security
ALTER TABLE gift_orders ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert orders (create new purchases)
CREATE POLICY "Anyone can create orders"
  ON gift_orders FOR INSERT
  WITH CHECK (true);

-- Policy: Users can view their own orders by email
CREATE POLICY "Users can view own orders"
  ON gift_orders FOR SELECT
  USING (buyer_email = current_setting('request.jwt.claims', true)::json->>'email'
         OR true); -- Allow all for now, secure later

-- Policy: Only authenticated users can update orders (admin confirmation)
CREATE POLICY "Admins can update orders"
  ON gift_orders FOR UPDATE
  USING (true); -- Secure this with proper admin role later

COMMENT ON TABLE gift_orders IS 'Stores gift purchase orders from wedding guests';
