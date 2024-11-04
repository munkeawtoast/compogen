export type ResponseOptions = {
  headers?: Record<string, string>;
  statusText?: string;
};

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

class ResponseBuilder<T extends JSONValue = JSONValue> {
  private status: number;
  private headers: Headers;

  constructor(
    initialStatus = 200,
    initialHeaders: Record<string, string> = {}
  ) {
    this.status = initialStatus;
    this.headers = new Headers(initialHeaders);
  }

  public setStatus(code: number): this {
    this.status = code;
    return this;
  }

  public setHeaders(headers: Record<string, string>): this {
    Object.entries(headers).forEach(([key, value]) => {
      this.headers.set(key, value);
    });
    return this;
  }

  public json(data: T): Response {
    this.headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify(data), {
      status: this.status,
      headers: this.headers,
    });
  }

  public text(data: string): Response {
    this.headers.set('Content-Type', 'text/plain');
    return new Response(data, {
      status: this.status,
      headers: this.headers,
    });
  }

  public html(html: string): Response {
    this.headers.set('Content-Type', 'text/html');
    return new Response(html, {
      status: this.status,
      headers: this.headers,
    });
  }

  public redirect(url: string, status = 302): Response {
    return Response.redirect(url, status);
  }

  public error(message: string, status = 500): Response {
    this.headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: this.headers,
    });
  }

  public raw(body: BodyInit | null, options: ResponseOptions = {}): Response {
    return new Response(body, {
      status: this.status,
      headers: new Headers({
        ...Object.fromEntries(this.headers.entries()),
        ...options.headers,
      }),
      statusText: options.statusText,
    });
  }

  // Static factory methods for common responses
  public static success<T extends JSONValue>(data: T): Response {
    return new ResponseBuilder<T>().json(data);
  }

  public static created<T extends JSONValue>(data: T): Response {
    return new ResponseBuilder<T>(201).json(data);
  }

  public static noContent(): Response {
    return new ResponseBuilder().raw(null);
  }

  public static badRequest(message: string): Response {
    return new ResponseBuilder().error(message, 400);
  }

  public static unauthorized(message = 'Unauthorized'): Response {
    return new ResponseBuilder().error(message, 401);
  }

  public static forbidden(message = 'Forbidden'): Response {
    return new ResponseBuilder().error(message, 403);
  }

  public static notFound(message = 'Not Found'): Response {
    return new ResponseBuilder().error(message, 404);
  }

  public static serverError(message = 'Internal Server Error'): Response {
    return new ResponseBuilder().error(message, 500);
  }
}

export default ResponseBuilder;
