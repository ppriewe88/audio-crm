"""XXX TODO: Add a description of the file here."""

get_storage_info = """
SELECT il.id, il.name, i.stock 
FROM inventory i 
JOIN inventory_storagelocations il ON i.storage_location_id = il.id 
WHERE i.product_id = [product_id];"""

insert_order = """
INSERT INTO orders (customer_id, product_id, quantity, status_id)
VALUES ([customer_id], [product_id], [quantity], 1)"""

get_inserted_order = """
SELECT TOP 1 o.id AS order_id, o.customer_id, o.product_id, o.quantity, os.name AS status
FROM orders o
JOIN orders_status os ON o.status_id = os.id
WHERE o.customer_id = [customer_id]
ORDER BY o.created_at DESC;"""

get_corresponding_invoice = """
SELECT i.id, i.order_id, i.total_price, i.total_discount, i.total_price_discounted, i.due_limit, FORMAT(i.due_date, 'yyyy-MM-dd') AS due_date, i.overdue_fee, i.status_id, invs.name AS status
FROM invoices i
JOIN invoices_status invs ON invs.id = i.status_id
WHERE i.order_id = [order_id]"""

get_corresponding_pair = """
SELECT * 
FROM vw_0Aufträge
WHERE Bestell_ID = [order_id]"""