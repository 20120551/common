import { IEvent, IEventBus, IEventHandler } from "@nguyengo2112/common";

const createEventBus = (): IEventBus => {
    // private property
    const handlers: Map<string, IEventHandler> = new Map();
    return {
        register(handler: IEventHandler): void {
            handlers.set(handler.name, handler);
        },
        handle<TEvent extends IEvent>(event: TEvent): Promise<void> {
            const handler = handlers.get(event.name);
            if (!handler) {
                throw new Error(`cannot find handler associate with ${event.name}`);
            }

            return handler.handle(event);
        }
    }
}

export { createEventBus };