import { SetMetadata, applyDecorators } from "@nestjs/common";
import { PROCESS, PROCESSOR } from "./constant";

export const Processor = () => {
    return applyDecorators(
        SetMetadata(PROCESSOR, {
            isProcessorInjectable: true
        })
    );
}

export const Process = () => {
    return applyDecorators(
        SetMetadata(PROCESS, {
            isProcessInjectable: true
        })
    );
}