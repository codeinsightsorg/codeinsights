type SimpleFinalizer = (finalResult: any) => any;

interface FinalizerOptions {
  beforeProcess?: (results: any) => any;
  disabled?: boolean;
}

type FinalizerWithOptions = [SimpleFinalizer, FinalizerOptions];

export type Finalizer = SimpleFinalizer | FinalizerWithOptions;
