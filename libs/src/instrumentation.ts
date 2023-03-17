//OpenTelemetry
import * as dotenv from 'dotenv';
dotenv.config({ path: './environment/.env' });

import {
  BatchSpanProcessor,
  BasicTracerProvider,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const SERVICE_NAME = process.env.SERVICE_NAME;
const COLLECTOR_ENDPOINT = process.env.TRACE_COLLECTOR_ENDPOINT;

if (!SERVICE_NAME) {
  throw new Error(
    'No service name specified in environment, Please pass SERVICE_NAME as env',
  );
}

if (!COLLECTOR_ENDPOINT) {
  throw new Error(
    'No collector endpoint specified in environment, Please pass TRACE_COLLECTOR_ENDPOINT as env',
  );
}

const exporterOptions = {
  url: COLLECTOR_ENDPOINT,
};

const exporter = new OTLPTraceExporter(exporterOptions);

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
  }),
});

provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));

provider.register();

const sdk = new NodeSDK({
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

export default sdk;
