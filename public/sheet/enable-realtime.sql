-- Enable realtime for gifts table
ALTER PUBLICATION supabase_realtime ADD TABLE gifts;

-- Also enable for gift_orders if you want real-time order updates
ALTER PUBLICATION supabase_realtime ADD TABLE gift_orders;

-- Verify realtime is enabled
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
