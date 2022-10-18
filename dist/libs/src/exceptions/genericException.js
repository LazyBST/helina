"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericException = void 0;
const common_1 = require("@nestjs/common");
class GenericException extends common_1.HttpException {
    constructor(message) {
        message = message ? message : 'Something went wrong!';
        super(message, 403);
    }
}
exports.GenericException = GenericException;
//# sourceMappingURL=genericException.js.map