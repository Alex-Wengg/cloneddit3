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
const Post_1 = require("../entities/Post");
const gCall_1 = require("../test-utils/gCall");
const testConnection_1 = require("../test-utils/testConnection");
let conn;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    conn = yield testConnection_1.testConnection();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield conn.close();
}));
describe("GraphQL tests", () => {
    const postTitle = faker_1.default.lorem.sentence();
    const postContent = faker_1.default.lorem.sentences();
    const postImgUrl = faker_1.default.image.imageUrl();
    const fakeUser = {
        username: faker_1.default.internet.userName(),
        email: faker_1.default.internet.email(),
        password: faker_1.default.internet.password(),
    };
    let userId;
    test("register and login", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const gqlResponse = yield gCall_1.gCall({
            source: REGISTER_MUTATION,
            variableValues: fakeUser,
            contextValue: { req: { session: {} }, res: {} },
        });
        const user = (_a = gqlResponse.data) === null || _a === void 0 ? void 0 : _a.register.user;
        expect(user.username).toEqual(fakeUser.username.toLowerCase());
        expect(user.id).toBeDefined();
        userId = user.id;
    }));
    let postId;
    test("create post and check using orm", () => __awaiter(void 0, void 0, void 0, function* () {
        const gqlResponse = yield gCall_1.gCall({
            source: CREATE_POST_MUTATION,
            variableValues: {
                title: postTitle,
                content: postContent,
                imgUrl: postImgUrl,
            },
            contextValue: { req: { session: { userId } }, res: {} },
        });
        expect(gqlResponse.errors).toBeUndefined();
        const fetchedPost = yield Post_1.Post.findOne({ title: postTitle });
        expect(fetchedPost === null || fetchedPost === void 0 ? void 0 : fetchedPost.title).toEqual(postTitle);
        expect(fetchedPost === null || fetchedPost === void 0 ? void 0 : fetchedPost.content).toEqual(postContent);
        expect(fetchedPost === null || fetchedPost === void 0 ? void 0 : fetchedPost.imgUrl).toEqual(postImgUrl);
        expect(fetchedPost === null || fetchedPost === void 0 ? void 0 : fetchedPost.id).toBeDefined();
        postId = fetchedPost === null || fetchedPost === void 0 ? void 0 : fetchedPost.id;
    }));
    test("fetch posts and check if new post is fetched", () => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const gqlResponse = yield gCall_1.gCall({
            source: POSTS_QUERY,
            variableValues: {},
            contextValue: { req: {}, res: {} },
        });
        expect(gqlResponse.errors).toBeUndefined();
        const posts = (_b = gqlResponse.data) === null || _b === void 0 ? void 0 : _b.posts;
        const post = posts.find((post) => post.title === postTitle);
        expect(post).toBeDefined();
        expect(post === null || post === void 0 ? void 0 : post.creator.id).toEqual(userId);
        expect(post === null || post === void 0 ? void 0 : post.content).toEqual(postContent);
    }));
    const updatedPostTitle = faker_1.default.lorem.sentence();
    const updatedPostContent = faker_1.default.lorem.sentences();
    test("update post", () => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const gqlResponse = yield gCall_1.gCall({
            source: UPDATE_POST_MUTATION,
            variableValues: {
                id: postId,
                title: updatedPostTitle,
                content: updatedPostContent,
            },
            contextValue: { req: { session: { userId } }, res: {} },
        });
        expect(gqlResponse.errors).toBeUndefined();
        expect(((_c = gqlResponse.data) === null || _c === void 0 ? void 0 : _c.updatePost).title).toEqual(updatedPostTitle);
        const fetchedPost = yield Post_1.Post.findOne(postId);
        expect(fetchedPost === null || fetchedPost === void 0 ? void 0 : fetchedPost.title).toEqual(updatedPostTitle);
    }));
    const newPostTitle = faker_1.default.lorem.sentence();
    const newPostContent = faker_1.default.lorem.sentences();
    test("Errors in updating or deleting when logged out", () => __awaiter(void 0, void 0, void 0, function* () {
        let gqlResponse = yield gCall_1.gCall({
            source: CREATE_POST_MUTATION,
            variableValues: { title: newPostTitle, content: newPostContent },
            contextValue: { req: {}, res: {} },
        });
        expect(gqlResponse.data).toBeFalsy();
        expect(gqlResponse.errors).toBeDefined();
        gqlResponse = yield gCall_1.gCall({
            source: UPDATE_POST_MUTATION,
            variableValues: {
                id: postId,
                title: newPostTitle,
                content: newPostContent,
            },
            contextValue: { req: { session: {} }, res: {} },
        });
        expect(gqlResponse.data).toBeFalsy();
        expect(gqlResponse.errors).toBeDefined();
        gqlResponse = yield gCall_1.gCall({
            source: DELETE_POST_MUTATION,
            variableValues: { id: postId },
            contextValue: { req: {}, res: {} },
        });
        expect(gqlResponse.data).toBeFalsy();
        expect(gqlResponse.errors).toBeDefined();
    }));
    test("Errors in updating or deleting when not your post", () => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const fakeUser = {
            username: faker_1.default.internet.userName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password(),
        };
        let userId;
        let gqlResponse = yield gCall_1.gCall({
            source: REGISTER_MUTATION,
            variableValues: fakeUser,
            contextValue: { req: { session: {} }, res: {} },
        });
        const user = (_d = gqlResponse.data) === null || _d === void 0 ? void 0 : _d.register.user;
        expect(user.username).toEqual(fakeUser.username.toLowerCase());
        userId = user.id;
        gqlResponse = yield gCall_1.gCall({
            source: CREATE_POST_MUTATION,
            variableValues: { title: newPostTitle },
            contextValue: { req: { session: {} }, res: {} },
        });
        expect(gqlResponse.data).toBeFalsy();
        expect(gqlResponse.errors).toBeDefined();
        gqlResponse = yield gCall_1.gCall({
            source: UPDATE_POST_MUTATION,
            variableValues: { id: postId, title: newPostTitle },
            contextValue: { req: { session: { userId } }, res: {} },
        });
        expect(gqlResponse.data).toBeFalsy();
        expect(gqlResponse.errors).toBeDefined();
        gqlResponse = yield gCall_1.gCall({
            source: DELETE_POST_MUTATION,
            variableValues: { id: postId },
            contextValue: { req: { session: { userId } }, res: {} },
        });
        expect(gqlResponse.data).toBeFalsy();
        expect(gqlResponse.errors).toBeDefined();
    }));
    test("delete post", () => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        const gqlResponse = yield gCall_1.gCall({
            source: DELETE_POST_MUTATION,
            variableValues: { id: postId },
            contextValue: { req: { session: { userId } }, res: {} },
        });
        expect(gqlResponse.errors).toBeUndefined();
        expect((_e = gqlResponse.data) === null || _e === void 0 ? void 0 : _e.deletePost).toEqual(true);
        const fetchedPost = yield Post_1.Post.findOne({
            title: updatedPostTitle,
        });
        expect(fetchedPost).toBeUndefined();
    }));
});
const REGISTER_MUTATION = `
mutation register($username: String!, $email: String!, $password: String!) {
  register(
    options: { username: $username, email: $email, password: $password }
  ) {
    errors {
      field
      message
    }
    user {
      id
      username
      email
    }
  }
}`;
const CREATE_POST_MUTATION = `
mutation createPost($title: String!, $content: String!, $imgUrl: String) {
  createPost(title: $title, content: $content, imgUrl: $imgUrl) {
    id
    title
    content
    imgUrl
    createdAt
    updatedAt
  }
}`;
const POSTS_QUERY = `
query posts {
  posts {
    id
    title
    content
    imgUrl
    createdAt
    updatedAt
    creator {
      id
      username
    }
  }
}`;
const UPDATE_POST_MUTATION = `
mutation updatePost($id: Int!, $title: String!, $content: String!) {
  updatePost(id: $id, title: $title, content: $content) {
    id
    title
    content
    createdAt
    updatedAt
  }
}`;
const DELETE_POST_MUTATION = `
mutation deletePost($id: Int!) {
  deletePost(id: $id)
}`;
//# sourceMappingURL=post.test.js.map