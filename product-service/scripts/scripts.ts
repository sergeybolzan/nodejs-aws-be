export const scripts = {
    getProducts: `SELECT product.id,
                         product.title,
                         product.description,
                         product.price,
                         stock.count
                  FROM product
                           INNER JOIN stock ON product.id = stock.product_id`,
    getProductById: `SELECT product.id,
                        product.title,
                        product.description,
                        product.price,
                        stock.count
                 FROM product
                          INNER JOIN stock ON product.id = stock.product_id
                 WHERE product.id = '%s'`
};
