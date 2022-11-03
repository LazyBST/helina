"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULE_OPTIONS_TOKEN = exports.ConfigurableModuleClass = void 0;
const common_1 = require("@nestjs/common");
_a = new common_1.ConfigurableModuleBuilder({
    moduleName: 'Logger',
})
    .setExtras({
    isGlobal: true,
}, (definition, extras) => (Object.assign(Object.assign({}, definition), { global: extras.isGlobal })))
    .setClassMethodName('forRoot')
    .build(), exports.ConfigurableModuleClass = _a.ConfigurableModuleClass, exports.MODULE_OPTIONS_TOKEN = _a.MODULE_OPTIONS_TOKEN;
//# sourceMappingURL=logger.module-definition.js.map