[![npm version](https://badge.fury.io/js/vstack-graph.svg)](https://badge.fury.io/js/vstack-graph)
[![Build Status](https://travis-ci.org/vintage-software/vstack-graph.svg?branch=master)](https://travis-ci.org/vintage-software/vstack-graph)
[![codecov.io](https://codecov.io/github/vintage-software/vstack-graph/coverage.svg?branch=master)](https://codecov.io/github/vintage-software/vstack-graph?branch=master)

# VStack Graph

## Work in progress

A Observable (RxJS) based Graph layer for JavaScript Applications. Supports Object relation structures via REST APIs. Includes Angular 2 support out of the box and has a generic adapter for many different
client libraries. 

### RestCollection

`RestCollection` is a base class to extend rest services from. This base class will add CRUD functionality
as well as features such as state history tracking, error logging and Flux like collection streams.

`RestCollection` has a peer dependency on RxJS 5.

### GraphService

Work in progress. Will allow defined relationships between Restfull collections created with 
the `RestCollection` allowing data deduping and graph like structures in client apps.


### Getting Started

This project is in alpha and a work in progress. To get started run `npm install` in the root directory.

- `npm run build` create distributables and bundles
- `npm run test` build and run tests
- `npm run coverage` build and run test coverage

Temp Demo: http://plnkr.co/edit/RcQO38Bztxnhnch1I12W?p=preview
