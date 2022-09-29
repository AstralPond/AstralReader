"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var mongodb_1 = require("mongodb");
var uri = "mongodb://john:cody4454@11.11.11.66:27017";
var client = new mongodb_1.MongoClient(uri);
console.log("================i run==============");
exports.db = client.db("astro");
//# sourceMappingURL=index.js.map