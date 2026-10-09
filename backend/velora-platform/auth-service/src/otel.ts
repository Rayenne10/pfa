import { NodeSDK } from '@opentelemetry/sdk-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const sdk = new NodeSDK({
  resource: resourceFromAttributes({ 'service.name': process.env.OTEL_SERVICE_NAME || 'auth-service' }),
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations({ '@opentelemetry/instrumentation-fs': { enabled: false } })],
});
sdk.start();
process.once('SIGTERM', () => { void sdk.shutdown().catch(console.error); });
