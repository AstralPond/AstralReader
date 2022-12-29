import type { GraphQLResolveInfo } from "graphql";
import type { MercuriusContext } from "mercurius";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) =>
  | Promise<import("mercurius-codegen").DeepPartial<TResult>>
  | import("mercurius-codegen").DeepPartial<TResult>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _FieldSet: any;
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  email: Scalars["String"];
  libraries: Array<Library>;
};

export type Library = {
  __typename?: "Library";
  id: Scalars["ID"];
  userID: Scalars["ID"];
  name: Scalars["String"];
  folders: Array<Folder>;
};

export type Folder = {
  __typename?: "Folder";
  basePath: Scalars["String"];
  publicPath: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  user: User;
};

export type QueryuserArgs = {
  id: Scalars["ID"];
  email: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  login?: Maybe<User>;
  createUser?: Maybe<User>;
  createLibraryWithFolder?: Maybe<Library>;
  createLibrary?: Maybe<Library>;
  deleteLibrary?: Maybe<Library>;
  addFolder: Folder;
  removeFolder: Folder;
};

export type MutationloginArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type MutationcreateUserArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type MutationcreateLibraryWithFolderArgs = {
  libraryName: Scalars["String"];
  email: Scalars["String"];
  targetPath: Scalars["String"];
};

export type MutationcreateLibraryArgs = {
  libraryName: Scalars["String"];
  email: Scalars["String"];
};

export type MutationdeleteLibraryArgs = {
  id: Scalars["ID"];
  libraryName: Scalars["String"];
};

export type MutationaddFolderArgs = {
  targetPath: Scalars["String"];
  libraryName: Scalars["String"];
};

export type MutationremoveFolderArgs = {
  publicPath: Scalars["String"];
  libraryID: Scalars["ID"];
  libraryName: Scalars["String"];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  User: ResolverTypeWrapper<User>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Library: ResolverTypeWrapper<Library>;
  Folder: ResolverTypeWrapper<Folder>;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  User: User;
  ID: Scalars["ID"];
  String: Scalars["String"];
  Library: Library;
  Folder: Folder;
  Query: {};
  Mutation: {};
  Boolean: Scalars["Boolean"];
};

export type UserResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  libraries?: Resolver<
    Array<ResolversTypes["Library"]>,
    ParentType,
    ContextType
  >;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LibraryResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes["Library"] = ResolversParentTypes["Library"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  userID?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  folders?: Resolver<Array<ResolversTypes["Folder"]>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FolderResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes["Folder"] = ResolversParentTypes["Folder"]
> = {
  basePath?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  publicPath?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  user?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<QueryuserArgs, "id" | "email">
  >;
};

export type MutationResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  login?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<MutationloginArgs, "email" | "password">
  >;
  createUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<MutationcreateUserArgs, "email" | "password">
  >;
  createLibraryWithFolder?: Resolver<
    Maybe<ResolversTypes["Library"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationcreateLibraryWithFolderArgs,
      "libraryName" | "email" | "targetPath"
    >
  >;
  createLibrary?: Resolver<
    Maybe<ResolversTypes["Library"]>,
    ParentType,
    ContextType,
    RequireFields<MutationcreateLibraryArgs, "libraryName" | "email">
  >;
  deleteLibrary?: Resolver<
    Maybe<ResolversTypes["Library"]>,
    ParentType,
    ContextType,
    RequireFields<MutationdeleteLibraryArgs, "id" | "libraryName">
  >;
  addFolder?: Resolver<
    ResolversTypes["Folder"],
    ParentType,
    ContextType,
    RequireFields<MutationaddFolderArgs, "targetPath" | "libraryName">
  >;
  removeFolder?: Resolver<
    ResolversTypes["Folder"],
    ParentType,
    ContextType,
    RequireFields<
      MutationremoveFolderArgs,
      "publicPath" | "libraryID" | "libraryName"
    >
  >;
};

export type Resolvers<ContextType = MercuriusContext> = {
  User?: UserResolvers<ContextType>;
  Library?: LibraryResolvers<ContextType>;
  Folder?: FolderResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};

export type Loader<TReturn, TObj, TParams, TContext> = (
  queries: Array<{
    obj: TObj;
    params: TParams;
  }>,
  context: TContext & {
    reply: import("fastify").FastifyReply;
  }
) => Promise<Array<import("mercurius-codegen").DeepPartial<TReturn>>>;
export type LoaderResolver<TReturn, TObj, TParams, TContext> =
  | Loader<TReturn, TObj, TParams, TContext>
  | {
      loader: Loader<TReturn, TObj, TParams, TContext>;
      opts?: {
        cache?: boolean;
      };
    };
export interface Loaders<
  TContext = import("mercurius").MercuriusContext & {
    reply: import("fastify").FastifyReply;
  }
> {
  User?: {
    id?: LoaderResolver<Scalars["ID"], User, {}, TContext>;
    email?: LoaderResolver<Scalars["String"], User, {}, TContext>;
    libraries?: LoaderResolver<Array<Library>, User, {}, TContext>;
  };

  Library?: {
    id?: LoaderResolver<Scalars["ID"], Library, {}, TContext>;
    userID?: LoaderResolver<Scalars["ID"], Library, {}, TContext>;
    name?: LoaderResolver<Scalars["String"], Library, {}, TContext>;
    folders?: LoaderResolver<Array<Folder>, Library, {}, TContext>;
  };

  Folder?: {
    basePath?: LoaderResolver<Scalars["String"], Folder, {}, TContext>;
    publicPath?: LoaderResolver<Scalars["String"], Folder, {}, TContext>;
  };
}
declare module "mercurius" {
  interface IResolvers
    extends Resolvers<import("mercurius").MercuriusContext> {}
  interface MercuriusLoaders extends Loaders {}
}
