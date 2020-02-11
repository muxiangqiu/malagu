import { v4 } from 'uuid';
import { Component, Value } from '@malagu/core';
import { TraceIdResolver, TRACE_ID_REQUEST_FIELD } from './trace-protocol';
import { Context } from '../context';

@Component(TraceIdResolver)
export class TraceIdResolverImpl implements TraceIdResolver {
    @Value(TRACE_ID_REQUEST_FIELD)
    protected readonly traceField: string;

    resolve(ctx: Context): Promise<string> {
        if (ctx.request && this.traceField ) {
            const traceId = ctx.request.headers[this.traceField] as string | undefined;
            if (traceId) {
                return Promise.resolve(traceId);
            }
        }
        return Promise.resolve(v4());
    }
}