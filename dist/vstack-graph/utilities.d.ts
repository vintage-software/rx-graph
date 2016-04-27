export interface CollectionItem {
    id: any;
}
export declare function clone(obj: any): any;
export declare function mergeCollection<TItem extends CollectionItem>(target: TItem[], src: TItem[]): void;
export declare function slimify(item: any): any;
export declare function isPrimitive(item: any): boolean;
