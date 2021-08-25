# clean-node-ts

[![Build Status](https://app.travis-ci.com/alioshr/clean-node-ts.svg?branch=master)](https://app.travis-ci.com/alioshr/clean-node-ts)
[![Coverage Status](https://coveralls.io/repos/github/alioshr/clean-node-ts/badge.svg?branch=master)](https://coveralls.io/github/alioshr/clean-node-ts?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/alioshr/clean-node-ts/badge.svg)](https://snyk.io/test/github/alioshr/clean-node-ts)

This is a case study of the implementation of an API with Typescript and Nodejs

## Index

* [Diagrams built](#diagrams-built-per-use-case)
* [APIs built](#apis-built-per-use-case)
* [Principles](#principles)
* [Design Patterns](#design-patterns)
* [Methodologies & Designs](#methodologies-and-designs)
* [Libs & Tools](#libs-and-tools)
* [Node Features](#node-features)
* [GraphQL Features](#graphql-features)
* [Typescript Features](#typescript-features)
* [Tests Features](#tests-features)
* [MongoDb Features](#mongodb-features)

> ## Implementation Status

- 🚧  Ongoing
- ✅  Done
- ⛔  Not started

> ## Diagrams built per use case

1. 🚧 [Sign Up](./requirements/signup/diagram.md)
2. ⛔ [Login](./requirements/login/diagram.md)
3. ⛔ [Build a survey](./requirements/add-survey/diagram.md)
4. ⛔ [List surveys](./requirements/load-surveys/diagram.md)
5. ⛔ [Answer survey](./requirements/save-survey-result/diagram.md)
6. ⛔ [Results of the survey](./requirements/load-survey-result/diagram.md)

## [**Link to the API documentation**]()

> ## APIs built per use case

1. 🚧 [Sign Up](./requirements/signup/signup.md)
2. 🚧 [Login](./requirements/login/login.md)
3. ⛔ [Build a survey](./requirements/add-survey/add-survey.md)
4. ⛔ [List surveys](./requirements/load-surveys/load-surveys.md)
5. ⛔ [Answer survey](./requirements/save-survey-result/save-survey-result.md)
6. ⛔ [Results of the survey](./requirements/load-survey-result/load-survey-result.md)

> ## Principles

* Single Responsibility Principle (SRP)
* Open Closed Principle (OCP)
* Liskov Substitution Principle (LSP)
* Interface Segregation Principle (ISP)
* Dependency Inversion Principle (DIP)
* Separation of Concerns (SOC)
* Don't Repeat Yourself (DRY)
* You Aren't Gonna Need It (YAGNI)
* Keep It Simple, Silly (KISS)
* Composition Over Inheritance
* Small Commits

> ## Design Patterns

* Factory
* Adapter
* Composite
* Decorator
* Proxy
* Dependency Injection
* Abstract Server
* Composition Root
* Builder
* Singleton

> ## Methodologies and Designs

* TDD
* Clean Architecture
* DDD
* Conventional Commits
* GitFlow
* Modular Design
* Dependency Diagrams
* Use Cases
* Continuous Integration
* Continuous Delivery
* Continuous Deployment

> ## Libs and Tools

* NPM
* Typescript
* Git
* Docker
* Jest
* MongoDb
* Travis CI
* Swagger
* Bcrypt
* JsonWebToken
* Faker
* Coveralls
* Validator
* Express
* Apollo Server Express
* Graphql
* Graphql ISO Date
* Supertest
* Husky
* Lint Staged
* Eslint
* Standard Javascript Style
* Nodemon
* Rimraf
* In-Memory MongoDb Server
* MockDate
* Module-Alias
* Copyfiles
* Npm Check
* Bson ObjectId
* Apollo Server Integration Testing

> ## Node Features

* Documentation with Swagger
* API Rest with Express
* GraphQL with Apollo Server
* Error logger
* Security (Hashing, Encryption e Encoding)
* CORS
* Middlewares
* Access level on routes (Admin, User e Anonymous)
* Deploy at Heroku
* Serve static files

> ## GraphQL Features

* Types
* Queries
* Mutations
* Resolvers
* Directives
* Scalars
* Plugins

> ## Typescript Features

* Advanced Object Oriented programming
* Interface
* TypeAlias
* Namespace
* Utility Types
* Paths module
* Configurations
* Build
* Deploy
* Use of breakpoints

> ## Tests Features

* Unit tests
* Integration tests (API Rest & GraphQL)
* Test coverage
* Test Doubles
* Mocks
* Stubs
* Spies
* Fakes

> ## MongoDb Features

* Connect e Reconnect
* Collections
* InsertOne e InserMany
* Find, FindOne e FindOneAndUpdate
* DeleteMany
* UpdateOne
* Aggregation (Match, Group, Unwind, Lookup, AddFields, Project, Sort)
* ObjectId
* Upsert e ReturnOriginal
* Push, Divide, Multiply, ArrayElemAt, Cond, Sum
* Filter, Map, Reduce, MergeObjects, ConcatArrays
