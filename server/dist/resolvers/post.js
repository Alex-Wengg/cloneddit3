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
const Upvote_1 = require("../entities/Upvote");
const type_graphql_1 = require("type-graphql");
const Post_1 = require("../entities/Post");
const User_1 = require("../entities/User");
let PostResolver = class PostResolver {
    creator(post) {
        return User_1.User.findOne(post.creatorId);
    }
    upvoteCount(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const upvotes = yield Upvote_1.Upvote.find({ postId: post.id });
            return upvotes.reduce((sum, { isUpvote }) => (isUpvote ? ++sum : --sum), 0);
        });
    }
    posts() {
        return Post_1.Post.find({ order: { createdAt: "DESC" }, take: 10 });
    }
    post(id) {
        return Post_1.Post.findOne(id);
    }
    upvoteStatus(postId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId)
                throw new Error("Not Logged in");
            const userId = parseInt(req.session.userId);
            if (!userId)
                throw new Error("Invalid user id");
            const post = yield Post_1.Post.findOne(postId);
            if (!post)
                throw new Error("Post not found");
            const upvote = yield Upvote_1.Upvote.findOne({ postId, userId });
            return upvote === null || upvote === void 0 ? void 0 : upvote.isUpvote;
        });
    }
    createPost({ req }, title, content, imgUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId)
                throw new Error("Not Logged in");
            title = title.trim();
            content = content.trim();
            if (!title)
                throw new Error("Title cannot be empty");
            if (!content)
                throw new Error("Content cannot be empty");
            if (imgUrl)
                imgUrl = imgUrl.trim();
            return Post_1.Post.create({
                title,
                content,
                imgUrl,
                creatorId: parseInt(req.session.userId),
            }).save();
        });
    }
    updatePost(id, title, content, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId)
                throw new Error("Not Logged in");
            title = title.trim();
            content = content.trim();
            if (!title)
                throw new Error("Title cannot be empty");
            if (!content)
                throw new Error("Content cannot be empty");
            const post = yield Post_1.Post.findOne(id);
            if (!post)
                throw new Error("Post not found");
            if (post.creatorId !== parseInt(req.session.userId))
                throw new Error("Unauthorized");
            post.title = title;
            post.content = content;
            return post.save();
        });
    }
    deletePost(id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId)
                throw new Error("Not Logged in");
            const post = yield Post_1.Post.findOne(id);
            if (!post)
                return false;
            if (post.creatorId !== parseInt(req.session.userId))
                throw new Error("Unauthorized");
            yield post.remove();
            return true;
        });
    }
    upvote(postId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId)
                throw new Error("Not Logged in");
            const post = yield Post_1.Post.findOne(postId);
            if (!post)
                throw new Error("Post not found");
            const userId = parseInt(req.session.userId);
            if (!userId)
                throw new Error("Invalid user id");
            const previousUpvote = yield Upvote_1.Upvote.findOne({ postId, userId });
            if (previousUpvote && !previousUpvote.isUpvote) {
                previousUpvote.isUpvote = true;
                yield previousUpvote.save();
            }
            else {
                yield Upvote_1.Upvote.create({ postId, userId, isUpvote: true }).save();
            }
            return post;
        });
    }
    downvote(postId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId)
                throw new Error("Not Logged in");
            const post = yield Post_1.Post.findOne(postId);
            if (!post)
                throw new Error("Post not found");
            const userId = parseInt(req.session.userId);
            if (!userId)
                throw new Error("Invalid user id");
            const previousUpvote = yield Upvote_1.Upvote.findOne({ postId, userId });
            if (previousUpvote && previousUpvote.isUpvote) {
                previousUpvote.isUpvote = false;
                yield previousUpvote.save();
            }
            else {
                yield Upvote_1.Upvote.create({ postId, userId, isUpvote: false }).save();
            }
            return post;
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => User_1.User),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "creator", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "upvoteCount", null);
__decorate([
    type_graphql_1.Query(() => [Post_1.Post]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    type_graphql_1.Query(() => Post_1.Post, { nullable: true }),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    type_graphql_1.Query(() => Boolean, { nullable: true }),
    __param(0, type_graphql_1.Arg("postId", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "upvoteStatus", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.Post),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("title", () => String)),
    __param(2, type_graphql_1.Arg("content", () => String)),
    __param(3, type_graphql_1.Arg("imgUrl", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.Post),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("title", () => String)),
    __param(2, type_graphql_1.Arg("content", () => String)),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.Post),
    __param(0, type_graphql_1.Arg("postId", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "upvote", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.Post),
    __param(0, type_graphql_1.Arg("postId", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "downvote", null);
PostResolver = __decorate([
    type_graphql_1.Resolver(Post_1.Post)
], PostResolver);
exports.default = PostResolver;
//# sourceMappingURL=post.js.map