declare const _default: (((() => {
    redis_host: string;
    redis_port: number;
    redis_pass: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    redis_host: string;
    redis_port: number;
    redis_pass: string;
}>) | ((() => {
    db_host: string;
    db_username: string;
    db_password: string;
    db_run_migrations: string;
    db_port: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    db_host: string;
    db_username: string;
    db_password: string;
    db_run_migrations: string;
    db_port: number;
}>))[];
export default _default;
