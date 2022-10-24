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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = __importDefault(require("redis"));
const constants_1 = require("./constants");
const cors_1 = __importDefault(require("cors"));
const graphql_schema_1 = require("./resolvers/graphql-schema");
const typeorm_1 = require("typeorm");
const typeorm_config_1 = require("./typeorm.config");
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
dotenv_safe_1.default.config({
    allowEmptyValues: !constants_1.__prod__,
    example: ".env.EXAMPLE",
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const dbName = process.env.TESTING ? constants_1.TEST_DB_NAME : constants_1.DB_NAME;
    yield typeorm_1.createConnection(typeorm_config_1.typeormConfig(dbName));
    const app = express_1.default();
    const origin = constants_1.__prod__
        ? process.env.CORS_ORIGIN
        : process.env.CORS_ORIGIN_DEV;
    app.use(cors_1.default({
        credentials: true,
        origin: `${origin}`,
    }));
    const redisClient = redis_1.default.createClient();
    const RedisStore = connect_redis_1.default(express_session_1.default);
    app.set("trust proxy", 1);
    app.use(express_session_1.default({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redisClient,
            disableTouch: true,
        }),
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            sameSite: "lax",
            secure: false,
            domain: constants_1.__prod__ ? process.env.DOMAIN : undefined,
        },
        saveUninitialized: false,
        secret: "c56800cfj2qm46890v42qmy8qv0-*9)N$MYT&*#%VM5v789wt30",
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        debug: !constants_1.__prod__,
        schema: yield graphql_schema_1.createSchema(),
        context: ({ req, res }) => {
            return { req, res };
        },
    });
    apolloServer.applyMiddleware({ app, cors: false });
    app.listen(4000, () => console.log("Server started on localhost:4000"));
});
main();
//# sourceMappingURL=index.js.map