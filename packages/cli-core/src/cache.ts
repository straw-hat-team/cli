export type LazyGetter<K, V> = (key: K) => V;

export class Cache<K, V> extends Map<K, V> {
  getOrSet(key: K, callback: LazyGetter<K, V>) {
    if (!this.has(key)) {
      this.set(key, callback(key));
    }

    return this.get(key);
  }
}
