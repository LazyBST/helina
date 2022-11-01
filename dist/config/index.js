"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("./redis"));
const database_1 = __importDefault(require("./database"));
exports.default = [redis_1.default, database_1.default];
//# sourceMappingURL=index.js.map