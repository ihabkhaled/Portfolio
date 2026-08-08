export interface RateLimiter {
  /**
  Returns true when the request is allowed, false when the caller is over budget.
  */
  consume: (key: string) => boolean;
}
