CREATE TABLE stock
(
    product_id uuid,
    count integer,
    foreign key ("product_id") references product ("id")
)