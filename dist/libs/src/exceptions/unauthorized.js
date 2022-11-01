"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unauthorized = void 0;
const common_1 = require("@nestjs/common");
class Unauthorized extends common_1.HttpException {
    constructor() {
        super('Unauthorized.', 403);
    }
}
exports.Unauthorized = Unauthorized;
//# sourceMappingURL=unauthorized.js.map