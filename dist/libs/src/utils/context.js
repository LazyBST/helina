"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
class Context {
    setRequest(req) {
        this.req = req;
        return this;
    }
    getRequest() {
        return this.req;
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map