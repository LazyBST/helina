"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentials = void 0;
const common_1 = require("@nestjs/common");
class InvalidCredentials extends common_1.HttpException {
    constructor() {
        super('Invalid Credentials', 401);
    }
}
exports.InvalidCredentials = InvalidCredentials;
//# sourceMappingURL=invalidCredentials.js.map