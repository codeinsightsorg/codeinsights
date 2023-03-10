export interface FinalizerOptions {
  beforeProcess?: (results: any) => any;
  disabled?: boolean;
}

export type Finalizer = (finalResult: any) => any;
