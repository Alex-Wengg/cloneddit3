"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = void 0;
const typeorm_1 = require("typeorm");
const constants_1 = require("../constants");
const typeorm_config_1 = require("../typeorm.config");
exports.testConnection = (reset = false) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield typeorm_1.createConnection(typeorm_config_1.typeormConfig(constants_1.TEST_DB_NAME, reset));
    return conn;
});
//# sourceMappingURL=testConnection.js.map