export abstract class CacheService {
   protected getItem<T>(key: string): T | string | null {
      let data = null;
      let sessionData = sessionStorage.getItem(key);
      let localData = localStorage.getItem(key);
      if (localData != null) {
         data = localData;
      } else if (sessionData != null) {
         data = sessionData;
      }
      if (data != null) {
         if (typeof data === 'string') {
            return data;
         }
         return JSON.parse(data);
      }
      return null;
   }

   protected setItem(key: string, data: object | string, rememberme: boolean = false) {
      if (typeof data !== 'string') {
         data = JSON.stringify(data);
      }
      if(rememberme) {
         localStorage.setItem(key, data);
      } else {
         sessionStorage.setItem(key, data);
      }
   }

   protected removeItem(key: string) {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
   }

   protected clear() {
      localStorage.clear();
      sessionStorage.clear();
   }
}
