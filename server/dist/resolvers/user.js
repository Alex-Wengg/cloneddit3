"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const argon2_1 = __importDefault(require("argon2"));
const type_graphql_1 = require("type-graphql");
const constants_1 = require("../constants");
const User_1 = require("../entities/User");
const EMAIL_REGEX = /^[\w\.]+@[\w\.]+$/;
const USERNAME_REGEX = /^[\w\.]+$/;
let RegisterInput = class RegisterInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
RegisterInput = __decorate([
    type_graphql_1.InputType()
], RegisterInput);
let LoginInput = class LoginInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], LoginInput.prototype, "usernameOrEmail", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
LoginInput = __decorate([
    type_graphql_1.InputType()
], LoginInput);
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let FieldError = class FieldError {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", Object)
], FieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    type_graphql_1.ObjectType()
], FieldError);
let UserResolver = class UserResolver {
    users() {
        return User_1.User.find();
    }
    user(id) {
        return User_1.User.findOne(id);
    }
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session.userId) {
                return User_1.User.findOne(req.session.userId);
            }
            return undefined;
        });
    }
    register(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = options;
            const errors = [];
            if (username.length < 2)
                errors.push({
                    field: "username",
                    message: "Username should be at least 2 characters",
                });
            if (!USERNAME_REGEX.test(username))
                errors.push({
                    field: "username",
                    message: "Username must only contain A-Z, a-z, 0-9 and _",
                });
            if (!EMAIL_REGEX.test(email))
                errors.push({
                    field: "email",
                    message: "Invalid email",
                });
            if (password.length < 6)
                errors.push({
                    field: "password",
                    message: "Password must be at least 6 characters",
                });
            if (errors.length > 0) {
                return { errors };
            }
            const existingUser = yield User_1.User.findOne({
                username: username.toLowerCase(),
            });
            if (existingUser) {
                errors.push({ field: "username", message: "Username already taken" });
                return { errors };
            }
            const existingEmail = yield User_1.User.findOne({
                email: email.toLowerCase(),
            });
            if (existingEmail) {
                errors.push({ field: "email", message: "Email already in use" });
                return { errors };
            }
            const hashedPassword = yield argon2_1.default.hash(password);
            const newUser = yield User_1.User.create({
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password: hashedPassword,
            }).save();
            req.session.userId = newUser.id.toString();
            return {
                user: newUser,
            };
        });
    }
    login(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usernameOrEmail, password } = options;
            const errors = [];
            const isEmail = usernameOrEmail.includes("@");
            if (isEmail) {
                const email = usernameOrEmail;
                if (!EMAIL_REGEX.test(email))
                    errors.push({
                        field: "usernameOrEmail",
                        message: "Invalid email",
                    });
            }
            else {
                const username = usernameOrEmail;
                if (username.length < 2)
                    errors.push({
                        field: "usernameOrEmail",
                        message: "Username should be at least 2 characters",
                    });
                if (!USERNAME_REGEX.test(username))
                    errors.push({
                        field: "usernameOrEmail",
                        message: "Username must only contain A-Z, a-z, 0-9 and _",
                    });
            }
            if (password.length < 6)
                errors.push({
                    field: "password",
                    message: "Password must be at least 6 characters",
                });
            if (errors.length > 0) {
                return { errors };
            }
            const user = yield User_1.User.findOne(isEmail
                ? { email: usernameOrEmail.toLowerCase() }
                : { username: usernameOrEmail.toLowerCase() });
            if (!user) {
                errors.push({
                    field: "usernameOrEmail",
                    message: "Username or email not found",
                });
                return { errors };
            }
            const isValid = yield argon2_1.default.verify(user.password, password);
            if (!isValid)
                return {
                    errors: [
                        {
                            field: "password",
                            message: "Incorrect password",
                        },
                    ],
                };
            req.session.userId = user.id.toString();
            return {
                user,
            };
        });
    }
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err)
                resolve(false);
            resolve(true);
        }));
    }
};
__decorate([
    type_graphql_1.Query(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(User_1.User)
], UserResolver);
exports.default = UserResolver;
//# sourceMappingURL=user.js.map