export class AppErrorHandler extends Error {
  type = '';
  constructor(type: string, message: string) {
    super(message);
    this.type = type;
  }
}
