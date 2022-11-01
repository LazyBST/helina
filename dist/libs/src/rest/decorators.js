"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithAlias = void 0;
const constants_1 = require("./constants");
require("reflect-metadata");
function WithAlias(name) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(constants_1.ROUTE_NAME, name, target, propertyKey);
    };
}
exports.WithAlias = WithAlias;
//# sourceMappingURL=decorators.js.map