export declare class HttpMetadata {
    static store: Record<string, any>;
    static addNamedRoute(routeName: string, path: string): void;
    static getRoute(routeName: string, params?: Record<string, any>): string;
    static setBaseUrl(url: string): void;
}
