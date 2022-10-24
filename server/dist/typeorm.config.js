"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeormConfig = void 0;
const constants_1 = require("./constants");
const Comment_1 = require("./entities/Comment");
const Post_1 = require("./entities/Post");
const Upvote_1 = require("./entities/Upvote");
const User_1 = require("./entities/User");
exports.typeormConfig = (dbName, reset = false) => ({
    type: "postgres",
    database: dbName,
    username: "u",
    password: "u",
    synchronize: !constants_1.__prod__,
    dropSchema: reset,
    entities: [User_1.User, Post_1.Post, Upvote_1.Upvote, Comment_1.Comment],
    logging: !constants_1.__prod__,
});
//# sourceMappingURL=typeorm.config.js.map