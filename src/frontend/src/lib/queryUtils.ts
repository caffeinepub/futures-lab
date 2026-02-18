export const QUERY_TIMEOUT = 30000; // 30 seconds

export function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  // Handle object-shaped errors from agent/canister
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    // Common error shapes from IC agent
    if (err.message) return String(err.message);
    if (err.error_description) return String(err.error_description);
    if (err.error) return String(err.error);
    // Authorization/permission errors
    if (err.reject_message) return String(err.reject_message);
    if (err.reject_code) return `Canister error (code ${err.reject_code})`;
  }
  return 'An unexpected error occurred';
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number = QUERY_TIMEOUT): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
    ),
  ]);
}
