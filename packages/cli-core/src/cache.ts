export class Cache<K, V> extends Map<K, V> {
  getOrSet(key: K, callback: (key: K) => V) {
    if (!this.has(key)) {
      this.set(key, callback(key));
    }

    return this.get(key);
  }
}
