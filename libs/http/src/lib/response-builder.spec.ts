import { it, describe, expect, beforeEach } from 'vitest';
import ResponseBuilder from './response-builder';

async function streamToString(stream: ReadableStream | null): Promise<string> {
  return stream ? new Response(stream).text() : '';
}

describe('ResponseBuilder', () => {
  let responseBuilder: ResponseBuilder;

  beforeEach(() => {
    responseBuilder = new ResponseBuilder();
  });

  it('should set status code', () => {
    const response = responseBuilder
      .setStatus(200)
      .json({ message: 'Success' });

    expect(response.status).toBe(200);
  });

  it('should set headers', () => {
    const headers = { 'X-Test-Header': '' };
    const response = responseBuilder
      .setHeaders(headers)
      .json({ message: 'Success' });

    expect(response.headers.get('Content-Type')).toBe('application/json');
  });

  it('should create JSON response', async () => {
    const response = responseBuilder.json({ message: 'Success' });

    expect(await streamToString(response.body)).toBe(
      JSON.stringify({ message: 'Success' })
    );
  });

  it('should create text response', async () => {
    const response = responseBuilder.text('Hello, world!');

    expect(response.headers.get('Content-Type')).toBe('text/plain');
    expect(await streamToString(response.body)).toBe('Hello, world!');
  });

  it('should create HTML response', async () => {
    const response = responseBuilder.html('<h1>Hello, world!</h1>');

    expect(response.headers.get('Content-Type')).toBe('text/html');
    expect(await streamToString(response.body)).toBe('<h1>Hello, world!</h1>');
  });

  it('should create redirect response', () => {
    const response = responseBuilder.redirect('https://example.com/home');

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('https://example.com/home');
  });

  it('should create error response', async () => {
    const response = responseBuilder.error('Internal Server Error', 500);

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await streamToString(response.body)).toBe(
      JSON.stringify({ error: 'Internal Server Error' })
    );
  });

  it('should create raw response', async () => {
    const response = responseBuilder.raw('Raw data', {
      headers: { 'X-Custom-Header': 'Custom Value' },
      statusText: 'Custom Status',
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Custom-Header')).toBe('Custom Value');
    expect(response.statusText).toBe('Custom Status');
    expect(await streamToString(response.body)).toBe('Raw data');
  });
});

describe('ResponseBuilder Static', () => {
  it('should create success response', async () => {
    const response = ResponseBuilder.success({ message: 'Success' });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await streamToString(response.body)).toBe(
      JSON.stringify({ message: 'Success' })
    );
  });

  it('should create created response', async () => {
    const response = ResponseBuilder.created({ message: 'Created' });

    expect(response.status).toBe(201);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await streamToString(response.body)).toBe(
      JSON.stringify({ message: 'Created' })
    );
  });

  it('should create no content response', async () => {
    const response = ResponseBuilder.noContent();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBeNull();
    expect(await streamToString(response.body)).toBe('');
  });

  it('should create bad request response', async () => {
    const response = ResponseBuilder.badRequest('Bad Request');

    expect(response.status).toBe(400);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await streamToString(response.body)).toBe(
      JSON.stringify({ error: 'Bad Request' })
    );
  });

  it('should create unauthorized response', async () => {
    const response = ResponseBuilder.unauthorized('Unauthorized');

    expect(response.status).toBe(401);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await streamToString(response.body)).toBe(
      JSON.stringify({ error: 'Unauthorized' })
    );
  });

  it('should create forbidden response', async () => {
    const response = ResponseBuilder.forbidden('Forbidden');

    expect(response.status).toBe(403);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await streamToString(response.body)).toBe(
      JSON.stringify({ error: 'Forbidden' })
    );
  });

  it('should create not found response', async () => {
    const response = ResponseBuilder.notFound('Not Found');

    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await streamToString(response.body)).toBe(
      JSON.stringify({ error: 'Not Found' })
    );
  });

  it('should create server error response', async () => {
    const response = ResponseBuilder.serverError('Internal Server Error');

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await streamToString(response.body)).toBe(
      JSON.stringify({ error: 'Internal Server Error' })
    );
  });
});
