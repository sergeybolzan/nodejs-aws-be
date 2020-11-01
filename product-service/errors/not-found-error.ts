export class NotFoundError extends Error {

  public statusCode: number;

  constructor(entity: string) {
    super(`${entity} not found`);
    this.statusCode = 404;
  }
}