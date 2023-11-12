import { Injectable } from "@nestjs/common";
import { IEvent, IEventBus, IEventHandler } from "@hcmus/common";

@Injectable()
export default class EventBus implements IEventBus {
    private handlers: Map<string, IEventHandler> = new Map();
    register(handler: IEventHandler): void {
        this.handlers.set(handler.name, handler);
    }
    handle<TEvent extends IEvent>(event: TEvent): Promise<void> {
        const handler = this.handlers.get(event.name);
        if (!handler) {
            throw new Error(`cannot find handler associate with ${event.name}`);
        }

        return handler.handle(event);
    }
}