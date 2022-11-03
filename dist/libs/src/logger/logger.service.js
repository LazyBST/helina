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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const winston = __importStar(require("winston"));
const colors = __importStar(require("colors/safe"));
const triple_beam_1 = require("triple-beam");
const util = __importStar(require("util"));
const logger_module_definition_1 = require("./logger.module-definition");
let LoggerService = class LoggerService {
    constructor(loggerOptions) {
        this.loggerOptions = loggerOptions;
        this.myFormat = winston.format.printf((info) => {
            return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
        });
        this.options = {
            exitOnError: false,
            level: 'debug',
        };
        this.colormap = {
            debug: colors.grey,
            info: colors.cyan,
            warn: colors.magenta,
            error: colors.red,
        };
        const { appName: name } = this.loggerOptions;
        this.options.format = winston.format.combine(winston.format((info) => {
            info.level = info.level.toUpperCase();
            return info;
        })(), winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.label({ label: name }), this.myFormat, winston.format.simple());
        this.options.transports = [new winston.transports.Console()];
        this.logger = winston.createLogger(this.options);
        this.name = name;
    }
    toString(msgs) {
        if (typeof msgs === 'string') {
            return msgs;
        }
        const mm = [];
        for (const m of msgs) {
            mm.push(util.format(m));
        }
        return mm.join(' ');
    }
    logprint(info) {
        const colorize = this.colormap[info[triple_beam_1.LEVEL]];
        let logmsg = `${colors.yellow(info.timestamp)} [${colors.green(info.label)}] ${colorize(info.level)}: `;
        logmsg += colorize(this.toString(info.message));
        return logmsg;
    }
    get logopts() {
        return this.options;
    }
    debug(message) {
        this.logger.debug(JSON.stringify(message));
    }
    info(message) {
        this.logger.info(JSON.stringify(message));
    }
    warn(message) {
        this.logger.warn(JSON.stringify(message));
    }
    error(message) {
        this.logger.error(JSON.stringify(message));
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map
};
LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_module_definition_1.MODULE_OPTIONS_TOKEN)),
    __metadata("design:paramtypes", [Object])
], LoggerService);
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map
