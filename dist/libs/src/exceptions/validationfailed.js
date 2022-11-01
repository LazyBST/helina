"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationFailed = void 0;
const common_1 = require("@nestjs/common");
class ValidationFailed extends common_1.HttpException {
    constructor(errors) {
        super('Some entities failed, please check', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        this.errors = errors;
    }
    getErrors() {
        return this.errors;
    }
}
exports.ValidationFailed = ValidationFailed;
//# sourceMappingURL=validationfailed.js.map