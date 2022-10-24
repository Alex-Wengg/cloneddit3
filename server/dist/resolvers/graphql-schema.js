"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
const type_graphql_1 = require("type-graphql");
const comment_1 = __importDefault(require("./comment"));
const post_1 = __importDefault(require("./post"));
const user_1 = __importDefault(require("./user"));
exports.createSchema = () => type_graphql_1.buildSchema({
    resolvers: [post_1.default, user_1.default, comment_1.default],
    validate: false,
});
//# sourceMappingURL=graphql-schema.js.map