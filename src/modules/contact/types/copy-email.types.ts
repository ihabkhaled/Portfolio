export interface CopyEmailButtonLabels {
  readonly copyLabel: string;
  readonly copiedLabel: string;
}

export interface CopyEmailButtonContainerProps {
  readonly email: string;
  readonly labels: CopyEmailButtonLabels;
}

export interface CopyEmailButtonProps {
  readonly label: string;
  readonly onClick: () => void;
}
