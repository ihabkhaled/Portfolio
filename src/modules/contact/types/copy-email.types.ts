export interface CopyEmailButtonLabels {
  readonly copyLabel: string;
  readonly copiedLabel: string;
}

export interface CopyEmailButtonContainerProperties {
  readonly email: string;
  readonly labels: CopyEmailButtonLabels;
}

export interface CopyEmailButtonProperties {
  readonly label: string;
  readonly onClick: () => void;
}
