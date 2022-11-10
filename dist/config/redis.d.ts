declare const _default: (() => {
    redis_host: string;
    redis_port: number;
    redis_pass: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    redis_host: string;
    redis_port: number;
    redis_pass: string;
}>;
export default _default;
