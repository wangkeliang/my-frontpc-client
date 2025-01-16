const createIndexedDBStorage = (dbName, storeName = 'reduxPersistStore') => {
    const openDB = () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1); // 确保版本号正确
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName); // 创建对象存储
            console.log(`Object store "${storeName}" created.`);
          }
        };
  
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
  
        request.onerror = (event) => {
          reject(event.target.error);
        };
  
        request.onblocked = () => {
          console.error('Database upgrade blocked. Close other tabs using the same database.');
        };
      });
    };
  
    const withStore = async (callback) => {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
  
        const request = callback(store);
  
        transaction.oncomplete = () => {
          resolve(request.result);
        };
  
        transaction.onerror = (event) => {
          reject(event.target.error);
        };
      });
    };
  
    return {
      getItem: async (key) => {
        return withStore((store) => store.get(key));
      },
      setItem: async (key, value) => {
        return withStore((store) => store.put(value, key));
      },
      removeItem: async (key) => {
        return withStore((store) => store.delete(key));
      },
      clear: async () => {
        return withStore((store) => store.clear());
      },
    };
  };
  
  export default createIndexedDBStorage;
  