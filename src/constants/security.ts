/** Payloads and expectations for the opt-in security suite. */

export const safeApiStatuses = [200, 400, 404, 422] as const;

export const sqlErrorPatterns = [
  /sqlsyntaxerror/i,
  /syntax error at or near/i,
  /you have an error in your sql/i,
  /unclosed quotation mark/i,
  /pg_query/i,
  /psycopg|sqlalchemy\.exc|django\.db/i,
  /ora-\d{5}/i,
  /sqlstate[\[:]/i,
  /sqlite3?\.(Operational|Programming)Error/i,
  /mongodb\.Mongo(Server)?Error/i,
] as const;

export const sqliPayloads = [
  "' OR '1'='1",
  "' OR 1=1--",
  "'; DROP TABLE users--",
  "1' OR '1'='1",
  "%' OR 1=1--",
  "1; SELECT 1",
  "admin'--",
  "' UNION SELECT NULL--",
] as const;

export const xssPayloads = [
  '<script>alert(1)</script>',
  '"><img src=x onerror=alert(1)>',
  "'-alert(1)-'",
  '<svg/onload=alert(1)>',
  '{{constructor.constructor("alert(1)")()}}',
  'javascript:alert(1)',
] as const;

export const pathTraversalPayloads = [
  '../',
  '..%2f',
  '%2e%2e%2f',
  '....//',
  '..\\',
  '%00',
  '1;DROP',
  '1 OR 1=1',
] as const;

export const securityHeaders = {
  required: [
    'strict-transport-security',
    'x-content-type-options',
    'referrer-policy',
    'permissions-policy',
  ],
  frameDeny: ['x-frame-options', 'content-security-policy'],
} as const;
