import { AES, enc } from 'crypto-js'
import { AppSettings } from '../common/app-settings';
export abstract class CacheService {
   protected getItem<T>(key: string): T | string | null {
      const data = localStorage.getItem(key);
      if (data != null) {
         const decrypted = AES.decrypt(data, AppSettings.DEC);
         const decryptedText = decrypted.toString(enc.Utf8);
         //if (typeof decryptedText === 'string') return decryptedText;
         const toReturn = JSON.parse(decryptedText);
         if(toReturn.string !== undefined) {
            return toReturn.string;
         }
         return toReturn;
      }
      return null;
   }

   protected setItem(key: string, data: object | string) {
      let encrypted = '';
      if (typeof data === 'string') {
         data = { string: data }
         // encrypted = AES.encrypt(data, AppSettings.DEC).toString();
      }
      //else {
      encrypted = AES.encrypt(JSON.stringify(data), AppSettings.DEC).toString();
      //}
      localStorage.setItem(key, encrypted);
   }

   protected removeItem(key: string) {
      localStorage.removeItem(key);
   }

   protected clear() {
      localStorage.clear();
   }
}
