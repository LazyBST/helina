"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: './environment/.env' });
const exporter_trace_otlp_grpc_1 = require("@opentelemetry/exporter-trace-otlp-grpc");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const SERVICE_NAME = process.env.SERVICE_NAME;
const COLLECTOR_ENDPOINT = process.env.TRACE_COLLECTOR_ENDPOINT;
if (!SERVICE_NAME) {
    throw new Error('No service name specified in environment, Please pass SERVICE_NAME as env');
}
if (!COLLECTOR_ENDPOINT) {
    throw new Error('No collector endpoint specified in environment, Please pass TRACE_COLLECTOR_ENDPOINT as env');
}
const exporterOptions = {
    url: COLLECTOR_ENDPOINT,
};
const exporter = new exporter_trace_otlp_grpc_1.OTLPTraceExporter(exporterOptions);
const sdk = new sdk_node_1.NodeSDK({
    traceExporter: exporter,
    instrumentations: [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()],
    resource: new resources_1.Resource({
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
    }),
});
process.on('SIGTERM', () => {
    sdk
        .shutdown()
        .then(() => console.log('Tracing terminated'))
        .catch((error) => console.log('Error terminating tracing', error))
        .finally(() => process.exit(0));
});
exports.default = sdk;
//# sourceMappingURL=instrumentation.js.map