# VStack Graph

## Work in progress

A Reactive Http REST library for Angular 2 with relational data structure support.

### RestCollection

`RestCollection` is a base class to extend rest services from. This base class will add CRUD functionality
as well as features such as state history tracking, error logging and Flux like collection streams.

`RestCollection` has a peer dependency on Angular 2 HttpService and RxJS 5.

### GraphService

Work in progress. Will allow defined relationships between Restfull collections created with 
the `RestCollection` allowing data deduping and graph like structures in client apps.

Temp Demo: http://plnkr.co/edit/HoITeJwPxWGimPkrWAL9?p=preview
