export const createResponse = (statusCode: number, body: any) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {"Access-Control-Allow-Origin": "*"}
});