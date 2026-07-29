export interface ContactMutationState {
  readonly isPending: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
  readonly error: unknown;
}
