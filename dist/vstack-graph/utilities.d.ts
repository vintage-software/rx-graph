export interface CollectionItem {
    id: string | number;
}
export declare function clone(obj: any): any;
export declare function mergeCollection<TItem extends CollectionItem>(target: TItem[], src: TItem[]): void;
export declare function mergeCollectionItem<TItem extends CollectionItem>(target: TItem, src: TItem): void;
export declare function slimify<TItem>(item: TItem): TItem;
export declare function isPrimitive(item: any): boolean;
