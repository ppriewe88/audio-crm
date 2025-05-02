"""XXX TODO: Add a description of the file here."""

get_storage_info = """
SELECT il.id, il.name, i.stock 
FROM inventory i 
JOIN inventory_storagelocations il ON i.storage_location_id = il.id 
WHERE i.product_id = [PLACEHOLDER];"""