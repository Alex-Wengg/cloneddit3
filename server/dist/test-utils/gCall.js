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
exports.gCall = void 0;
const graphql_1 = require("graphql");
const graphql_schema_1 = require("../resolvers/graphql-schema");
let schema;
exports.gCall = ({ source, variableValues, contextValue, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!schema)
        schema = yield graphql_schema_1.createSchema();
    return graphql_1.graphql({
        schema,
        source,
        variableValues,
        contextValue,
    });
});
//# sourceMappingURL=gCall.js.map