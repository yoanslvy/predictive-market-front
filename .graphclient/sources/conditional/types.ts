// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace ConditionalTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  questionId: Scalars['String'];
  conditionId: Scalars['String'];
  txnHash: Scalars['String'];
  resolved: Scalars['Boolean'];
  success?: Maybe<Scalars['Boolean']>;
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

  export type QuerySdk = {
      /** null **/
  conditional_grants: InContextSdkMethod<Query['conditional_grants'], Queryconditional_grantsArgs, MeshContext>,
  /** null **/
  conditional_grantById: InContextSdkMethod<Query['conditional_grantById'], Queryconditional_grantByIdArgs, MeshContext>,
  /** null **/
  conditional_grantsConnection: InContextSdkMethod<Query['conditional_grantsConnection'], Queryconditional_grantsConnectionArgs, MeshContext>,
  /** null **/
  conditional_questions: InContextSdkMethod<Query['conditional_questions'], Queryconditional_questionsArgs, MeshContext>,
  /** null **/
  conditional_questionById: InContextSdkMethod<Query['conditional_questionById'], Queryconditional_questionByIdArgs, MeshContext>,
  /** null **/
  conditional_questionsConnection: InContextSdkMethod<Query['conditional_questionsConnection'], Queryconditional_questionsConnectionArgs, MeshContext>,
  /** null **/
  conditional_answers: InContextSdkMethod<Query['conditional_answers'], Queryconditional_answersArgs, MeshContext>,
  /** null **/
  conditional_answerById: InContextSdkMethod<Query['conditional_answerById'], Queryconditional_answerByIdArgs, MeshContext>,
  /** null **/
  conditional_answersConnection: InContextSdkMethod<Query['conditional_answersConnection'], Queryconditional_answersConnectionArgs, MeshContext>,
  /** null **/
  conditional_wallets: InContextSdkMethod<Query['conditional_wallets'], Queryconditional_walletsArgs, MeshContext>,
  /** null **/
  conditional_walletById: InContextSdkMethod<Query['conditional_walletById'], Queryconditional_walletByIdArgs, MeshContext>,
  /** null **/
  conditional_walletsConnection: InContextSdkMethod<Query['conditional_walletsConnection'], Queryconditional_walletsConnectionArgs, MeshContext>,
  /** null **/
  conditional_squidStatus: InContextSdkMethod<Query['conditional_squidStatus'], {}, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["conditional"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      ["chainName"]: Scalars['ID']
    };
}
