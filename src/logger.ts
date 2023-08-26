export class Logger {
  public debug(message: string): void {
    // eslint-disable-next-line no-console
    console.debug(message);
  }

  public info(message: string): void {
    // eslint-disable-next-line no-console
    console.log(message);
  }

  public warning(message: string): void {
    console.warn(message);
  }

  public error(message: string): void {
    console.error(message);
  }

  public exception(error: unknown, message: string): void {
    let errorProp = error;
    if (error !== undefined && error instanceof Error && error.stack !== undefined) {
      errorProp = error.stack.split('\n').map(l => l.trim());
    }
    console.error(message, errorProp);
  }
}
