export interface ContactEmailInput {
  readonly email: string;
  readonly subject: string;
  readonly message: string;
}

/**
Thrown when the contact channel is not configured for sending.
*/
export class ContactEmailUnavailableError extends Error {
  constructor() {
    super('Contact email is unavailable');
    this.name = 'ContactEmailUnavailableError';
  }
}
