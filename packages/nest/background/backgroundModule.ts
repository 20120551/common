import { Module, OnApplicationBootstrap } from "@nestjs/common";
import { PROCESS, PROCESSOR } from "./constant";
import { DiscoveryModule, DiscoveryService } from "@golevelup/nestjs-discovery";
import { ExternalContextCreator } from "@nestjs/core";

@Module({
    imports: [DiscoveryModule]
})
export default class BackgroundModule implements OnApplicationBootstrap {
    constructor(
        private readonly externalContextCreator: ExternalContextCreator,
        private readonly discovery: DiscoveryService) {

    }
    async onApplicationBootstrap() {
        const parentClassMetadata = await this.discovery.providersWithMetaAtKey<{ isProcessorInjectable: boolean }>(PROCESSOR);

        // list of list of handler [[handlers], [handlers]]
        const processors = await Promise.all(parentClassMetadata.map(async ({ meta, discoveredClass }) => {
            if (!meta.isProcessorInjectable) {
                return null;
            }

            const methodMetadata = this.discovery.classMethodsWithMetaAtKey<{ isProcessInjectable: boolean }>(
                discoveredClass, PROCESS);

            // list of () => promise
            const handlers = await Promise.all(methodMetadata.map(async ({ meta, discoveredMethod }) => {
                if (!meta.isProcessInjectable) {
                    return null;
                }

                return this.externalContextCreator.create(
                    discoveredMethod.parentClass.instance,
                    discoveredMethod.handler,
                    discoveredMethod.methodName
                );;
            }));

            const _handlers = handlers.filter(handler => handler !== null);
            return _handlers;
        }))

        const _processors = processors.filter(processor => processor !== null);

        //TODO: spawn new process
        _processors.forEach(handlers => {
            handlers.forEach(handler => handler());
        });
    }

}