require('dotenv').config();

const databaseOptions = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
}

export const config = {
    DATABASE_OPTIONS: databaseOptions,
    SNS_ARN: process.env.SNS_ARN,
    EMAIL_SUCCESS: process.env.EMAIL_SUCCESS,
    EMAIL_FAILED: process.env.EMAIL_FAILED
};