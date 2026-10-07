import Realm from 'realm';

const STORAGE_SCHEMA = {
  name: 'Storage',
  primaryKey: 'name',
  properties: {
    name: 'string',
    content: 'string',
  },
};

async function withCallback(callback: any, func: any) {
  try {
    const result = await func();
    if (callback) {
      callback(null, result);
    }
    return result;
  } catch (err) {
    if (callback) {
      callback(err);
    } else {
      throw err;
    }
  }
}

function createRealmAccess(path = Realm.defaultPath) {
  let __realm: Realm | null = null;
  return async function accessRealm() {
    if (!__realm) {
      try {
        __realm = await Realm.open({
          schema: [STORAGE_SCHEMA],
          path,
        });
      } catch (error) {
        throw error;
      }
    }
    return __realm;
  };
}

interface PersistStorage {
  getItem: (
    key: string,
    callback?: (err: Error | null, result?: string) => void,
  ) => Promise<string>;
  setItem: (
    key: string,
    value: string,
    callback?: (err: Error | null) => void,
  ) => Promise<void>;
  removeItem: (
    key: string,
    callback?: (err: Error | null) => void,
  ) => Promise<void>;
}

export function createRealmPersistStorage({
  path,
}: {path?: string} = {}): PersistStorage {
  const accessRealm = createRealmAccess(path);

  async function accessItemInstances() {
    const realm = await accessRealm();
    return realm.objects(STORAGE_SCHEMA.name);
  }

  async function getItem(key: any, callback: any) {
    return withCallback(callback, async function () {
      const items = await accessItemInstances();
      const matches = items.filtered(`name = "${key}"`);
      if (matches.length > 0 && matches[0]) {
        return matches[0].content;
      } else {
        throw new Error(`Could not get item with key: '${key}'`);
      }
    });
  }

  async function setItem(key: string, value: any, callback: any) {
    return withCallback(callback, async function () {
      const realm = await accessRealm();
      realm.write(() => {
        realm.create(
          STORAGE_SCHEMA.name,
          {
            name: key,
            content: value,
          },
          true,
        );
      });
    });
  }

  async function removeItem(key: string, callback: any) {
    return withCallback(callback, async function () {
      const realm = await accessRealm();
      const items = await accessItemInstances();
      realm.write(() => {
        const item = items.filtered(`name = "${key}"`);
        realm.delete(item);
      });
    });
  }

  return {
    getItem,
    setItem,
    removeItem,
  };
}
