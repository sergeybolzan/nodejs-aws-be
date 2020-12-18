# nodejs-aws-be
Frontend: https://github.com/sergeybolzan/nodejs-aws-fe

Cart api: https://github.com/sergeybolzan/rs-cart-api

## Product service swagger link:
[https://app.swaggerhub.com/apis/sergeybolzan/product-service/1.0.0](https://app.swaggerhub.com/apis/sergeybolzan/product-service/1.0.0)

##Serverless
Template names:
- aws-nodejs
- aws-nodejs-typescript

Generate serverless template:
```bash
sls create --template "templateName" --path "folderName"
```

Deploy:
```bash
sls deploy
```

Test local function:
```bash
sls invoke local --function "functionName"
```

Test local function with the event:
```bash
sls invoke local --function getProductsById --path test-event.json
```