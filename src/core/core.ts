import compose from './compose';
import * as context from './context';
import runtime from './runtime';
import eventMiddleware from '../middleware/event-middleware';
import performanceMiddleware from '../middleware/performance-middleware';
import PVMiddleware from '../middleware/pv-middleware';
import reportMiddleware from '../middleware/report-middleware';
import resourceMiddleware from '../middleware/resource-middleware';
import XHRMiddleware from '../middleware/xhr-middleware';

import Message from './types/message.type';
import { EventEmitter2 } from 'eventemitter2';

const only = require('only');
// const debug = require('debug')('prajna:core');
// const datascript = require('datascript');
const GLOBAL: any = window;

class Core extends EventEmitter2 {
    private middleware: any[];
    private context: any;
    private runtime: any;
    public env: string = GLOBAL.__prajnaEnv__ || 'dev';
    public url: string = GLOBAL.__envMapping__[this.env] || 'http://localhost:8080';
    public performanceFlag: boolean = false;
    public autopv: boolean = true;
    public channel: string = null;

    constructor(opt: any) {
        super();

        this.middleware = [];
        this.context = Object.create(context);
        this.runtime = Object.create(runtime);
        this.autopv = opt.autopv || this.autopv;
        this.channel = opt.channel || this.channel;
    }

    toJSON(): Core {
        return only(this, [
            'env',
            'url',
            'performanceFlag',
            'autopv'
        ]);
    }

    inspect(): Core {
        return this.toJSON();
    }

    callback(): () => any {		// TODO
        const lambda: (ctx: any, next?: any) => any = compose(this.middleware);
        const handler = () => {
            const ctx = this.createContext();
            const handleEnv = () => envHelper(ctx);
            return lambda(ctx).then(handleEnv).catch((err: Error) => {
                console.log(err);
            });
        };
        return handler;
    }

    createContext(): void {		// TODO
        const context = Object.create(this.context);
        const runtime = context.runtime = Object.create(this.runtime);
        context.core = runtime.core = this;
        context.state = {};
        return context;
    }

    start(...args: any[]): Core {
        this.use(performanceMiddleware);
        this.use(resourceMiddleware);
        this.use(XHRMiddleware);
        this.use(eventMiddleware);
        this.use(PVMiddleware);
        this.use(reportMiddleware);
        return this.on('LOGGING', this.callback());
    }

    set(...args: any[]): void {
        `Set prajna configurations`
        return;
    }

    use(lambda: (...args: any[]) => any): Core {
        `Install prajna middleware`
        this.middleware.push(lambda);
        return this;
    }

    // @pageView
    pageView(): void {
        `Send PV manually`
        return;
    }

    // TODO: @prajnaEvent
    prajnaEvent(message: Message): void {
        `Aftermath of page events`
        return;
    }

    report(message: Message): void {
        `Report ERROR|WARNING|INFO|DEBUG info`
        this.emit('LOGGING')
        console.log(message);
        return;
    }
}

function envHelper(ctx: any) {
    return (ctx: any) => { };
}

export default Core;
