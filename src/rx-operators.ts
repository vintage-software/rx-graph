/* tslint:disable */
// Disabling for hot patching RxJS until ES7 function bind is hopefully available
// Observable.prototype['collectionFind'] = function (properties) {
//     return this.map(items => items.find(item => {
//         for (var prop in properties) {
//             if (properties[prop] !== item[prop]) {
//                 return false;
//             }
//         }
//         return true;
//     }));
// };

// Observable.prototype['collectionWhere'] = function (properties) {
//     return this.map(items => items.filter(item => {
//         for (var prop in properties) {
//             if (properties[prop] !== item[prop]) {
//                 return false;
//             }
//         }
//         return true;
//     }));
// };
/* tslint:enable */