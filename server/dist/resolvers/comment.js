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
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const Comment_1 = require("../entities/Comment");
const Post_1 = require("../entities/Post");
const User_1 = require("../entities/User");
let CommentResolver = class CommentResolver {
    post(comment) {
        return Post_1.Post.findOne(comment.postId);
    }
    user(comment) {
        return User_1.User.findOne(comment.userId);
    }
    comments(postId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId)
                throw new Error("Not Logged in");
            const userId = parseInt(req.session.userId);
            if (!userId)
                throw new Error("Invalid user id");
            const post = yield Post_1.Post.findOne(postId);
            if (!post)
                throw new Error("Post not found");
            return Comment_1.Comment.find({
                where: { postId, userId },
                order: { createdAt: "DESC" },
                take: 10,
            });
        });
    }
    comment(postId, comment, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId)
                throw new Error("Not Logged in");
            const post = yield Post_1.Post.findOne(postId);
            if (!post)
                throw new Error("Post not found");
            const userId = parseInt(req.session.userId);
            if (!userId)
                throw new Error("Invalid user id");
            return Comment_1.Comment.create({ postId, userId, comment }).save();
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => Post_1.Post),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Comment_1.Comment]),
    __metadata("design:returntype", void 0)
], CommentResolver.prototype, "post", null);
__decorate([
    type_graphql_1.FieldResolver(() => User_1.User),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Comment_1.Comment]),
    __metadata("design:returntype", void 0)
], CommentResolver.prototype, "user", null);
__decorate([
    type_graphql_1.Query(() => [Comment_1.Comment]),
    __param(0, type_graphql_1.Arg("postId", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "comments", null);
__decorate([
    type_graphql_1.Mutation(() => Comment_1.Comment),
    __param(0, type_graphql_1.Arg("postId", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("comment", () => String)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "comment", null);
CommentResolver = __decorate([
    type_graphql_1.Resolver(Comment_1.Comment)
], CommentResolver);
exports.default = CommentResolver;
//# sourceMappingURL=comment.js.map