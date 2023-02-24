type SimpleProcessor = (finalResult: any) => any;

interface ProcessorOptions {
    beforeProcess?: (items: any) => any;
    disabled?: boolean;
}

type ProcessorWithOptions = [SimpleProcessor, ProcessorOptions]

export type PostProcessor = SimpleProcessor | ProcessorWithOptions;
