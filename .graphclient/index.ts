// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import PrefixTransform from "@graphql-mesh/transform-prefix";
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from '@graphql-mesh/utils';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { ConditionalTypes } from './sources/conditional/types';
import * as importedModule$0 from "./sources/conditional/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: any;
};

export type Query = {
  conditional_grants: Array<conditional_Grant>;
  conditional_grantById?: Maybe<conditional_Grant>;
  conditional_grantsConnection: conditional_GrantsConnection;
  conditional_questions: Array<conditional_Question>;
  conditional_questionById?: Maybe<conditional_Question>;
  conditional_questionsConnection: conditional_QuestionsConnection;
  conditional_answers: Array<conditional_Answer>;
  conditional_answerById?: Maybe<conditional_Answer>;
  conditional_answersConnection: conditional_AnswersConnection;
  conditional_wallets: Array<conditional_Wallet>;
  conditional_walletById?: Maybe<conditional_Wallet>;
  conditional_walletsConnection: conditional_WalletsConnection;
  conditional_tokens: Array<conditional_Token>;
  conditional_tokenById?: Maybe<conditional_Token>;
  conditional_tokensConnection: conditional_TokensConnection;
  conditional_squidStatus?: Maybe<conditional_SquidStatus>;
};


export type Queryconditional_grantsArgs = {
  where?: InputMaybe<conditional_GrantWhereInput>;
  orderBy?: InputMaybe<Array<conditional_GrantOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type Queryconditional_grantByIdArgs = {
  id: Scalars['String'];
};


export type Queryconditional_grantsConnectionArgs = {
  orderBy: Array<conditional_GrantOrderByInput>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<conditional_GrantWhereInput>;
};


export type Queryconditional_questionsArgs = {
  where?: InputMaybe<conditional_QuestionWhereInput>;
  orderBy?: InputMaybe<Array<conditional_QuestionOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type Queryconditional_questionByIdArgs = {
  id: Scalars['String'];
};


export type Queryconditional_questionsConnectionArgs = {
  orderBy: Array<conditional_QuestionOrderByInput>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<conditional_QuestionWhereInput>;
};


export type Queryconditional_answersArgs = {
  where?: InputMaybe<conditional_AnswerWhereInput>;
  orderBy?: InputMaybe<Array<conditional_AnswerOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type Queryconditional_answerByIdArgs = {
  id: Scalars['String'];
};


export type Queryconditional_answersConnectionArgs = {
  orderBy: Array<conditional_AnswerOrderByInput>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<conditional_AnswerWhereInput>;
};


export type Queryconditional_walletsArgs = {
  where?: InputMaybe<conditional_WalletWhereInput>;
  orderBy?: InputMaybe<Array<conditional_WalletOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type Queryconditional_walletByIdArgs = {
  id: Scalars['String'];
};


export type Queryconditional_walletsConnectionArgs = {
  orderBy: Array<conditional_WalletOrderByInput>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<conditional_WalletWhereInput>;
};


export type Queryconditional_tokensArgs = {
  where?: InputMaybe<conditional_TokenWhereInput>;
  orderBy?: InputMaybe<Array<conditional_TokenOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type Queryconditional_tokenByIdArgs = {
  id: Scalars['String'];
};


export type Queryconditional_tokensConnectionArgs = {
  orderBy: Array<conditional_TokenOrderByInput>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<conditional_TokenWhereInput>;
};

export type conditional_Grant = {
  id: Scalars['String'];
  grantId: Scalars['String'];
  questionEntityId: Scalars['String'];
  questionEntity: conditional_Question;
  creatorId: Scalars['String'];
  creator: conditional_Wallet;
  recipientId: Scalars['String'];
  recipient: conditional_Wallet;
  amount: Scalars['BigInt'];
  amountD: Scalars['Float'];
  question: Scalars['String'];
  questionId: Scalars['String'];
  conditionId: Scalars['String'];
  txnHash: Scalars['String'];
  resolved: Scalars['Boolean'];
  success?: Maybe<Scalars['Boolean']>;
  collateralTokenId: Scalars['String'];
  collateralToken: conditional_Token;
  deadline: Scalars['BigInt'];
  /** creation block  */
  creationBlockNumber: Scalars['BigInt'];
  /** creation timestamp  */
  creationTimestamp: Scalars['BigInt'];
  chainId: Scalars['Int'];
};

export type conditional_Question = {
  id: Scalars['String'];
  questionId: Scalars['String'];
  userId: Scalars['String'];
  user: conditional_Wallet;
  templateId: Scalars['BigInt'];
  question: Scalars['String'];
  contentHash: Scalars['String'];
  arbitrator: Scalars['String'];
  timeout: Scalars['Int'];
  openingTs: Scalars['BigInt'];
  minBond: Scalars['BigInt'];
  nonce: Scalars['BigInt'];
  created: Scalars['BigInt'];
  txnHash: Scalars['String'];
  /** creation block */
  creationBlockNumber: Scalars['BigInt'];
  /** creation timestamp */
  creationTimestamp: Scalars['BigInt'];
  chainId: Scalars['Int'];
  answers: Array<conditional_Answer>;
};


export type conditional_QuestionanswersArgs = {
  where?: InputMaybe<conditional_AnswerWhereInput>;
  orderBy?: InputMaybe<Array<conditional_AnswerOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};

export type conditional_Wallet = {
  id: Scalars['String'];
  walletAddress: Scalars['String'];
  chainId: Scalars['Int'];
  grantsRecipient: Array<conditional_Grant>;
  grantsCreator: Array<conditional_Grant>;
};


export type conditional_WalletgrantsRecipientArgs = {
  where?: InputMaybe<conditional_GrantWhereInput>;
  orderBy?: InputMaybe<Array<conditional_GrantOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type conditional_WalletgrantsCreatorArgs = {
  where?: InputMaybe<conditional_GrantWhereInput>;
  orderBy?: InputMaybe<Array<conditional_GrantOrderByInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
};

export type conditional_GrantWhereInput = {
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  grantId_isNull?: InputMaybe<Scalars['Boolean']>;
  grantId_eq?: InputMaybe<Scalars['String']>;
  grantId_not_eq?: InputMaybe<Scalars['String']>;
  grantId_gt?: InputMaybe<Scalars['String']>;
  grantId_gte?: InputMaybe<Scalars['String']>;
  grantId_lt?: InputMaybe<Scalars['String']>;
  grantId_lte?: InputMaybe<Scalars['String']>;
  grantId_in?: InputMaybe<Array<Scalars['String']>>;
  grantId_not_in?: InputMaybe<Array<Scalars['String']>>;
  grantId_contains?: InputMaybe<Scalars['String']>;
  grantId_not_contains?: InputMaybe<Scalars['String']>;
  grantId_containsInsensitive?: InputMaybe<Scalars['String']>;
  grantId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  grantId_startsWith?: InputMaybe<Scalars['String']>;
  grantId_not_startsWith?: InputMaybe<Scalars['String']>;
  grantId_endsWith?: InputMaybe<Scalars['String']>;
  grantId_not_endsWith?: InputMaybe<Scalars['String']>;
  questionEntityId_isNull?: InputMaybe<Scalars['Boolean']>;
  questionEntityId_eq?: InputMaybe<Scalars['String']>;
  questionEntityId_not_eq?: InputMaybe<Scalars['String']>;
  questionEntityId_gt?: InputMaybe<Scalars['String']>;
  questionEntityId_gte?: InputMaybe<Scalars['String']>;
  questionEntityId_lt?: InputMaybe<Scalars['String']>;
  questionEntityId_lte?: InputMaybe<Scalars['String']>;
  questionEntityId_in?: InputMaybe<Array<Scalars['String']>>;
  questionEntityId_not_in?: InputMaybe<Array<Scalars['String']>>;
  questionEntityId_contains?: InputMaybe<Scalars['String']>;
  questionEntityId_not_contains?: InputMaybe<Scalars['String']>;
  questionEntityId_containsInsensitive?: InputMaybe<Scalars['String']>;
  questionEntityId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  questionEntityId_startsWith?: InputMaybe<Scalars['String']>;
  questionEntityId_not_startsWith?: InputMaybe<Scalars['String']>;
  questionEntityId_endsWith?: InputMaybe<Scalars['String']>;
  questionEntityId_not_endsWith?: InputMaybe<Scalars['String']>;
  questionEntity_isNull?: InputMaybe<Scalars['Boolean']>;
  questionEntity?: InputMaybe<conditional_QuestionWhereInput>;
  creatorId_isNull?: InputMaybe<Scalars['Boolean']>;
  creatorId_eq?: InputMaybe<Scalars['String']>;
  creatorId_not_eq?: InputMaybe<Scalars['String']>;
  creatorId_gt?: InputMaybe<Scalars['String']>;
  creatorId_gte?: InputMaybe<Scalars['String']>;
  creatorId_lt?: InputMaybe<Scalars['String']>;
  creatorId_lte?: InputMaybe<Scalars['String']>;
  creatorId_in?: InputMaybe<Array<Scalars['String']>>;
  creatorId_not_in?: InputMaybe<Array<Scalars['String']>>;
  creatorId_contains?: InputMaybe<Scalars['String']>;
  creatorId_not_contains?: InputMaybe<Scalars['String']>;
  creatorId_containsInsensitive?: InputMaybe<Scalars['String']>;
  creatorId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  creatorId_startsWith?: InputMaybe<Scalars['String']>;
  creatorId_not_startsWith?: InputMaybe<Scalars['String']>;
  creatorId_endsWith?: InputMaybe<Scalars['String']>;
  creatorId_not_endsWith?: InputMaybe<Scalars['String']>;
  creator_isNull?: InputMaybe<Scalars['Boolean']>;
  creator?: InputMaybe<conditional_WalletWhereInput>;
  recipientId_isNull?: InputMaybe<Scalars['Boolean']>;
  recipientId_eq?: InputMaybe<Scalars['String']>;
  recipientId_not_eq?: InputMaybe<Scalars['String']>;
  recipientId_gt?: InputMaybe<Scalars['String']>;
  recipientId_gte?: InputMaybe<Scalars['String']>;
  recipientId_lt?: InputMaybe<Scalars['String']>;
  recipientId_lte?: InputMaybe<Scalars['String']>;
  recipientId_in?: InputMaybe<Array<Scalars['String']>>;
  recipientId_not_in?: InputMaybe<Array<Scalars['String']>>;
  recipientId_contains?: InputMaybe<Scalars['String']>;
  recipientId_not_contains?: InputMaybe<Scalars['String']>;
  recipientId_containsInsensitive?: InputMaybe<Scalars['String']>;
  recipientId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  recipientId_startsWith?: InputMaybe<Scalars['String']>;
  recipientId_not_startsWith?: InputMaybe<Scalars['String']>;
  recipientId_endsWith?: InputMaybe<Scalars['String']>;
  recipientId_not_endsWith?: InputMaybe<Scalars['String']>;
  recipient_isNull?: InputMaybe<Scalars['Boolean']>;
  recipient?: InputMaybe<conditional_WalletWhereInput>;
  amount_isNull?: InputMaybe<Scalars['Boolean']>;
  amount_eq?: InputMaybe<Scalars['BigInt']>;
  amount_not_eq?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountD_isNull?: InputMaybe<Scalars['Boolean']>;
  amountD_eq?: InputMaybe<Scalars['Float']>;
  amountD_not_eq?: InputMaybe<Scalars['Float']>;
  amountD_gt?: InputMaybe<Scalars['Float']>;
  amountD_gte?: InputMaybe<Scalars['Float']>;
  amountD_lt?: InputMaybe<Scalars['Float']>;
  amountD_lte?: InputMaybe<Scalars['Float']>;
  amountD_in?: InputMaybe<Array<Scalars['Float']>>;
  amountD_not_in?: InputMaybe<Array<Scalars['Float']>>;
  question_isNull?: InputMaybe<Scalars['Boolean']>;
  question_eq?: InputMaybe<Scalars['String']>;
  question_not_eq?: InputMaybe<Scalars['String']>;
  question_gt?: InputMaybe<Scalars['String']>;
  question_gte?: InputMaybe<Scalars['String']>;
  question_lt?: InputMaybe<Scalars['String']>;
  question_lte?: InputMaybe<Scalars['String']>;
  question_in?: InputMaybe<Array<Scalars['String']>>;
  question_not_in?: InputMaybe<Array<Scalars['String']>>;
  question_contains?: InputMaybe<Scalars['String']>;
  question_not_contains?: InputMaybe<Scalars['String']>;
  question_containsInsensitive?: InputMaybe<Scalars['String']>;
  question_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  question_startsWith?: InputMaybe<Scalars['String']>;
  question_not_startsWith?: InputMaybe<Scalars['String']>;
  question_endsWith?: InputMaybe<Scalars['String']>;
  question_not_endsWith?: InputMaybe<Scalars['String']>;
  questionId_isNull?: InputMaybe<Scalars['Boolean']>;
  questionId_eq?: InputMaybe<Scalars['String']>;
  questionId_not_eq?: InputMaybe<Scalars['String']>;
  questionId_gt?: InputMaybe<Scalars['String']>;
  questionId_gte?: InputMaybe<Scalars['String']>;
  questionId_lt?: InputMaybe<Scalars['String']>;
  questionId_lte?: InputMaybe<Scalars['String']>;
  questionId_in?: InputMaybe<Array<Scalars['String']>>;
  questionId_not_in?: InputMaybe<Array<Scalars['String']>>;
  questionId_contains?: InputMaybe<Scalars['String']>;
  questionId_not_contains?: InputMaybe<Scalars['String']>;
  questionId_containsInsensitive?: InputMaybe<Scalars['String']>;
  questionId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  questionId_startsWith?: InputMaybe<Scalars['String']>;
  questionId_not_startsWith?: InputMaybe<Scalars['String']>;
  questionId_endsWith?: InputMaybe<Scalars['String']>;
  questionId_not_endsWith?: InputMaybe<Scalars['String']>;
  conditionId_isNull?: InputMaybe<Scalars['Boolean']>;
  conditionId_eq?: InputMaybe<Scalars['String']>;
  conditionId_not_eq?: InputMaybe<Scalars['String']>;
  conditionId_gt?: InputMaybe<Scalars['String']>;
  conditionId_gte?: InputMaybe<Scalars['String']>;
  conditionId_lt?: InputMaybe<Scalars['String']>;
  conditionId_lte?: InputMaybe<Scalars['String']>;
  conditionId_in?: InputMaybe<Array<Scalars['String']>>;
  conditionId_not_in?: InputMaybe<Array<Scalars['String']>>;
  conditionId_contains?: InputMaybe<Scalars['String']>;
  conditionId_not_contains?: InputMaybe<Scalars['String']>;
  conditionId_containsInsensitive?: InputMaybe<Scalars['String']>;
  conditionId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  conditionId_startsWith?: InputMaybe<Scalars['String']>;
  conditionId_not_startsWith?: InputMaybe<Scalars['String']>;
  conditionId_endsWith?: InputMaybe<Scalars['String']>;
  conditionId_not_endsWith?: InputMaybe<Scalars['String']>;
  txnHash_isNull?: InputMaybe<Scalars['Boolean']>;
  txnHash_eq?: InputMaybe<Scalars['String']>;
  txnHash_not_eq?: InputMaybe<Scalars['String']>;
  txnHash_gt?: InputMaybe<Scalars['String']>;
  txnHash_gte?: InputMaybe<Scalars['String']>;
  txnHash_lt?: InputMaybe<Scalars['String']>;
  txnHash_lte?: InputMaybe<Scalars['String']>;
  txnHash_in?: InputMaybe<Array<Scalars['String']>>;
  txnHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  txnHash_contains?: InputMaybe<Scalars['String']>;
  txnHash_not_contains?: InputMaybe<Scalars['String']>;
  txnHash_containsInsensitive?: InputMaybe<Scalars['String']>;
  txnHash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  txnHash_startsWith?: InputMaybe<Scalars['String']>;
  txnHash_not_startsWith?: InputMaybe<Scalars['String']>;
  txnHash_endsWith?: InputMaybe<Scalars['String']>;
  txnHash_not_endsWith?: InputMaybe<Scalars['String']>;
  resolved_isNull?: InputMaybe<Scalars['Boolean']>;
  resolved_eq?: InputMaybe<Scalars['Boolean']>;
  resolved_not_eq?: InputMaybe<Scalars['Boolean']>;
  success_isNull?: InputMaybe<Scalars['Boolean']>;
  success_eq?: InputMaybe<Scalars['Boolean']>;
  success_not_eq?: InputMaybe<Scalars['Boolean']>;
  collateralTokenId_isNull?: InputMaybe<Scalars['Boolean']>;
  collateralTokenId_eq?: InputMaybe<Scalars['String']>;
  collateralTokenId_not_eq?: InputMaybe<Scalars['String']>;
  collateralTokenId_gt?: InputMaybe<Scalars['String']>;
  collateralTokenId_gte?: InputMaybe<Scalars['String']>;
  collateralTokenId_lt?: InputMaybe<Scalars['String']>;
  collateralTokenId_lte?: InputMaybe<Scalars['String']>;
  collateralTokenId_in?: InputMaybe<Array<Scalars['String']>>;
  collateralTokenId_not_in?: InputMaybe<Array<Scalars['String']>>;
  collateralTokenId_contains?: InputMaybe<Scalars['String']>;
  collateralTokenId_not_contains?: InputMaybe<Scalars['String']>;
  collateralTokenId_containsInsensitive?: InputMaybe<Scalars['String']>;
  collateralTokenId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  collateralTokenId_startsWith?: InputMaybe<Scalars['String']>;
  collateralTokenId_not_startsWith?: InputMaybe<Scalars['String']>;
  collateralTokenId_endsWith?: InputMaybe<Scalars['String']>;
  collateralTokenId_not_endsWith?: InputMaybe<Scalars['String']>;
  collateralToken_isNull?: InputMaybe<Scalars['Boolean']>;
  collateralToken?: InputMaybe<conditional_TokenWhereInput>;
  deadline_isNull?: InputMaybe<Scalars['Boolean']>;
  deadline_eq?: InputMaybe<Scalars['BigInt']>;
  deadline_not_eq?: InputMaybe<Scalars['BigInt']>;
  deadline_gt?: InputMaybe<Scalars['BigInt']>;
  deadline_gte?: InputMaybe<Scalars['BigInt']>;
  deadline_lt?: InputMaybe<Scalars['BigInt']>;
  deadline_lte?: InputMaybe<Scalars['BigInt']>;
  deadline_in?: InputMaybe<Array<Scalars['BigInt']>>;
  deadline_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  creationBlockNumber_isNull?: InputMaybe<Scalars['Boolean']>;
  creationBlockNumber_eq?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_not_eq?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  creationBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  creationTimestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  creationTimestamp_eq?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_not_eq?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  creationTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  chainId_isNull?: InputMaybe<Scalars['Boolean']>;
  chainId_eq?: InputMaybe<Scalars['Int']>;
  chainId_not_eq?: InputMaybe<Scalars['Int']>;
  chainId_gt?: InputMaybe<Scalars['Int']>;
  chainId_gte?: InputMaybe<Scalars['Int']>;
  chainId_lt?: InputMaybe<Scalars['Int']>;
  chainId_lte?: InputMaybe<Scalars['Int']>;
  chainId_in?: InputMaybe<Array<Scalars['Int']>>;
  chainId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  AND?: InputMaybe<Array<conditional_GrantWhereInput>>;
  OR?: InputMaybe<Array<conditional_GrantWhereInput>>;
};

export type conditional_QuestionWhereInput = {
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  questionId_isNull?: InputMaybe<Scalars['Boolean']>;
  questionId_eq?: InputMaybe<Scalars['String']>;
  questionId_not_eq?: InputMaybe<Scalars['String']>;
  questionId_gt?: InputMaybe<Scalars['String']>;
  questionId_gte?: InputMaybe<Scalars['String']>;
  questionId_lt?: InputMaybe<Scalars['String']>;
  questionId_lte?: InputMaybe<Scalars['String']>;
  questionId_in?: InputMaybe<Array<Scalars['String']>>;
  questionId_not_in?: InputMaybe<Array<Scalars['String']>>;
  questionId_contains?: InputMaybe<Scalars['String']>;
  questionId_not_contains?: InputMaybe<Scalars['String']>;
  questionId_containsInsensitive?: InputMaybe<Scalars['String']>;
  questionId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  questionId_startsWith?: InputMaybe<Scalars['String']>;
  questionId_not_startsWith?: InputMaybe<Scalars['String']>;
  questionId_endsWith?: InputMaybe<Scalars['String']>;
  questionId_not_endsWith?: InputMaybe<Scalars['String']>;
  userId_isNull?: InputMaybe<Scalars['Boolean']>;
  userId_eq?: InputMaybe<Scalars['String']>;
  userId_not_eq?: InputMaybe<Scalars['String']>;
  userId_gt?: InputMaybe<Scalars['String']>;
  userId_gte?: InputMaybe<Scalars['String']>;
  userId_lt?: InputMaybe<Scalars['String']>;
  userId_lte?: InputMaybe<Scalars['String']>;
  userId_in?: InputMaybe<Array<Scalars['String']>>;
  userId_not_in?: InputMaybe<Array<Scalars['String']>>;
  userId_contains?: InputMaybe<Scalars['String']>;
  userId_not_contains?: InputMaybe<Scalars['String']>;
  userId_containsInsensitive?: InputMaybe<Scalars['String']>;
  userId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  userId_startsWith?: InputMaybe<Scalars['String']>;
  userId_not_startsWith?: InputMaybe<Scalars['String']>;
  userId_endsWith?: InputMaybe<Scalars['String']>;
  userId_not_endsWith?: InputMaybe<Scalars['String']>;
  user_isNull?: InputMaybe<Scalars['Boolean']>;
  user?: InputMaybe<conditional_WalletWhereInput>;
  templateId_isNull?: InputMaybe<Scalars['Boolean']>;
  templateId_eq?: InputMaybe<Scalars['BigInt']>;
  templateId_not_eq?: InputMaybe<Scalars['BigInt']>;
  templateId_gt?: InputMaybe<Scalars['BigInt']>;
  templateId_gte?: InputMaybe<Scalars['BigInt']>;
  templateId_lt?: InputMaybe<Scalars['BigInt']>;
  templateId_lte?: InputMaybe<Scalars['BigInt']>;
  templateId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  templateId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  question_isNull?: InputMaybe<Scalars['Boolean']>;
  question_eq?: InputMaybe<Scalars['String']>;
  question_not_eq?: InputMaybe<Scalars['String']>;
  question_gt?: InputMaybe<Scalars['String']>;
  question_gte?: InputMaybe<Scalars['String']>;
  question_lt?: InputMaybe<Scalars['String']>;
  question_lte?: InputMaybe<Scalars['String']>;
  question_in?: InputMaybe<Array<Scalars['String']>>;
  question_not_in?: InputMaybe<Array<Scalars['String']>>;
  question_contains?: InputMaybe<Scalars['String']>;
  question_not_contains?: InputMaybe<Scalars['String']>;
  question_containsInsensitive?: InputMaybe<Scalars['String']>;
  question_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  question_startsWith?: InputMaybe<Scalars['String']>;
  question_not_startsWith?: InputMaybe<Scalars['String']>;
  question_endsWith?: InputMaybe<Scalars['String']>;
  question_not_endsWith?: InputMaybe<Scalars['String']>;
  contentHash_isNull?: InputMaybe<Scalars['Boolean']>;
  contentHash_eq?: InputMaybe<Scalars['String']>;
  contentHash_not_eq?: InputMaybe<Scalars['String']>;
  contentHash_gt?: InputMaybe<Scalars['String']>;
  contentHash_gte?: InputMaybe<Scalars['String']>;
  contentHash_lt?: InputMaybe<Scalars['String']>;
  contentHash_lte?: InputMaybe<Scalars['String']>;
  contentHash_in?: InputMaybe<Array<Scalars['String']>>;
  contentHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  contentHash_contains?: InputMaybe<Scalars['String']>;
  contentHash_not_contains?: InputMaybe<Scalars['String']>;
  contentHash_containsInsensitive?: InputMaybe<Scalars['String']>;
  contentHash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  contentHash_startsWith?: InputMaybe<Scalars['String']>;
  contentHash_not_startsWith?: InputMaybe<Scalars['String']>;
  contentHash_endsWith?: InputMaybe<Scalars['String']>;
  contentHash_not_endsWith?: InputMaybe<Scalars['String']>;
  arbitrator_isNull?: InputMaybe<Scalars['Boolean']>;
  arbitrator_eq?: InputMaybe<Scalars['String']>;
  arbitrator_not_eq?: InputMaybe<Scalars['String']>;
  arbitrator_gt?: InputMaybe<Scalars['String']>;
  arbitrator_gte?: InputMaybe<Scalars['String']>;
  arbitrator_lt?: InputMaybe<Scalars['String']>;
  arbitrator_lte?: InputMaybe<Scalars['String']>;
  arbitrator_in?: InputMaybe<Array<Scalars['String']>>;
  arbitrator_not_in?: InputMaybe<Array<Scalars['String']>>;
  arbitrator_contains?: InputMaybe<Scalars['String']>;
  arbitrator_not_contains?: InputMaybe<Scalars['String']>;
  arbitrator_containsInsensitive?: InputMaybe<Scalars['String']>;
  arbitrator_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  arbitrator_startsWith?: InputMaybe<Scalars['String']>;
  arbitrator_not_startsWith?: InputMaybe<Scalars['String']>;
  arbitrator_endsWith?: InputMaybe<Scalars['String']>;
  arbitrator_not_endsWith?: InputMaybe<Scalars['String']>;
  timeout_isNull?: InputMaybe<Scalars['Boolean']>;
  timeout_eq?: InputMaybe<Scalars['Int']>;
  timeout_not_eq?: InputMaybe<Scalars['Int']>;
  timeout_gt?: InputMaybe<Scalars['Int']>;
  timeout_gte?: InputMaybe<Scalars['Int']>;
  timeout_lt?: InputMaybe<Scalars['Int']>;
  timeout_lte?: InputMaybe<Scalars['Int']>;
  timeout_in?: InputMaybe<Array<Scalars['Int']>>;
  timeout_not_in?: InputMaybe<Array<Scalars['Int']>>;
  openingTs_isNull?: InputMaybe<Scalars['Boolean']>;
  openingTs_eq?: InputMaybe<Scalars['BigInt']>;
  openingTs_not_eq?: InputMaybe<Scalars['BigInt']>;
  openingTs_gt?: InputMaybe<Scalars['BigInt']>;
  openingTs_gte?: InputMaybe<Scalars['BigInt']>;
  openingTs_lt?: InputMaybe<Scalars['BigInt']>;
  openingTs_lte?: InputMaybe<Scalars['BigInt']>;
  openingTs_in?: InputMaybe<Array<Scalars['BigInt']>>;
  openingTs_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  minBond_isNull?: InputMaybe<Scalars['Boolean']>;
  minBond_eq?: InputMaybe<Scalars['BigInt']>;
  minBond_not_eq?: InputMaybe<Scalars['BigInt']>;
  minBond_gt?: InputMaybe<Scalars['BigInt']>;
  minBond_gte?: InputMaybe<Scalars['BigInt']>;
  minBond_lt?: InputMaybe<Scalars['BigInt']>;
  minBond_lte?: InputMaybe<Scalars['BigInt']>;
  minBond_in?: InputMaybe<Array<Scalars['BigInt']>>;
  minBond_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  nonce_isNull?: InputMaybe<Scalars['Boolean']>;
  nonce_eq?: InputMaybe<Scalars['BigInt']>;
  nonce_not_eq?: InputMaybe<Scalars['BigInt']>;
  nonce_gt?: InputMaybe<Scalars['BigInt']>;
  nonce_gte?: InputMaybe<Scalars['BigInt']>;
  nonce_lt?: InputMaybe<Scalars['BigInt']>;
  nonce_lte?: InputMaybe<Scalars['BigInt']>;
  nonce_in?: InputMaybe<Array<Scalars['BigInt']>>;
  nonce_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  created_isNull?: InputMaybe<Scalars['Boolean']>;
  created_eq?: InputMaybe<Scalars['BigInt']>;
  created_not_eq?: InputMaybe<Scalars['BigInt']>;
  created_gt?: InputMaybe<Scalars['BigInt']>;
  created_gte?: InputMaybe<Scalars['BigInt']>;
  created_lt?: InputMaybe<Scalars['BigInt']>;
  created_lte?: InputMaybe<Scalars['BigInt']>;
  created_in?: InputMaybe<Array<Scalars['BigInt']>>;
  created_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txnHash_isNull?: InputMaybe<Scalars['Boolean']>;
  txnHash_eq?: InputMaybe<Scalars['String']>;
  txnHash_not_eq?: InputMaybe<Scalars['String']>;
  txnHash_gt?: InputMaybe<Scalars['String']>;
  txnHash_gte?: InputMaybe<Scalars['String']>;
  txnHash_lt?: InputMaybe<Scalars['String']>;
  txnHash_lte?: InputMaybe<Scalars['String']>;
  txnHash_in?: InputMaybe<Array<Scalars['String']>>;
  txnHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  txnHash_contains?: InputMaybe<Scalars['String']>;
  txnHash_not_contains?: InputMaybe<Scalars['String']>;
  txnHash_containsInsensitive?: InputMaybe<Scalars['String']>;
  txnHash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  txnHash_startsWith?: InputMaybe<Scalars['String']>;
  txnHash_not_startsWith?: InputMaybe<Scalars['String']>;
  txnHash_endsWith?: InputMaybe<Scalars['String']>;
  txnHash_not_endsWith?: InputMaybe<Scalars['String']>;
  creationBlockNumber_isNull?: InputMaybe<Scalars['Boolean']>;
  creationBlockNumber_eq?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_not_eq?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  creationBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  creationTimestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  creationTimestamp_eq?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_not_eq?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  creationTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  chainId_isNull?: InputMaybe<Scalars['Boolean']>;
  chainId_eq?: InputMaybe<Scalars['Int']>;
  chainId_not_eq?: InputMaybe<Scalars['Int']>;
  chainId_gt?: InputMaybe<Scalars['Int']>;
  chainId_gte?: InputMaybe<Scalars['Int']>;
  chainId_lt?: InputMaybe<Scalars['Int']>;
  chainId_lte?: InputMaybe<Scalars['Int']>;
  chainId_in?: InputMaybe<Array<Scalars['Int']>>;
  chainId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  answers_every?: InputMaybe<conditional_AnswerWhereInput>;
  answers_some?: InputMaybe<conditional_AnswerWhereInput>;
  answers_none?: InputMaybe<conditional_AnswerWhereInput>;
  AND?: InputMaybe<Array<conditional_QuestionWhereInput>>;
  OR?: InputMaybe<Array<conditional_QuestionWhereInput>>;
};

export type conditional_WalletWhereInput = {
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  walletAddress_isNull?: InputMaybe<Scalars['Boolean']>;
  walletAddress_eq?: InputMaybe<Scalars['String']>;
  walletAddress_not_eq?: InputMaybe<Scalars['String']>;
  walletAddress_gt?: InputMaybe<Scalars['String']>;
  walletAddress_gte?: InputMaybe<Scalars['String']>;
  walletAddress_lt?: InputMaybe<Scalars['String']>;
  walletAddress_lte?: InputMaybe<Scalars['String']>;
  walletAddress_in?: InputMaybe<Array<Scalars['String']>>;
  walletAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  walletAddress_contains?: InputMaybe<Scalars['String']>;
  walletAddress_not_contains?: InputMaybe<Scalars['String']>;
  walletAddress_containsInsensitive?: InputMaybe<Scalars['String']>;
  walletAddress_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  walletAddress_startsWith?: InputMaybe<Scalars['String']>;
  walletAddress_not_startsWith?: InputMaybe<Scalars['String']>;
  walletAddress_endsWith?: InputMaybe<Scalars['String']>;
  walletAddress_not_endsWith?: InputMaybe<Scalars['String']>;
  chainId_isNull?: InputMaybe<Scalars['Boolean']>;
  chainId_eq?: InputMaybe<Scalars['Int']>;
  chainId_not_eq?: InputMaybe<Scalars['Int']>;
  chainId_gt?: InputMaybe<Scalars['Int']>;
  chainId_gte?: InputMaybe<Scalars['Int']>;
  chainId_lt?: InputMaybe<Scalars['Int']>;
  chainId_lte?: InputMaybe<Scalars['Int']>;
  chainId_in?: InputMaybe<Array<Scalars['Int']>>;
  chainId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  grantsRecipient_every?: InputMaybe<conditional_GrantWhereInput>;
  grantsRecipient_some?: InputMaybe<conditional_GrantWhereInput>;
  grantsRecipient_none?: InputMaybe<conditional_GrantWhereInput>;
  grantsCreator_every?: InputMaybe<conditional_GrantWhereInput>;
  grantsCreator_some?: InputMaybe<conditional_GrantWhereInput>;
  grantsCreator_none?: InputMaybe<conditional_GrantWhereInput>;
  AND?: InputMaybe<Array<conditional_WalletWhereInput>>;
  OR?: InputMaybe<Array<conditional_WalletWhereInput>>;
};

export type conditional_AnswerWhereInput = {
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  answer_isNull?: InputMaybe<Scalars['Boolean']>;
  answer_eq?: InputMaybe<Scalars['String']>;
  answer_not_eq?: InputMaybe<Scalars['String']>;
  answer_gt?: InputMaybe<Scalars['String']>;
  answer_gte?: InputMaybe<Scalars['String']>;
  answer_lt?: InputMaybe<Scalars['String']>;
  answer_lte?: InputMaybe<Scalars['String']>;
  answer_in?: InputMaybe<Array<Scalars['String']>>;
  answer_not_in?: InputMaybe<Array<Scalars['String']>>;
  answer_contains?: InputMaybe<Scalars['String']>;
  answer_not_contains?: InputMaybe<Scalars['String']>;
  answer_containsInsensitive?: InputMaybe<Scalars['String']>;
  answer_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  answer_startsWith?: InputMaybe<Scalars['String']>;
  answer_not_startsWith?: InputMaybe<Scalars['String']>;
  answer_endsWith?: InputMaybe<Scalars['String']>;
  answer_not_endsWith?: InputMaybe<Scalars['String']>;
  questionId_isNull?: InputMaybe<Scalars['Boolean']>;
  questionId_eq?: InputMaybe<Scalars['String']>;
  questionId_not_eq?: InputMaybe<Scalars['String']>;
  questionId_gt?: InputMaybe<Scalars['String']>;
  questionId_gte?: InputMaybe<Scalars['String']>;
  questionId_lt?: InputMaybe<Scalars['String']>;
  questionId_lte?: InputMaybe<Scalars['String']>;
  questionId_in?: InputMaybe<Array<Scalars['String']>>;
  questionId_not_in?: InputMaybe<Array<Scalars['String']>>;
  questionId_contains?: InputMaybe<Scalars['String']>;
  questionId_not_contains?: InputMaybe<Scalars['String']>;
  questionId_containsInsensitive?: InputMaybe<Scalars['String']>;
  questionId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  questionId_startsWith?: InputMaybe<Scalars['String']>;
  questionId_not_startsWith?: InputMaybe<Scalars['String']>;
  questionId_endsWith?: InputMaybe<Scalars['String']>;
  questionId_not_endsWith?: InputMaybe<Scalars['String']>;
  question_isNull?: InputMaybe<Scalars['Boolean']>;
  question?: InputMaybe<conditional_QuestionWhereInput>;
  historyHash_isNull?: InputMaybe<Scalars['Boolean']>;
  historyHash_eq?: InputMaybe<Scalars['String']>;
  historyHash_not_eq?: InputMaybe<Scalars['String']>;
  historyHash_gt?: InputMaybe<Scalars['String']>;
  historyHash_gte?: InputMaybe<Scalars['String']>;
  historyHash_lt?: InputMaybe<Scalars['String']>;
  historyHash_lte?: InputMaybe<Scalars['String']>;
  historyHash_in?: InputMaybe<Array<Scalars['String']>>;
  historyHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  historyHash_contains?: InputMaybe<Scalars['String']>;
  historyHash_not_contains?: InputMaybe<Scalars['String']>;
  historyHash_containsInsensitive?: InputMaybe<Scalars['String']>;
  historyHash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  historyHash_startsWith?: InputMaybe<Scalars['String']>;
  historyHash_not_startsWith?: InputMaybe<Scalars['String']>;
  historyHash_endsWith?: InputMaybe<Scalars['String']>;
  historyHash_not_endsWith?: InputMaybe<Scalars['String']>;
  userId_isNull?: InputMaybe<Scalars['Boolean']>;
  userId_eq?: InputMaybe<Scalars['String']>;
  userId_not_eq?: InputMaybe<Scalars['String']>;
  userId_gt?: InputMaybe<Scalars['String']>;
  userId_gte?: InputMaybe<Scalars['String']>;
  userId_lt?: InputMaybe<Scalars['String']>;
  userId_lte?: InputMaybe<Scalars['String']>;
  userId_in?: InputMaybe<Array<Scalars['String']>>;
  userId_not_in?: InputMaybe<Array<Scalars['String']>>;
  userId_contains?: InputMaybe<Scalars['String']>;
  userId_not_contains?: InputMaybe<Scalars['String']>;
  userId_containsInsensitive?: InputMaybe<Scalars['String']>;
  userId_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  userId_startsWith?: InputMaybe<Scalars['String']>;
  userId_not_startsWith?: InputMaybe<Scalars['String']>;
  userId_endsWith?: InputMaybe<Scalars['String']>;
  userId_not_endsWith?: InputMaybe<Scalars['String']>;
  user_isNull?: InputMaybe<Scalars['Boolean']>;
  user?: InputMaybe<conditional_WalletWhereInput>;
  bond_isNull?: InputMaybe<Scalars['Boolean']>;
  bond_eq?: InputMaybe<Scalars['BigInt']>;
  bond_not_eq?: InputMaybe<Scalars['BigInt']>;
  bond_gt?: InputMaybe<Scalars['BigInt']>;
  bond_gte?: InputMaybe<Scalars['BigInt']>;
  bond_lt?: InputMaybe<Scalars['BigInt']>;
  bond_lte?: InputMaybe<Scalars['BigInt']>;
  bond_in?: InputMaybe<Array<Scalars['BigInt']>>;
  bond_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  ts_isNull?: InputMaybe<Scalars['Boolean']>;
  ts_eq?: InputMaybe<Scalars['BigInt']>;
  ts_not_eq?: InputMaybe<Scalars['BigInt']>;
  ts_gt?: InputMaybe<Scalars['BigInt']>;
  ts_gte?: InputMaybe<Scalars['BigInt']>;
  ts_lt?: InputMaybe<Scalars['BigInt']>;
  ts_lte?: InputMaybe<Scalars['BigInt']>;
  ts_in?: InputMaybe<Array<Scalars['BigInt']>>;
  ts_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  isCommitment_isNull?: InputMaybe<Scalars['Boolean']>;
  isCommitment_eq?: InputMaybe<Scalars['Boolean']>;
  isCommitment_not_eq?: InputMaybe<Scalars['Boolean']>;
  txnHash_isNull?: InputMaybe<Scalars['Boolean']>;
  txnHash_eq?: InputMaybe<Scalars['String']>;
  txnHash_not_eq?: InputMaybe<Scalars['String']>;
  txnHash_gt?: InputMaybe<Scalars['String']>;
  txnHash_gte?: InputMaybe<Scalars['String']>;
  txnHash_lt?: InputMaybe<Scalars['String']>;
  txnHash_lte?: InputMaybe<Scalars['String']>;
  txnHash_in?: InputMaybe<Array<Scalars['String']>>;
  txnHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  txnHash_contains?: InputMaybe<Scalars['String']>;
  txnHash_not_contains?: InputMaybe<Scalars['String']>;
  txnHash_containsInsensitive?: InputMaybe<Scalars['String']>;
  txnHash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  txnHash_startsWith?: InputMaybe<Scalars['String']>;
  txnHash_not_startsWith?: InputMaybe<Scalars['String']>;
  txnHash_endsWith?: InputMaybe<Scalars['String']>;
  txnHash_not_endsWith?: InputMaybe<Scalars['String']>;
  creationBlockNumber_isNull?: InputMaybe<Scalars['Boolean']>;
  creationBlockNumber_eq?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_not_eq?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  creationBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  creationBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  creationTimestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  creationTimestamp_eq?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_not_eq?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  creationTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  creationTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  chainId_isNull?: InputMaybe<Scalars['Boolean']>;
  chainId_eq?: InputMaybe<Scalars['Int']>;
  chainId_not_eq?: InputMaybe<Scalars['Int']>;
  chainId_gt?: InputMaybe<Scalars['Int']>;
  chainId_gte?: InputMaybe<Scalars['Int']>;
  chainId_lt?: InputMaybe<Scalars['Int']>;
  chainId_lte?: InputMaybe<Scalars['Int']>;
  chainId_in?: InputMaybe<Array<Scalars['Int']>>;
  chainId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  AND?: InputMaybe<Array<conditional_AnswerWhereInput>>;
  OR?: InputMaybe<Array<conditional_AnswerWhereInput>>;
};

export type conditional_TokenWhereInput = {
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  name_isNull?: InputMaybe<Scalars['Boolean']>;
  name_eq?: InputMaybe<Scalars['String']>;
  name_not_eq?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_startsWith?: InputMaybe<Scalars['String']>;
  name_not_startsWith?: InputMaybe<Scalars['String']>;
  name_endsWith?: InputMaybe<Scalars['String']>;
  name_not_endsWith?: InputMaybe<Scalars['String']>;
  symbol_isNull?: InputMaybe<Scalars['Boolean']>;
  symbol_eq?: InputMaybe<Scalars['String']>;
  symbol_not_eq?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_containsInsensitive?: InputMaybe<Scalars['String']>;
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  symbol_startsWith?: InputMaybe<Scalars['String']>;
  symbol_not_startsWith?: InputMaybe<Scalars['String']>;
  symbol_endsWith?: InputMaybe<Scalars['String']>;
  symbol_not_endsWith?: InputMaybe<Scalars['String']>;
  decimals_isNull?: InputMaybe<Scalars['Boolean']>;
  decimals_eq?: InputMaybe<Scalars['Int']>;
  decimals_not_eq?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  chainId_isNull?: InputMaybe<Scalars['Boolean']>;
  chainId_eq?: InputMaybe<Scalars['Int']>;
  chainId_not_eq?: InputMaybe<Scalars['Int']>;
  chainId_gt?: InputMaybe<Scalars['Int']>;
  chainId_gte?: InputMaybe<Scalars['Int']>;
  chainId_lt?: InputMaybe<Scalars['Int']>;
  chainId_lte?: InputMaybe<Scalars['Int']>;
  chainId_in?: InputMaybe<Array<Scalars['Int']>>;
  chainId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  tokenAddress_isNull?: InputMaybe<Scalars['Boolean']>;
  tokenAddress_eq?: InputMaybe<Scalars['String']>;
  tokenAddress_not_eq?: InputMaybe<Scalars['String']>;
  tokenAddress_gt?: InputMaybe<Scalars['String']>;
  tokenAddress_gte?: InputMaybe<Scalars['String']>;
  tokenAddress_lt?: InputMaybe<Scalars['String']>;
  tokenAddress_lte?: InputMaybe<Scalars['String']>;
  tokenAddress_in?: InputMaybe<Array<Scalars['String']>>;
  tokenAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  tokenAddress_contains?: InputMaybe<Scalars['String']>;
  tokenAddress_not_contains?: InputMaybe<Scalars['String']>;
  tokenAddress_containsInsensitive?: InputMaybe<Scalars['String']>;
  tokenAddress_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  tokenAddress_startsWith?: InputMaybe<Scalars['String']>;
  tokenAddress_not_startsWith?: InputMaybe<Scalars['String']>;
  tokenAddress_endsWith?: InputMaybe<Scalars['String']>;
  tokenAddress_not_endsWith?: InputMaybe<Scalars['String']>;
  AND?: InputMaybe<Array<conditional_TokenWhereInput>>;
  OR?: InputMaybe<Array<conditional_TokenWhereInput>>;
};

export type conditional_GrantOrderByInput =
  | 'id_ASC'
  | 'id_DESC'
  | 'id_ASC_NULLS_FIRST'
  | 'id_ASC_NULLS_LAST'
  | 'id_DESC_NULLS_FIRST'
  | 'id_DESC_NULLS_LAST'
  | 'grantId_ASC'
  | 'grantId_DESC'
  | 'grantId_ASC_NULLS_FIRST'
  | 'grantId_ASC_NULLS_LAST'
  | 'grantId_DESC_NULLS_FIRST'
  | 'grantId_DESC_NULLS_LAST'
  | 'questionEntityId_ASC'
  | 'questionEntityId_DESC'
  | 'questionEntityId_ASC_NULLS_FIRST'
  | 'questionEntityId_ASC_NULLS_LAST'
  | 'questionEntityId_DESC_NULLS_FIRST'
  | 'questionEntityId_DESC_NULLS_LAST'
  | 'questionEntity_id_ASC'
  | 'questionEntity_id_DESC'
  | 'questionEntity_id_ASC_NULLS_FIRST'
  | 'questionEntity_id_ASC_NULLS_LAST'
  | 'questionEntity_id_DESC_NULLS_FIRST'
  | 'questionEntity_id_DESC_NULLS_LAST'
  | 'questionEntity_questionId_ASC'
  | 'questionEntity_questionId_DESC'
  | 'questionEntity_questionId_ASC_NULLS_FIRST'
  | 'questionEntity_questionId_ASC_NULLS_LAST'
  | 'questionEntity_questionId_DESC_NULLS_FIRST'
  | 'questionEntity_questionId_DESC_NULLS_LAST'
  | 'questionEntity_userId_ASC'
  | 'questionEntity_userId_DESC'
  | 'questionEntity_userId_ASC_NULLS_FIRST'
  | 'questionEntity_userId_ASC_NULLS_LAST'
  | 'questionEntity_userId_DESC_NULLS_FIRST'
  | 'questionEntity_userId_DESC_NULLS_LAST'
  | 'questionEntity_templateId_ASC'
  | 'questionEntity_templateId_DESC'
  | 'questionEntity_templateId_ASC_NULLS_FIRST'
  | 'questionEntity_templateId_ASC_NULLS_LAST'
  | 'questionEntity_templateId_DESC_NULLS_FIRST'
  | 'questionEntity_templateId_DESC_NULLS_LAST'
  | 'questionEntity_question_ASC'
  | 'questionEntity_question_DESC'
  | 'questionEntity_question_ASC_NULLS_FIRST'
  | 'questionEntity_question_ASC_NULLS_LAST'
  | 'questionEntity_question_DESC_NULLS_FIRST'
  | 'questionEntity_question_DESC_NULLS_LAST'
  | 'questionEntity_contentHash_ASC'
  | 'questionEntity_contentHash_DESC'
  | 'questionEntity_contentHash_ASC_NULLS_FIRST'
  | 'questionEntity_contentHash_ASC_NULLS_LAST'
  | 'questionEntity_contentHash_DESC_NULLS_FIRST'
  | 'questionEntity_contentHash_DESC_NULLS_LAST'
  | 'questionEntity_arbitrator_ASC'
  | 'questionEntity_arbitrator_DESC'
  | 'questionEntity_arbitrator_ASC_NULLS_FIRST'
  | 'questionEntity_arbitrator_ASC_NULLS_LAST'
  | 'questionEntity_arbitrator_DESC_NULLS_FIRST'
  | 'questionEntity_arbitrator_DESC_NULLS_LAST'
  | 'questionEntity_timeout_ASC'
  | 'questionEntity_timeout_DESC'
  | 'questionEntity_timeout_ASC_NULLS_FIRST'
  | 'questionEntity_timeout_ASC_NULLS_LAST'
  | 'questionEntity_timeout_DESC_NULLS_FIRST'
  | 'questionEntity_timeout_DESC_NULLS_LAST'
  | 'questionEntity_openingTs_ASC'
  | 'questionEntity_openingTs_DESC'
  | 'questionEntity_openingTs_ASC_NULLS_FIRST'
  | 'questionEntity_openingTs_ASC_NULLS_LAST'
  | 'questionEntity_openingTs_DESC_NULLS_FIRST'
  | 'questionEntity_openingTs_DESC_NULLS_LAST'
  | 'questionEntity_minBond_ASC'
  | 'questionEntity_minBond_DESC'
  | 'questionEntity_minBond_ASC_NULLS_FIRST'
  | 'questionEntity_minBond_ASC_NULLS_LAST'
  | 'questionEntity_minBond_DESC_NULLS_FIRST'
  | 'questionEntity_minBond_DESC_NULLS_LAST'
  | 'questionEntity_nonce_ASC'
  | 'questionEntity_nonce_DESC'
  | 'questionEntity_nonce_ASC_NULLS_FIRST'
  | 'questionEntity_nonce_ASC_NULLS_LAST'
  | 'questionEntity_nonce_DESC_NULLS_FIRST'
  | 'questionEntity_nonce_DESC_NULLS_LAST'
  | 'questionEntity_created_ASC'
  | 'questionEntity_created_DESC'
  | 'questionEntity_created_ASC_NULLS_FIRST'
  | 'questionEntity_created_ASC_NULLS_LAST'
  | 'questionEntity_created_DESC_NULLS_FIRST'
  | 'questionEntity_created_DESC_NULLS_LAST'
  | 'questionEntity_txnHash_ASC'
  | 'questionEntity_txnHash_DESC'
  | 'questionEntity_txnHash_ASC_NULLS_FIRST'
  | 'questionEntity_txnHash_ASC_NULLS_LAST'
  | 'questionEntity_txnHash_DESC_NULLS_FIRST'
  | 'questionEntity_txnHash_DESC_NULLS_LAST'
  | 'questionEntity_creationBlockNumber_ASC'
  | 'questionEntity_creationBlockNumber_DESC'
  | 'questionEntity_creationBlockNumber_ASC_NULLS_FIRST'
  | 'questionEntity_creationBlockNumber_ASC_NULLS_LAST'
  | 'questionEntity_creationBlockNumber_DESC_NULLS_FIRST'
  | 'questionEntity_creationBlockNumber_DESC_NULLS_LAST'
  | 'questionEntity_creationTimestamp_ASC'
  | 'questionEntity_creationTimestamp_DESC'
  | 'questionEntity_creationTimestamp_ASC_NULLS_FIRST'
  | 'questionEntity_creationTimestamp_ASC_NULLS_LAST'
  | 'questionEntity_creationTimestamp_DESC_NULLS_FIRST'
  | 'questionEntity_creationTimestamp_DESC_NULLS_LAST'
  | 'questionEntity_chainId_ASC'
  | 'questionEntity_chainId_DESC'
  | 'questionEntity_chainId_ASC_NULLS_FIRST'
  | 'questionEntity_chainId_ASC_NULLS_LAST'
  | 'questionEntity_chainId_DESC_NULLS_FIRST'
  | 'questionEntity_chainId_DESC_NULLS_LAST'
  | 'creatorId_ASC'
  | 'creatorId_DESC'
  | 'creatorId_ASC_NULLS_FIRST'
  | 'creatorId_ASC_NULLS_LAST'
  | 'creatorId_DESC_NULLS_FIRST'
  | 'creatorId_DESC_NULLS_LAST'
  | 'creator_id_ASC'
  | 'creator_id_DESC'
  | 'creator_id_ASC_NULLS_FIRST'
  | 'creator_id_ASC_NULLS_LAST'
  | 'creator_id_DESC_NULLS_FIRST'
  | 'creator_id_DESC_NULLS_LAST'
  | 'creator_walletAddress_ASC'
  | 'creator_walletAddress_DESC'
  | 'creator_walletAddress_ASC_NULLS_FIRST'
  | 'creator_walletAddress_ASC_NULLS_LAST'
  | 'creator_walletAddress_DESC_NULLS_FIRST'
  | 'creator_walletAddress_DESC_NULLS_LAST'
  | 'creator_chainId_ASC'
  | 'creator_chainId_DESC'
  | 'creator_chainId_ASC_NULLS_FIRST'
  | 'creator_chainId_ASC_NULLS_LAST'
  | 'creator_chainId_DESC_NULLS_FIRST'
  | 'creator_chainId_DESC_NULLS_LAST'
  | 'recipientId_ASC'
  | 'recipientId_DESC'
  | 'recipientId_ASC_NULLS_FIRST'
  | 'recipientId_ASC_NULLS_LAST'
  | 'recipientId_DESC_NULLS_FIRST'
  | 'recipientId_DESC_NULLS_LAST'
  | 'recipient_id_ASC'
  | 'recipient_id_DESC'
  | 'recipient_id_ASC_NULLS_FIRST'
  | 'recipient_id_ASC_NULLS_LAST'
  | 'recipient_id_DESC_NULLS_FIRST'
  | 'recipient_id_DESC_NULLS_LAST'
  | 'recipient_walletAddress_ASC'
  | 'recipient_walletAddress_DESC'
  | 'recipient_walletAddress_ASC_NULLS_FIRST'
  | 'recipient_walletAddress_ASC_NULLS_LAST'
  | 'recipient_walletAddress_DESC_NULLS_FIRST'
  | 'recipient_walletAddress_DESC_NULLS_LAST'
  | 'recipient_chainId_ASC'
  | 'recipient_chainId_DESC'
  | 'recipient_chainId_ASC_NULLS_FIRST'
  | 'recipient_chainId_ASC_NULLS_LAST'
  | 'recipient_chainId_DESC_NULLS_FIRST'
  | 'recipient_chainId_DESC_NULLS_LAST'
  | 'amount_ASC'
  | 'amount_DESC'
  | 'amount_ASC_NULLS_FIRST'
  | 'amount_ASC_NULLS_LAST'
  | 'amount_DESC_NULLS_FIRST'
  | 'amount_DESC_NULLS_LAST'
  | 'amountD_ASC'
  | 'amountD_DESC'
  | 'amountD_ASC_NULLS_FIRST'
  | 'amountD_ASC_NULLS_LAST'
  | 'amountD_DESC_NULLS_FIRST'
  | 'amountD_DESC_NULLS_LAST'
  | 'question_ASC'
  | 'question_DESC'
  | 'question_ASC_NULLS_FIRST'
  | 'question_ASC_NULLS_LAST'
  | 'question_DESC_NULLS_FIRST'
  | 'question_DESC_NULLS_LAST'
  | 'questionId_ASC'
  | 'questionId_DESC'
  | 'questionId_ASC_NULLS_FIRST'
  | 'questionId_ASC_NULLS_LAST'
  | 'questionId_DESC_NULLS_FIRST'
  | 'questionId_DESC_NULLS_LAST'
  | 'conditionId_ASC'
  | 'conditionId_DESC'
  | 'conditionId_ASC_NULLS_FIRST'
  | 'conditionId_ASC_NULLS_LAST'
  | 'conditionId_DESC_NULLS_FIRST'
  | 'conditionId_DESC_NULLS_LAST'
  | 'txnHash_ASC'
  | 'txnHash_DESC'
  | 'txnHash_ASC_NULLS_FIRST'
  | 'txnHash_ASC_NULLS_LAST'
  | 'txnHash_DESC_NULLS_FIRST'
  | 'txnHash_DESC_NULLS_LAST'
  | 'resolved_ASC'
  | 'resolved_DESC'
  | 'resolved_ASC_NULLS_FIRST'
  | 'resolved_ASC_NULLS_LAST'
  | 'resolved_DESC_NULLS_FIRST'
  | 'resolved_DESC_NULLS_LAST'
  | 'success_ASC'
  | 'success_DESC'
  | 'success_ASC_NULLS_FIRST'
  | 'success_ASC_NULLS_LAST'
  | 'success_DESC_NULLS_FIRST'
  | 'success_DESC_NULLS_LAST'
  | 'collateralTokenId_ASC'
  | 'collateralTokenId_DESC'
  | 'collateralTokenId_ASC_NULLS_FIRST'
  | 'collateralTokenId_ASC_NULLS_LAST'
  | 'collateralTokenId_DESC_NULLS_FIRST'
  | 'collateralTokenId_DESC_NULLS_LAST'
  | 'collateralToken_id_ASC'
  | 'collateralToken_id_DESC'
  | 'collateralToken_id_ASC_NULLS_FIRST'
  | 'collateralToken_id_ASC_NULLS_LAST'
  | 'collateralToken_id_DESC_NULLS_FIRST'
  | 'collateralToken_id_DESC_NULLS_LAST'
  | 'collateralToken_name_ASC'
  | 'collateralToken_name_DESC'
  | 'collateralToken_name_ASC_NULLS_FIRST'
  | 'collateralToken_name_ASC_NULLS_LAST'
  | 'collateralToken_name_DESC_NULLS_FIRST'
  | 'collateralToken_name_DESC_NULLS_LAST'
  | 'collateralToken_symbol_ASC'
  | 'collateralToken_symbol_DESC'
  | 'collateralToken_symbol_ASC_NULLS_FIRST'
  | 'collateralToken_symbol_ASC_NULLS_LAST'
  | 'collateralToken_symbol_DESC_NULLS_FIRST'
  | 'collateralToken_symbol_DESC_NULLS_LAST'
  | 'collateralToken_decimals_ASC'
  | 'collateralToken_decimals_DESC'
  | 'collateralToken_decimals_ASC_NULLS_FIRST'
  | 'collateralToken_decimals_ASC_NULLS_LAST'
  | 'collateralToken_decimals_DESC_NULLS_FIRST'
  | 'collateralToken_decimals_DESC_NULLS_LAST'
  | 'collateralToken_chainId_ASC'
  | 'collateralToken_chainId_DESC'
  | 'collateralToken_chainId_ASC_NULLS_FIRST'
  | 'collateralToken_chainId_ASC_NULLS_LAST'
  | 'collateralToken_chainId_DESC_NULLS_FIRST'
  | 'collateralToken_chainId_DESC_NULLS_LAST'
  | 'collateralToken_tokenAddress_ASC'
  | 'collateralToken_tokenAddress_DESC'
  | 'collateralToken_tokenAddress_ASC_NULLS_FIRST'
  | 'collateralToken_tokenAddress_ASC_NULLS_LAST'
  | 'collateralToken_tokenAddress_DESC_NULLS_FIRST'
  | 'collateralToken_tokenAddress_DESC_NULLS_LAST'
  | 'deadline_ASC'
  | 'deadline_DESC'
  | 'deadline_ASC_NULLS_FIRST'
  | 'deadline_ASC_NULLS_LAST'
  | 'deadline_DESC_NULLS_FIRST'
  | 'deadline_DESC_NULLS_LAST'
  | 'creationBlockNumber_ASC'
  | 'creationBlockNumber_DESC'
  | 'creationBlockNumber_ASC_NULLS_FIRST'
  | 'creationBlockNumber_ASC_NULLS_LAST'
  | 'creationBlockNumber_DESC_NULLS_FIRST'
  | 'creationBlockNumber_DESC_NULLS_LAST'
  | 'creationTimestamp_ASC'
  | 'creationTimestamp_DESC'
  | 'creationTimestamp_ASC_NULLS_FIRST'
  | 'creationTimestamp_ASC_NULLS_LAST'
  | 'creationTimestamp_DESC_NULLS_FIRST'
  | 'creationTimestamp_DESC_NULLS_LAST'
  | 'chainId_ASC'
  | 'chainId_DESC'
  | 'chainId_ASC_NULLS_FIRST'
  | 'chainId_ASC_NULLS_LAST'
  | 'chainId_DESC_NULLS_FIRST'
  | 'chainId_DESC_NULLS_LAST';

export type conditional_Answer = {
  id: Scalars['String'];
  answer: Scalars['String'];
  questionId: Scalars['String'];
  question: conditional_Question;
  historyHash: Scalars['String'];
  userId: Scalars['String'];
  user: conditional_Wallet;
  bond: Scalars['BigInt'];
  ts: Scalars['BigInt'];
  isCommitment: Scalars['Boolean'];
  txnHash: Scalars['String'];
  /** creation block */
  creationBlockNumber: Scalars['BigInt'];
  /** creation timestamp */
  creationTimestamp: Scalars['BigInt'];
  chainId: Scalars['Int'];
};

export type conditional_AnswerOrderByInput =
  | 'id_ASC'
  | 'id_DESC'
  | 'id_ASC_NULLS_FIRST'
  | 'id_ASC_NULLS_LAST'
  | 'id_DESC_NULLS_FIRST'
  | 'id_DESC_NULLS_LAST'
  | 'answer_ASC'
  | 'answer_DESC'
  | 'answer_ASC_NULLS_FIRST'
  | 'answer_ASC_NULLS_LAST'
  | 'answer_DESC_NULLS_FIRST'
  | 'answer_DESC_NULLS_LAST'
  | 'questionId_ASC'
  | 'questionId_DESC'
  | 'questionId_ASC_NULLS_FIRST'
  | 'questionId_ASC_NULLS_LAST'
  | 'questionId_DESC_NULLS_FIRST'
  | 'questionId_DESC_NULLS_LAST'
  | 'question_id_ASC'
  | 'question_id_DESC'
  | 'question_id_ASC_NULLS_FIRST'
  | 'question_id_ASC_NULLS_LAST'
  | 'question_id_DESC_NULLS_FIRST'
  | 'question_id_DESC_NULLS_LAST'
  | 'question_questionId_ASC'
  | 'question_questionId_DESC'
  | 'question_questionId_ASC_NULLS_FIRST'
  | 'question_questionId_ASC_NULLS_LAST'
  | 'question_questionId_DESC_NULLS_FIRST'
  | 'question_questionId_DESC_NULLS_LAST'
  | 'question_userId_ASC'
  | 'question_userId_DESC'
  | 'question_userId_ASC_NULLS_FIRST'
  | 'question_userId_ASC_NULLS_LAST'
  | 'question_userId_DESC_NULLS_FIRST'
  | 'question_userId_DESC_NULLS_LAST'
  | 'question_templateId_ASC'
  | 'question_templateId_DESC'
  | 'question_templateId_ASC_NULLS_FIRST'
  | 'question_templateId_ASC_NULLS_LAST'
  | 'question_templateId_DESC_NULLS_FIRST'
  | 'question_templateId_DESC_NULLS_LAST'
  | 'question_question_ASC'
  | 'question_question_DESC'
  | 'question_question_ASC_NULLS_FIRST'
  | 'question_question_ASC_NULLS_LAST'
  | 'question_question_DESC_NULLS_FIRST'
  | 'question_question_DESC_NULLS_LAST'
  | 'question_contentHash_ASC'
  | 'question_contentHash_DESC'
  | 'question_contentHash_ASC_NULLS_FIRST'
  | 'question_contentHash_ASC_NULLS_LAST'
  | 'question_contentHash_DESC_NULLS_FIRST'
  | 'question_contentHash_DESC_NULLS_LAST'
  | 'question_arbitrator_ASC'
  | 'question_arbitrator_DESC'
  | 'question_arbitrator_ASC_NULLS_FIRST'
  | 'question_arbitrator_ASC_NULLS_LAST'
  | 'question_arbitrator_DESC_NULLS_FIRST'
  | 'question_arbitrator_DESC_NULLS_LAST'
  | 'question_timeout_ASC'
  | 'question_timeout_DESC'
  | 'question_timeout_ASC_NULLS_FIRST'
  | 'question_timeout_ASC_NULLS_LAST'
  | 'question_timeout_DESC_NULLS_FIRST'
  | 'question_timeout_DESC_NULLS_LAST'
  | 'question_openingTs_ASC'
  | 'question_openingTs_DESC'
  | 'question_openingTs_ASC_NULLS_FIRST'
  | 'question_openingTs_ASC_NULLS_LAST'
  | 'question_openingTs_DESC_NULLS_FIRST'
  | 'question_openingTs_DESC_NULLS_LAST'
  | 'question_minBond_ASC'
  | 'question_minBond_DESC'
  | 'question_minBond_ASC_NULLS_FIRST'
  | 'question_minBond_ASC_NULLS_LAST'
  | 'question_minBond_DESC_NULLS_FIRST'
  | 'question_minBond_DESC_NULLS_LAST'
  | 'question_nonce_ASC'
  | 'question_nonce_DESC'
  | 'question_nonce_ASC_NULLS_FIRST'
  | 'question_nonce_ASC_NULLS_LAST'
  | 'question_nonce_DESC_NULLS_FIRST'
  | 'question_nonce_DESC_NULLS_LAST'
  | 'question_created_ASC'
  | 'question_created_DESC'
  | 'question_created_ASC_NULLS_FIRST'
  | 'question_created_ASC_NULLS_LAST'
  | 'question_created_DESC_NULLS_FIRST'
  | 'question_created_DESC_NULLS_LAST'
  | 'question_txnHash_ASC'
  | 'question_txnHash_DESC'
  | 'question_txnHash_ASC_NULLS_FIRST'
  | 'question_txnHash_ASC_NULLS_LAST'
  | 'question_txnHash_DESC_NULLS_FIRST'
  | 'question_txnHash_DESC_NULLS_LAST'
  | 'question_creationBlockNumber_ASC'
  | 'question_creationBlockNumber_DESC'
  | 'question_creationBlockNumber_ASC_NULLS_FIRST'
  | 'question_creationBlockNumber_ASC_NULLS_LAST'
  | 'question_creationBlockNumber_DESC_NULLS_FIRST'
  | 'question_creationBlockNumber_DESC_NULLS_LAST'
  | 'question_creationTimestamp_ASC'
  | 'question_creationTimestamp_DESC'
  | 'question_creationTimestamp_ASC_NULLS_FIRST'
  | 'question_creationTimestamp_ASC_NULLS_LAST'
  | 'question_creationTimestamp_DESC_NULLS_FIRST'
  | 'question_creationTimestamp_DESC_NULLS_LAST'
  | 'question_chainId_ASC'
  | 'question_chainId_DESC'
  | 'question_chainId_ASC_NULLS_FIRST'
  | 'question_chainId_ASC_NULLS_LAST'
  | 'question_chainId_DESC_NULLS_FIRST'
  | 'question_chainId_DESC_NULLS_LAST'
  | 'historyHash_ASC'
  | 'historyHash_DESC'
  | 'historyHash_ASC_NULLS_FIRST'
  | 'historyHash_ASC_NULLS_LAST'
  | 'historyHash_DESC_NULLS_FIRST'
  | 'historyHash_DESC_NULLS_LAST'
  | 'userId_ASC'
  | 'userId_DESC'
  | 'userId_ASC_NULLS_FIRST'
  | 'userId_ASC_NULLS_LAST'
  | 'userId_DESC_NULLS_FIRST'
  | 'userId_DESC_NULLS_LAST'
  | 'user_id_ASC'
  | 'user_id_DESC'
  | 'user_id_ASC_NULLS_FIRST'
  | 'user_id_ASC_NULLS_LAST'
  | 'user_id_DESC_NULLS_FIRST'
  | 'user_id_DESC_NULLS_LAST'
  | 'user_walletAddress_ASC'
  | 'user_walletAddress_DESC'
  | 'user_walletAddress_ASC_NULLS_FIRST'
  | 'user_walletAddress_ASC_NULLS_LAST'
  | 'user_walletAddress_DESC_NULLS_FIRST'
  | 'user_walletAddress_DESC_NULLS_LAST'
  | 'user_chainId_ASC'
  | 'user_chainId_DESC'
  | 'user_chainId_ASC_NULLS_FIRST'
  | 'user_chainId_ASC_NULLS_LAST'
  | 'user_chainId_DESC_NULLS_FIRST'
  | 'user_chainId_DESC_NULLS_LAST'
  | 'bond_ASC'
  | 'bond_DESC'
  | 'bond_ASC_NULLS_FIRST'
  | 'bond_ASC_NULLS_LAST'
  | 'bond_DESC_NULLS_FIRST'
  | 'bond_DESC_NULLS_LAST'
  | 'ts_ASC'
  | 'ts_DESC'
  | 'ts_ASC_NULLS_FIRST'
  | 'ts_ASC_NULLS_LAST'
  | 'ts_DESC_NULLS_FIRST'
  | 'ts_DESC_NULLS_LAST'
  | 'isCommitment_ASC'
  | 'isCommitment_DESC'
  | 'isCommitment_ASC_NULLS_FIRST'
  | 'isCommitment_ASC_NULLS_LAST'
  | 'isCommitment_DESC_NULLS_FIRST'
  | 'isCommitment_DESC_NULLS_LAST'
  | 'txnHash_ASC'
  | 'txnHash_DESC'
  | 'txnHash_ASC_NULLS_FIRST'
  | 'txnHash_ASC_NULLS_LAST'
  | 'txnHash_DESC_NULLS_FIRST'
  | 'txnHash_DESC_NULLS_LAST'
  | 'creationBlockNumber_ASC'
  | 'creationBlockNumber_DESC'
  | 'creationBlockNumber_ASC_NULLS_FIRST'
  | 'creationBlockNumber_ASC_NULLS_LAST'
  | 'creationBlockNumber_DESC_NULLS_FIRST'
  | 'creationBlockNumber_DESC_NULLS_LAST'
  | 'creationTimestamp_ASC'
  | 'creationTimestamp_DESC'
  | 'creationTimestamp_ASC_NULLS_FIRST'
  | 'creationTimestamp_ASC_NULLS_LAST'
  | 'creationTimestamp_DESC_NULLS_FIRST'
  | 'creationTimestamp_DESC_NULLS_LAST'
  | 'chainId_ASC'
  | 'chainId_DESC'
  | 'chainId_ASC_NULLS_FIRST'
  | 'chainId_ASC_NULLS_LAST'
  | 'chainId_DESC_NULLS_FIRST'
  | 'chainId_DESC_NULLS_LAST';

export type conditional_Token = {
  id: Scalars['String'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  decimals: Scalars['Int'];
  chainId: Scalars['Int'];
  tokenAddress: Scalars['String'];
};

export type conditional_GrantsConnection = {
  edges: Array<conditional_GrantEdge>;
  pageInfo: conditional_PageInfo;
  totalCount: Scalars['Int'];
};

export type conditional_GrantEdge = {
  node: conditional_Grant;
  cursor: Scalars['String'];
};

export type conditional_PageInfo = {
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
  endCursor: Scalars['String'];
};

export type conditional_QuestionOrderByInput =
  | 'id_ASC'
  | 'id_DESC'
  | 'id_ASC_NULLS_FIRST'
  | 'id_ASC_NULLS_LAST'
  | 'id_DESC_NULLS_FIRST'
  | 'id_DESC_NULLS_LAST'
  | 'questionId_ASC'
  | 'questionId_DESC'
  | 'questionId_ASC_NULLS_FIRST'
  | 'questionId_ASC_NULLS_LAST'
  | 'questionId_DESC_NULLS_FIRST'
  | 'questionId_DESC_NULLS_LAST'
  | 'userId_ASC'
  | 'userId_DESC'
  | 'userId_ASC_NULLS_FIRST'
  | 'userId_ASC_NULLS_LAST'
  | 'userId_DESC_NULLS_FIRST'
  | 'userId_DESC_NULLS_LAST'
  | 'user_id_ASC'
  | 'user_id_DESC'
  | 'user_id_ASC_NULLS_FIRST'
  | 'user_id_ASC_NULLS_LAST'
  | 'user_id_DESC_NULLS_FIRST'
  | 'user_id_DESC_NULLS_LAST'
  | 'user_walletAddress_ASC'
  | 'user_walletAddress_DESC'
  | 'user_walletAddress_ASC_NULLS_FIRST'
  | 'user_walletAddress_ASC_NULLS_LAST'
  | 'user_walletAddress_DESC_NULLS_FIRST'
  | 'user_walletAddress_DESC_NULLS_LAST'
  | 'user_chainId_ASC'
  | 'user_chainId_DESC'
  | 'user_chainId_ASC_NULLS_FIRST'
  | 'user_chainId_ASC_NULLS_LAST'
  | 'user_chainId_DESC_NULLS_FIRST'
  | 'user_chainId_DESC_NULLS_LAST'
  | 'templateId_ASC'
  | 'templateId_DESC'
  | 'templateId_ASC_NULLS_FIRST'
  | 'templateId_ASC_NULLS_LAST'
  | 'templateId_DESC_NULLS_FIRST'
  | 'templateId_DESC_NULLS_LAST'
  | 'question_ASC'
  | 'question_DESC'
  | 'question_ASC_NULLS_FIRST'
  | 'question_ASC_NULLS_LAST'
  | 'question_DESC_NULLS_FIRST'
  | 'question_DESC_NULLS_LAST'
  | 'contentHash_ASC'
  | 'contentHash_DESC'
  | 'contentHash_ASC_NULLS_FIRST'
  | 'contentHash_ASC_NULLS_LAST'
  | 'contentHash_DESC_NULLS_FIRST'
  | 'contentHash_DESC_NULLS_LAST'
  | 'arbitrator_ASC'
  | 'arbitrator_DESC'
  | 'arbitrator_ASC_NULLS_FIRST'
  | 'arbitrator_ASC_NULLS_LAST'
  | 'arbitrator_DESC_NULLS_FIRST'
  | 'arbitrator_DESC_NULLS_LAST'
  | 'timeout_ASC'
  | 'timeout_DESC'
  | 'timeout_ASC_NULLS_FIRST'
  | 'timeout_ASC_NULLS_LAST'
  | 'timeout_DESC_NULLS_FIRST'
  | 'timeout_DESC_NULLS_LAST'
  | 'openingTs_ASC'
  | 'openingTs_DESC'
  | 'openingTs_ASC_NULLS_FIRST'
  | 'openingTs_ASC_NULLS_LAST'
  | 'openingTs_DESC_NULLS_FIRST'
  | 'openingTs_DESC_NULLS_LAST'
  | 'minBond_ASC'
  | 'minBond_DESC'
  | 'minBond_ASC_NULLS_FIRST'
  | 'minBond_ASC_NULLS_LAST'
  | 'minBond_DESC_NULLS_FIRST'
  | 'minBond_DESC_NULLS_LAST'
  | 'nonce_ASC'
  | 'nonce_DESC'
  | 'nonce_ASC_NULLS_FIRST'
  | 'nonce_ASC_NULLS_LAST'
  | 'nonce_DESC_NULLS_FIRST'
  | 'nonce_DESC_NULLS_LAST'
  | 'created_ASC'
  | 'created_DESC'
  | 'created_ASC_NULLS_FIRST'
  | 'created_ASC_NULLS_LAST'
  | 'created_DESC_NULLS_FIRST'
  | 'created_DESC_NULLS_LAST'
  | 'txnHash_ASC'
  | 'txnHash_DESC'
  | 'txnHash_ASC_NULLS_FIRST'
  | 'txnHash_ASC_NULLS_LAST'
  | 'txnHash_DESC_NULLS_FIRST'
  | 'txnHash_DESC_NULLS_LAST'
  | 'creationBlockNumber_ASC'
  | 'creationBlockNumber_DESC'
  | 'creationBlockNumber_ASC_NULLS_FIRST'
  | 'creationBlockNumber_ASC_NULLS_LAST'
  | 'creationBlockNumber_DESC_NULLS_FIRST'
  | 'creationBlockNumber_DESC_NULLS_LAST'
  | 'creationTimestamp_ASC'
  | 'creationTimestamp_DESC'
  | 'creationTimestamp_ASC_NULLS_FIRST'
  | 'creationTimestamp_ASC_NULLS_LAST'
  | 'creationTimestamp_DESC_NULLS_FIRST'
  | 'creationTimestamp_DESC_NULLS_LAST'
  | 'chainId_ASC'
  | 'chainId_DESC'
  | 'chainId_ASC_NULLS_FIRST'
  | 'chainId_ASC_NULLS_LAST'
  | 'chainId_DESC_NULLS_FIRST'
  | 'chainId_DESC_NULLS_LAST';

export type conditional_QuestionsConnection = {
  edges: Array<conditional_QuestionEdge>;
  pageInfo: conditional_PageInfo;
  totalCount: Scalars['Int'];
};

export type conditional_QuestionEdge = {
  node: conditional_Question;
  cursor: Scalars['String'];
};

export type conditional_AnswersConnection = {
  edges: Array<conditional_AnswerEdge>;
  pageInfo: conditional_PageInfo;
  totalCount: Scalars['Int'];
};

export type conditional_AnswerEdge = {
  node: conditional_Answer;
  cursor: Scalars['String'];
};

export type conditional_WalletOrderByInput =
  | 'id_ASC'
  | 'id_DESC'
  | 'id_ASC_NULLS_FIRST'
  | 'id_ASC_NULLS_LAST'
  | 'id_DESC_NULLS_FIRST'
  | 'id_DESC_NULLS_LAST'
  | 'walletAddress_ASC'
  | 'walletAddress_DESC'
  | 'walletAddress_ASC_NULLS_FIRST'
  | 'walletAddress_ASC_NULLS_LAST'
  | 'walletAddress_DESC_NULLS_FIRST'
  | 'walletAddress_DESC_NULLS_LAST'
  | 'chainId_ASC'
  | 'chainId_DESC'
  | 'chainId_ASC_NULLS_FIRST'
  | 'chainId_ASC_NULLS_LAST'
  | 'chainId_DESC_NULLS_FIRST'
  | 'chainId_DESC_NULLS_LAST';

export type conditional_WalletsConnection = {
  edges: Array<conditional_WalletEdge>;
  pageInfo: conditional_PageInfo;
  totalCount: Scalars['Int'];
};

export type conditional_WalletEdge = {
  node: conditional_Wallet;
  cursor: Scalars['String'];
};

export type conditional_TokenOrderByInput =
  | 'id_ASC'
  | 'id_DESC'
  | 'id_ASC_NULLS_FIRST'
  | 'id_ASC_NULLS_LAST'
  | 'id_DESC_NULLS_FIRST'
  | 'id_DESC_NULLS_LAST'
  | 'name_ASC'
  | 'name_DESC'
  | 'name_ASC_NULLS_FIRST'
  | 'name_ASC_NULLS_LAST'
  | 'name_DESC_NULLS_FIRST'
  | 'name_DESC_NULLS_LAST'
  | 'symbol_ASC'
  | 'symbol_DESC'
  | 'symbol_ASC_NULLS_FIRST'
  | 'symbol_ASC_NULLS_LAST'
  | 'symbol_DESC_NULLS_FIRST'
  | 'symbol_DESC_NULLS_LAST'
  | 'decimals_ASC'
  | 'decimals_DESC'
  | 'decimals_ASC_NULLS_FIRST'
  | 'decimals_ASC_NULLS_LAST'
  | 'decimals_DESC_NULLS_FIRST'
  | 'decimals_DESC_NULLS_LAST'
  | 'chainId_ASC'
  | 'chainId_DESC'
  | 'chainId_ASC_NULLS_FIRST'
  | 'chainId_ASC_NULLS_LAST'
  | 'chainId_DESC_NULLS_FIRST'
  | 'chainId_DESC_NULLS_LAST'
  | 'tokenAddress_ASC'
  | 'tokenAddress_DESC'
  | 'tokenAddress_ASC_NULLS_FIRST'
  | 'tokenAddress_ASC_NULLS_LAST'
  | 'tokenAddress_DESC_NULLS_FIRST'
  | 'tokenAddress_DESC_NULLS_LAST';

export type conditional_TokensConnection = {
  edges: Array<conditional_TokenEdge>;
  pageInfo: conditional_PageInfo;
  totalCount: Scalars['Int'];
};

export type conditional_TokenEdge = {
  node: conditional_Token;
  cursor: Scalars['String'];
};

export type conditional_SquidStatus = {
  /** The height of the last processed block */
  height?: Maybe<Scalars['Int']>;
  /** The hash of the last processed block */
  hash?: Maybe<Scalars['String']>;
  /** The height of the last processed finalized block */
  finalizedHeight?: Maybe<Scalars['Int']>;
  /** The hash of the last processed finalized block */
  finalizedHash?: Maybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

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

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  conditional_Grant: ResolverTypeWrapper<conditional_Grant>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  conditional_Question: ResolverTypeWrapper<conditional_Question>;
  conditional_Wallet: ResolverTypeWrapper<conditional_Wallet>;
  conditional_GrantWhereInput: conditional_GrantWhereInput;
  conditional_QuestionWhereInput: conditional_QuestionWhereInput;
  conditional_WalletWhereInput: conditional_WalletWhereInput;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  conditional_AnswerWhereInput: conditional_AnswerWhereInput;
  conditional_TokenWhereInput: conditional_TokenWhereInput;
  conditional_GrantOrderByInput: conditional_GrantOrderByInput;
  conditional_Answer: ResolverTypeWrapper<conditional_Answer>;
  conditional_AnswerOrderByInput: conditional_AnswerOrderByInput;
  conditional_Token: ResolverTypeWrapper<conditional_Token>;
  conditional_GrantsConnection: ResolverTypeWrapper<conditional_GrantsConnection>;
  conditional_GrantEdge: ResolverTypeWrapper<conditional_GrantEdge>;
  conditional_PageInfo: ResolverTypeWrapper<conditional_PageInfo>;
  conditional_QuestionOrderByInput: conditional_QuestionOrderByInput;
  conditional_QuestionsConnection: ResolverTypeWrapper<conditional_QuestionsConnection>;
  conditional_QuestionEdge: ResolverTypeWrapper<conditional_QuestionEdge>;
  conditional_AnswersConnection: ResolverTypeWrapper<conditional_AnswersConnection>;
  conditional_AnswerEdge: ResolverTypeWrapper<conditional_AnswerEdge>;
  conditional_WalletOrderByInput: conditional_WalletOrderByInput;
  conditional_WalletsConnection: ResolverTypeWrapper<conditional_WalletsConnection>;
  conditional_WalletEdge: ResolverTypeWrapper<conditional_WalletEdge>;
  conditional_TokenOrderByInput: conditional_TokenOrderByInput;
  conditional_TokensConnection: ResolverTypeWrapper<conditional_TokensConnection>;
  conditional_TokenEdge: ResolverTypeWrapper<conditional_TokenEdge>;
  conditional_SquidStatus: ResolverTypeWrapper<conditional_SquidStatus>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Int: Scalars['Int'];
  String: Scalars['String'];
  conditional_Grant: conditional_Grant;
  Float: Scalars['Float'];
  Boolean: Scalars['Boolean'];
  conditional_Question: conditional_Question;
  conditional_Wallet: conditional_Wallet;
  conditional_GrantWhereInput: conditional_GrantWhereInput;
  conditional_QuestionWhereInput: conditional_QuestionWhereInput;
  conditional_WalletWhereInput: conditional_WalletWhereInput;
  BigInt: Scalars['BigInt'];
  conditional_AnswerWhereInput: conditional_AnswerWhereInput;
  conditional_TokenWhereInput: conditional_TokenWhereInput;
  conditional_Answer: conditional_Answer;
  conditional_Token: conditional_Token;
  conditional_GrantsConnection: conditional_GrantsConnection;
  conditional_GrantEdge: conditional_GrantEdge;
  conditional_PageInfo: conditional_PageInfo;
  conditional_QuestionsConnection: conditional_QuestionsConnection;
  conditional_QuestionEdge: conditional_QuestionEdge;
  conditional_AnswersConnection: conditional_AnswersConnection;
  conditional_AnswerEdge: conditional_AnswerEdge;
  conditional_WalletsConnection: conditional_WalletsConnection;
  conditional_WalletEdge: conditional_WalletEdge;
  conditional_TokensConnection: conditional_TokensConnection;
  conditional_TokenEdge: conditional_TokenEdge;
  conditional_SquidStatus: conditional_SquidStatus;
}>;

export type QueryResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  conditional_grants?: Resolver<Array<ResolversTypes['conditional_Grant']>, ParentType, ContextType, Partial<Queryconditional_grantsArgs>>;
  conditional_grantById?: Resolver<Maybe<ResolversTypes['conditional_Grant']>, ParentType, ContextType, RequireFields<Queryconditional_grantByIdArgs, 'id'>>;
  conditional_grantsConnection?: Resolver<ResolversTypes['conditional_GrantsConnection'], ParentType, ContextType, RequireFields<Queryconditional_grantsConnectionArgs, 'orderBy'>>;
  conditional_questions?: Resolver<Array<ResolversTypes['conditional_Question']>, ParentType, ContextType, Partial<Queryconditional_questionsArgs>>;
  conditional_questionById?: Resolver<Maybe<ResolversTypes['conditional_Question']>, ParentType, ContextType, RequireFields<Queryconditional_questionByIdArgs, 'id'>>;
  conditional_questionsConnection?: Resolver<ResolversTypes['conditional_QuestionsConnection'], ParentType, ContextType, RequireFields<Queryconditional_questionsConnectionArgs, 'orderBy'>>;
  conditional_answers?: Resolver<Array<ResolversTypes['conditional_Answer']>, ParentType, ContextType, Partial<Queryconditional_answersArgs>>;
  conditional_answerById?: Resolver<Maybe<ResolversTypes['conditional_Answer']>, ParentType, ContextType, RequireFields<Queryconditional_answerByIdArgs, 'id'>>;
  conditional_answersConnection?: Resolver<ResolversTypes['conditional_AnswersConnection'], ParentType, ContextType, RequireFields<Queryconditional_answersConnectionArgs, 'orderBy'>>;
  conditional_wallets?: Resolver<Array<ResolversTypes['conditional_Wallet']>, ParentType, ContextType, Partial<Queryconditional_walletsArgs>>;
  conditional_walletById?: Resolver<Maybe<ResolversTypes['conditional_Wallet']>, ParentType, ContextType, RequireFields<Queryconditional_walletByIdArgs, 'id'>>;
  conditional_walletsConnection?: Resolver<ResolversTypes['conditional_WalletsConnection'], ParentType, ContextType, RequireFields<Queryconditional_walletsConnectionArgs, 'orderBy'>>;
  conditional_tokens?: Resolver<Array<ResolversTypes['conditional_Token']>, ParentType, ContextType, Partial<Queryconditional_tokensArgs>>;
  conditional_tokenById?: Resolver<Maybe<ResolversTypes['conditional_Token']>, ParentType, ContextType, RequireFields<Queryconditional_tokenByIdArgs, 'id'>>;
  conditional_tokensConnection?: Resolver<ResolversTypes['conditional_TokensConnection'], ParentType, ContextType, RequireFields<Queryconditional_tokensConnectionArgs, 'orderBy'>>;
  conditional_squidStatus?: Resolver<Maybe<ResolversTypes['conditional_SquidStatus']>, ParentType, ContextType>;
}>;

export type conditional_GrantResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_Grant'] = ResolversParentTypes['conditional_Grant']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  grantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  questionEntityId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  questionEntity?: Resolver<ResolversTypes['conditional_Question'], ParentType, ContextType>;
  creatorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['conditional_Wallet'], ParentType, ContextType>;
  recipientId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['conditional_Wallet'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  amountD?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  questionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  conditionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  txnHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resolved?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  collateralTokenId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  collateralToken?: Resolver<ResolversTypes['conditional_Token'], ParentType, ContextType>;
  deadline?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  creationBlockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  creationTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_QuestionResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_Question'] = ResolversParentTypes['conditional_Question']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  questionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['conditional_Wallet'], ParentType, ContextType>;
  templateId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contentHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  arbitrator?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timeout?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  openingTs?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  minBond?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  txnHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creationBlockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  creationTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  answers?: Resolver<Array<ResolversTypes['conditional_Answer']>, ParentType, ContextType, Partial<conditional_QuestionanswersArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_WalletResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_Wallet'] = ResolversParentTypes['conditional_Wallet']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  walletAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  grantsRecipient?: Resolver<Array<ResolversTypes['conditional_Grant']>, ParentType, ContextType, Partial<conditional_WalletgrantsRecipientArgs>>;
  grantsCreator?: Resolver<Array<ResolversTypes['conditional_Grant']>, ParentType, ContextType, Partial<conditional_WalletgrantsCreatorArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type conditional_AnswerResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_Answer'] = ResolversParentTypes['conditional_Answer']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  answer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  questionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  question?: Resolver<ResolversTypes['conditional_Question'], ParentType, ContextType>;
  historyHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['conditional_Wallet'], ParentType, ContextType>;
  bond?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  ts?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  isCommitment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  txnHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creationBlockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  creationTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_TokenResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_Token'] = ResolversParentTypes['conditional_Token']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tokenAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_GrantsConnectionResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_GrantsConnection'] = ResolversParentTypes['conditional_GrantsConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['conditional_GrantEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['conditional_PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_GrantEdgeResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_GrantEdge'] = ResolversParentTypes['conditional_GrantEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['conditional_Grant'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_PageInfoResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_PageInfo'] = ResolversParentTypes['conditional_PageInfo']> = ResolversObject<{
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_QuestionsConnectionResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_QuestionsConnection'] = ResolversParentTypes['conditional_QuestionsConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['conditional_QuestionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['conditional_PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_QuestionEdgeResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_QuestionEdge'] = ResolversParentTypes['conditional_QuestionEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['conditional_Question'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_AnswersConnectionResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_AnswersConnection'] = ResolversParentTypes['conditional_AnswersConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['conditional_AnswerEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['conditional_PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_AnswerEdgeResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_AnswerEdge'] = ResolversParentTypes['conditional_AnswerEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['conditional_Answer'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_WalletsConnectionResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_WalletsConnection'] = ResolversParentTypes['conditional_WalletsConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['conditional_WalletEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['conditional_PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_WalletEdgeResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_WalletEdge'] = ResolversParentTypes['conditional_WalletEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['conditional_Wallet'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_TokensConnectionResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_TokensConnection'] = ResolversParentTypes['conditional_TokensConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['conditional_TokenEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['conditional_PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_TokenEdgeResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_TokenEdge'] = ResolversParentTypes['conditional_TokenEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['conditional_Token'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type conditional_SquidStatusResolvers<ContextType = MeshContext & { chainName: string }, ParentType extends ResolversParentTypes['conditional_SquidStatus'] = ResolversParentTypes['conditional_SquidStatus']> = ResolversObject<{
  height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  finalizedHeight?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  finalizedHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext & { chainName: string }> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  conditional_Grant?: conditional_GrantResolvers<ContextType>;
  conditional_Question?: conditional_QuestionResolvers<ContextType>;
  conditional_Wallet?: conditional_WalletResolvers<ContextType>;
  BigInt?: GraphQLScalarType;
  conditional_Answer?: conditional_AnswerResolvers<ContextType>;
  conditional_Token?: conditional_TokenResolvers<ContextType>;
  conditional_GrantsConnection?: conditional_GrantsConnectionResolvers<ContextType>;
  conditional_GrantEdge?: conditional_GrantEdgeResolvers<ContextType>;
  conditional_PageInfo?: conditional_PageInfoResolvers<ContextType>;
  conditional_QuestionsConnection?: conditional_QuestionsConnectionResolvers<ContextType>;
  conditional_QuestionEdge?: conditional_QuestionEdgeResolvers<ContextType>;
  conditional_AnswersConnection?: conditional_AnswersConnectionResolvers<ContextType>;
  conditional_AnswerEdge?: conditional_AnswerEdgeResolvers<ContextType>;
  conditional_WalletsConnection?: conditional_WalletsConnectionResolvers<ContextType>;
  conditional_WalletEdge?: conditional_WalletEdgeResolvers<ContextType>;
  conditional_TokensConnection?: conditional_TokensConnectionResolvers<ContextType>;
  conditional_TokenEdge?: conditional_TokenEdgeResolvers<ContextType>;
  conditional_SquidStatus?: conditional_SquidStatusResolvers<ContextType>;
}>;


export type MeshContext = ConditionalTypes.Context & BaseMeshContext;


import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/conditional/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const conditionalTransforms = [];
const additionalTypeDefs = [] as any[];
const conditionalHandler = new GraphqlHandler({
              name: "conditional",
              config: {"endpoint":"{context.chainName:https://beelink0.tailbe2e0a.ts.net/simplegrant/graphql}"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("conditional"),
              logger: logger.child("conditional"),
              importFn,
            });
conditionalTransforms[0] = new PrefixTransform({
                  apiName: "conditional",
                  config: {"mode":"wrap","value":"conditional_","includeRootOperations":true},
                  baseDir,
                  cache,
                  pubsub,
                  importFn,
                  logger,
                });
sources[0] = {
          name: 'conditional',
          handler: conditionalHandler,
          transforms: conditionalTransforms
        }
const additionalResolvers = await Promise.all([
        import("../resolvers.ts")
            .then(m => m.resolvers || m.default || m)
      ]);
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      {
        document: GetAllGrantsDocument,
        get rawSDL() {
          return printWithCache(GetAllGrantsDocument);
        },
        location: 'GetAllGrantsDocument.graphql'
      },{
        document: GetAnswersDocument,
        get rawSDL() {
          return printWithCache(GetAnswersDocument);
        },
        location: 'GetAnswersDocument.graphql'
      },{
        document: GetGrantByIdDocument,
        get rawSDL() {
          return printWithCache(GetGrantByIdDocument);
        },
        location: 'GetGrantByIdDocument.graphql'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type getAllGrantsQueryVariables = Exact<{
  chainId: Scalars['Int'];
}>;


export type getAllGrantsQuery = { conditional_grants: Array<(
    Pick<conditional_Grant, 'amount' | 'chainId' | 'conditionId' | 'creationBlockNumber' | 'creationTimestamp' | 'grantId' | 'id' | 'txnHash' | 'resolved' | 'success'>
    & { collateralToken: Pick<conditional_Token, 'name' | 'symbol' | 'tokenAddress' | 'id' | 'chainId' | 'decimals'>, questionEntity: (
      Pick<conditional_Question, 'question' | 'minBond' | 'contentHash' | 'openingTs' | 'nonce' | 'timeout'>
      & { answers: Array<Pick<conditional_Answer, 'bond'>> }
    ), recipient: Pick<conditional_Wallet, 'walletAddress'>, creator: Pick<conditional_Wallet, 'walletAddress'> }
  )> };

export type getAnswersQueryVariables = Exact<{
  questionId: Scalars['String'];
}>;


export type getAnswersQuery = { conditional_answers: Array<Pick<conditional_Answer, 'creationTimestamp' | 'bond'>> };

export type getGrantByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type getGrantByIdQuery = { conditional_grants: Array<(
    Pick<conditional_Grant, 'amount' | 'chainId' | 'conditionId' | 'creationBlockNumber' | 'creationTimestamp' | 'creatorId' | 'grantId' | 'id' | 'txnHash' | 'success' | 'resolved' | 'recipientId' | 'questionId'>
    & { collateralToken: Pick<conditional_Token, 'name' | 'symbol' | 'tokenAddress' | 'id' | 'chainId' | 'decimals'>, questionEntity: (
      Pick<conditional_Question, 'question' | 'minBond' | 'contentHash' | 'openingTs' | 'nonce' | 'timeout'>
      & { answers: Array<Pick<conditional_Answer, 'bond'>> }
    ), recipient: Pick<conditional_Wallet, 'walletAddress'>, creator: Pick<conditional_Wallet, 'walletAddress'> }
  )> };


export const getAllGrantsDocument = gql`
    query getAllGrants($chainId: Int!) {
  conditional_grants(where: {chainId_eq: $chainId}) {
    amount
    chainId
    conditionId
    creationBlockNumber
    creationTimestamp
    grantId
    id
    txnHash
    resolved
    success
    collateralToken {
      name
      symbol
      tokenAddress
      id
      chainId
      decimals
    }
    questionEntity {
      question
      minBond
      contentHash
      openingTs
      nonce
      timeout
      answers {
        bond
      }
    }
    recipient {
      walletAddress
    }
    creator {
      walletAddress
    }
  }
}
    ` as unknown as DocumentNode<getAllGrantsQuery, getAllGrantsQueryVariables>;
export const getAnswersDocument = gql`
    query getAnswers($questionId: String!) {
  conditional_answers(where: {questionId_eq: $questionId}) {
    creationTimestamp
    bond
  }
}
    ` as unknown as DocumentNode<getAnswersQuery, getAnswersQueryVariables>;
export const getGrantByIdDocument = gql`
    query getGrantById($id: String!) {
  conditional_grants(where: {grantId_eq: $id}) {
    amount
    chainId
    conditionId
    creationBlockNumber
    creationTimestamp
    creatorId
    grantId
    id
    txnHash
    success
    resolved
    recipientId
    questionId
    collateralToken {
      name
      symbol
      tokenAddress
      id
      chainId
      decimals
    }
    questionEntity {
      question
      minBond
      contentHash
      openingTs
      nonce
      timeout
      answers {
        bond
      }
    }
    recipient {
      walletAddress
    }
    creator {
      walletAddress
    }
  }
}
    ` as unknown as DocumentNode<getGrantByIdQuery, getGrantByIdQueryVariables>;




export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getAllGrants(variables: getAllGrantsQueryVariables, options?: C): Promise<getAllGrantsQuery> {
      return requester<getAllGrantsQuery, getAllGrantsQueryVariables>(getAllGrantsDocument, variables, options) as Promise<getAllGrantsQuery>;
    },
    getAnswers(variables: getAnswersQueryVariables, options?: C): Promise<getAnswersQuery> {
      return requester<getAnswersQuery, getAnswersQueryVariables>(getAnswersDocument, variables, options) as Promise<getAnswersQuery>;
    },
    getGrantById(variables: getGrantByIdQueryVariables, options?: C): Promise<getGrantByIdQuery> {
      return requester<getGrantByIdQuery, getGrantByIdQueryVariables>(getGrantByIdDocument, variables, options) as Promise<getGrantByIdQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;