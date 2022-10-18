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
exports.HttpMetadata = void 0;
const queryString = __importStar(require("query-string"));
const url_1 = require("url");
class HttpMetadata {
    static addNamedRoute(routeName, path) {
        HttpMetadata.store.routes[routeName] = path;
    }
    static getRoute(routeName, params) {
        let route = HttpMetadata.store.routes[routeName];
        if (!route)
            return null;
        let notPathParams = null;
        if (params && Object.keys(params).length) {
            notPathParams = {};
            for (const key in params) {
                route.includes(`:${key}`)
                    ? (route = route.replace(`:${key}`, params[key]))
                    : (notPathParams[key] = params[key]);
            }
        }
        const url = new url_1.URL(notPathParams
            ? `${route}?${queryString.stringify(notPathParams)}`
            : route, HttpMetadata.store.baseUrl);
        return url.href;
    }
    static setBaseUrl(url) {
        HttpMetadata.store.baseUrl = url;
    }
}
exports.HttpMetadata = HttpMetadata;
HttpMetadata.store = { routes: {}, baseUrl: '' };
//# sourceMappingURL=metadata.js.map