-- Fix ghost reservations (items reserved but no active orders)
-- Run this to clean up any stuck reservations

-- Step 1: See which gifts have reservations
SELECT
  g.id,
  g.name,
  g.quantity as total,
  g.reserved,
  g.sold,
  (g.quantity - g.reserved - g.sold) as available,
  -- Count pending orders for this gift
  (
    SELECT COALESCE(SUM((items->>i->>'quantity')::int), 0)
    FROM gift_orders,
    LATERAL jsonb_array_elements(items) WITH ORDINALITY AS t(item, i)
    WHERE status = 'pending'
    AND item->>'giftId' = g.id::text
  ) as pending_orders_qty
FROM gifts g
WHERE g.reserved > 0
ORDER BY g.name;

-- Step 2: Reset reservations to match actual pending orders
-- WARNING: This will fix ghost reservations!
UPDATE gifts g
SET reserved = (
  SELECT COALESCE(SUM((items->>i->>'quantity')::int), 0)
  FROM gift_orders,
  LATERAL jsonb_array_elements(items) WITH ORDINALITY AS t(item, i)
  WHERE status = 'pending'
  AND item->>'giftId' = g.id::text
)
WHERE reserved > 0;

-- Step 3: Verify the fix
SELECT
  name,
  quantity as total,
  reserved,
  sold,
  (quantity - reserved - sold) as available
FROM gifts
WHERE reserved > 0 OR sold > 0
ORDER BY name;
