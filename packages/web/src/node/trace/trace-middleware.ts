import { TraceIdResolver } from './trace-protocol';
import { Middleware } from '../middleware';
import { Context } from '../context';
import { Component, Autowired, Logger } from '@malagu/core';
import { TRACE_MIDDLEWARE_PRIORITY, RESPONSE_TRACE_ID_FIELD } from './trace-protocol';

@Component(Middleware)
export class TraceMiddleware implements Middleware {

    @Autowired(TraceIdResolver)
    protected readonly traceIdResolver: TraceIdResolver;

    @Autowired(Logger)
    protected readonly logger: Logger;

    async handle(ctx: Context, next: () => Promise<void>): Promise<void> {
        const method = ctx.request.method;
        const path = ctx.request.path;
        const traceId = await this.traceIdResolver.resolve(ctx);
        this.logger.info(`starting ${method} ${path} with traceId[${traceId}]`);
        const now = Date.now();

        Context.setTraceId(traceId);
        ctx.response.setHeader(RESPONSE_TRACE_ID_FIELD, traceId);

        await next();
        this.logger.info(`ending ${method} ${path} with traceId[${traceId}], cost ${Date.now() - now}ms`);
    }

    readonly priority = TRACE_MIDDLEWARE_PRIORITY;

}
