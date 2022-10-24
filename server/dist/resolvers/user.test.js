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
const faker_1 = __importDefault(require("faker"));
const User_1 = require("../entities/User");
const gCall_1 = require("../test-utils/gCall");
const testConnection_1 = require("../test-utils/testConnection");
let conn;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    conn = yield testConnection_1.testConnection();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield conn.close();
}));
describe("ORM tests", () => {
    test("create and checks a test user", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeUser = {
            username: faker_1.default.internet.userName().toLowerCase(),
            email: faker_1.default.internet.email().toLowerCase(),
            password: faker_1.default.internet.password(),
        };
        yield User_1.User.create(fakeUser).save();
        const fetchedUser = yield User_1.User.findOneOrFail({
            email: fakeUser.email,
        });
        expect(fetchedUser.username).toEqual(fakeUser.username);
    }));
});
describe("GraphQL tests", () => {
    const fakeUser = {
        username: faker_1.default.internet.userName(),
        email: faker_1.default.internet.email(),
        password: faker_1.default.internet.password(),
    };
    test("create and check a test user using graphql", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const gqlResponse = yield gCall_1.gCall({
            source: `
      mutation register($username: String!, $email: String!, $password: String!) {
        register(
          options: { username: $username, email: $email, password: $password }
        ) {
          errors {
            field
            message
          }
          user {
            username
            email
          }
        }
      }
      `,
            variableValues: fakeUser,
            contextValue: { req: { session: {} }, res: {} },
        });
        expect((_a = gqlResponse.data) === null || _a === void 0 ? void 0 : _a.register.user.username).toEqual(fakeUser.username.toLowerCase());
        const fetchedUser = yield User_1.User.findOneOrFail({
            email: fakeUser.email.toLowerCase(),
        });
        expect(fetchedUser.username).toEqual(fakeUser.username.toLowerCase());
    }));
    test("try login via username", () => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const gqlResponse = yield gCall_1.gCall({
            source: `
      mutation login($usernameOrEmail: String!, $password: String!) {
        login(options: { usernameOrEmail: $usernameOrEmail, password: $password }) {
          user {
            username
            email
          }
          errors {
            field
            message
          }
        }
      }      
      `,
            variableValues: Object.assign(Object.assign({}, fakeUser), { usernameOrEmail: fakeUser.username }),
            contextValue: { req: { session: {} }, res: {} },
        });
        expect((_b = gqlResponse.data) === null || _b === void 0 ? void 0 : _b.login.user.username).toEqual(fakeUser.username.toLowerCase());
    }));
    test("try login via email", () => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const gqlResponse = yield gCall_1.gCall({
            source: `
      mutation login($usernameOrEmail: String!, $password: String!) {
        login(options: { usernameOrEmail: $usernameOrEmail, password: $password }) {
          user {
            username
            email
          }
          errors {
            field
            message
          }
        }
      }      
      `,
            variableValues: Object.assign(Object.assign({}, fakeUser), { usernameOrEmail: fakeUser.email }),
            contextValue: { req: { session: {} }, res: {} },
        });
        expect((_c = gqlResponse.data) === null || _c === void 0 ? void 0 : _c.login.user.username).toEqual(fakeUser.username.toLowerCase());
    }));
});
//# sourceMappingURL=user.test.js.map