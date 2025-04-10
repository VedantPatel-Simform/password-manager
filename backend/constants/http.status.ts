// constants/httpStatus.ts
export const HTTP_STATUS = {
    //  Success (2xx)
    OK: { code: 200, message: 'OK' },
    CREATED: { code: 201, message: 'Created' },
    ACCEPTED: { code: 202, message: 'Accepted' },
    NO_CONTENT: { code: 204, message: 'No Content' },

    //  Redirection (3xx)
    MULTIPLE_CHOICES: { code: 300, message: 'Multiple Choices' },
    MOVED_PERMANENTLY: { code: 301, message: 'Moved Permanently' },
    FOUND: { code: 302, message: 'Found' },
    SEE_OTHER: { code: 303, message: 'See Other' },
    NOT_MODIFIED: { code: 304, message: 'Not Modified' },
    TEMPORARY_REDIRECT: { code: 307, message: 'Temporary Redirect' },
    PERMANENT_REDIRECT: { code: 308, message: 'Permanent Redirect' },

    //  Client Errors (4xx)
    BAD_REQUEST: { code: 400, message: 'Bad Request' },
    UNAUTHORIZED: { code: 401, message: 'Unauthorized' },
    FORBIDDEN: { code: 403, message: 'Forbidden' },
    NOT_FOUND: { code: 404, message: 'Not Found' },
    METHOD_NOT_ALLOWED: { code: 405, message: 'Method Not Allowed' },
    CONFLICT: { code: 409, message: 'Conflict' },
    GONE: { code: 410, message: 'Gone' },
    UNPROCESSABLE_ENTITY: { code: 422, message: 'Unprocessable Entity' },
    TOO_MANY_REQUESTS: { code: 429, message: 'Too Many Requests' },

    //  Server Errors (5xx)
    INTERNAL_SERVER_ERROR: { code: 500, message: 'Internal Server Error' },
    NOT_IMPLEMENTED: { code: 501, message: 'Not Implemented' },
    BAD_GATEWAY: { code: 502, message: 'Bad Gateway' },
    SERVICE_UNAVAILABLE: { code: 503, message: 'Service Unavailable' },
    GATEWAY_TIMEOUT: { code: 504, message: 'Gateway Timeout' },
} as const;

export type HttpStatusKey = keyof typeof HTTP_STATUS;
