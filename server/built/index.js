"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Users_1 = __importDefault(require("db/collections/Users"));
var fastify_1 = __importDefault(require("fastify"));
var mercurius_1 = __importDefault(require("mercurius"));
var mercurius_codegen_1 = __importStar(require("mercurius-codegen"));
var mongodb_1 = require("mongodb");
var saltRounds = 10;
var app = (0, fastify_1.default)({ logger: true });
var uri = "mongodb://john:cody4454@11.11.11.66:27017";
var client = new mongodb_1.MongoClient(uri);
var buildContext = function (req, _reply) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                auth: req.headers.authorization,
            }];
    });
}); };
app.get("/", function (_request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var query;
    return __generator(this, function (_a) {
        query = "{ add(x: 2, y: 2)}";
        return [2 /*return*/, reply.graphql(query)];
    });
}); });
var schema = (0, mercurius_codegen_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type User {\n    id: ID!\n    email: String!\n  }\n\n  type Query {\n    test: String\n  }\n\n  type Mutation {\n    login(email: String!, password: String!): User\n    createUser(email: String!, password: String!): User\n  }\n"], ["\n  type User {\n    id: ID!\n    email: String!\n  }\n\n  type Query {\n    test: String\n  }\n\n  type Mutation {\n    login(email: String!, password: String!): User\n    createUser(email: String!, password: String!): User\n  }\n"])));
var resolvers = {
    Query: {
        test: function () { return "hi"; },
    },
    Mutation: {
        login: function (_parent, args, _context, _info) { return __awaiter(void 0, void 0, void 0, function () {
            var email, password;
            return __generator(this, function (_a) {
                email = args.email, password = args.password;
                return [2 /*return*/, null];
            });
        }); },
        // createUser: async (_parent, args, _context, _info) => {},
    },
};
app.register(mercurius_1.default, {
    schema: schema,
    resolvers: resolvers,
    context: buildContext,
});
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var foundUser, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, Users_1.default.findOne()];
            case 1:
                foundUser = _a.sent();
                console.log(foundUser === null || foundUser === void 0 ? void 0 : foundUser.email);
                return [4 /*yield*/, (0, mercurius_codegen_1.default)(app, {
                        targetPath: "./src/graphql/generated.ts",
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, app.listen({ port: 3000 })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                app.log.error(err_1);
                process.exit(1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
start();
var templateObject_1;
//# sourceMappingURL=index.js.map