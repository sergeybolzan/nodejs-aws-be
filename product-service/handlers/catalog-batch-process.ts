import {Client} from 'pg';
import {SNS} from 'aws-sdk';
import {config} from '../common/config';
import {scripts} from '../scripts/scripts';
import {SQSEvent, SQSHandler} from 'aws-lambda';
import {errorHandler} from '../common/error-handler';

export const catalogBatchProcess: SQSHandler = errorHandler(async (event: SQSEvent, _, callback: Function) => {
  const client: Client = new Client(config.databaseOptions);
  await client.connect();

  let products: Product[];
  try {
    products = event.Records.map(({body}) => JSON.parse(body));

    await client.query('BEGIN');

    let productsValues: string = products.reduce((acc: string, product: Product) => acc + `('${product.title}', '${product.description}', '${product.price}'),`, '');
    productsValues = removeLastSymbol(productsValues);
    const response = await client.query(scripts.createProducts(productsValues));

    let stocksValues: string = response.rows.reduce((acc: string, row, index: number) => acc + `('${row.id}', '${products[index].count}'),`, '');
    stocksValues = removeLastSymbol(stocksValues);
    await client.query(scripts.createStocks(stocksValues));

    await client.query('COMMIT');
    console.log('Products added to database: ', products);
  } catch (e) {
    await client.query('ROLLBACK');
    console.log('ROLLBACK queries with products: ', products);
    throw e;
  } finally {
    client.end();
  }

  const sns = new SNS({region: 'eu-west-1'});
  sns.publish({
    Subject: 'Products created',
    Message: JSON.stringify(products),
    TopicArn: config.SNS_ARN
  }, () => {
    console.log('Email sent');
  });

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: 'SQS event processed'
    })
  });
});

const removeLastSymbol = (str: string) => str.slice(0, -1);