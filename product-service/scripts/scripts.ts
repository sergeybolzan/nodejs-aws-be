export const scripts = {
    getProducts: `SELECT p.id,
                         p.title,
                         p.description,
                         p.price,
                         s.count
                  FROM product p
                           INNER JOIN stock s ON p.id = s.product_id`,

    getProductById: `SELECT p.id,
                            p.title,
                            p.description,
                            p.price,
                            s.count
                     FROM product p
                              INNER JOIN stock s ON p.id = s.product_id
                     WHERE p.id = $1`,

    createProduct: `INSERT INTO product(title, description, price)
                    VALUES ($1, $2, $3)
                    RETURNING id`,

    createStock: `INSERT INTO stock(product_id, count)
                  VALUES ($1, $2)`,

    createProducts: values => `INSERT INTO product(title, description, price) VALUES ${values}
                               RETURNING id`,

    createStocks: values => `INSERT INTO stock(product_id, count) VALUES ${values}`
};
