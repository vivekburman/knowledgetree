
/**
 * singleton class IndexDBUtils
 * 1. Open DB connection
 * 2. success, error, onupgradeneeded
 * 3. onupgrade needed is called for the first time as well as version change - initialization
 * 4. onversionchange - close all lower versions of DB and ask user to update
 * NOTE:
 *  ObjectStore can be created/removed/altered only during onupgradeneeded - technical limitation
 *  Outside you can add/update/delete data
 * 
 * 5. Transactions has readonly, readwrite mode
 *  read only concurrent call, readwrite is lock
 */

import ktUtil from "./kt.util";
import KTEnum from "./KTEnum";

export default class IndexDBUtils {
    static instance: IndexDBUtils;
    dbRequest!: IDBOpenDBRequest;
    dbTransaction: IDBDatabase | undefined;

    static getInstance() {
        if (!this.instance) {
            this.instance = new IndexDBUtils();
        }
        return this.instance;
    }
    
    openDB(dbName: string, dbVersion: number) {
        this.dbRequest = indexedDB.open(dbName, dbVersion);
        this.dbRequest.onerror = this.onDBError;
        this.dbRequest.onsuccess = this.onDBSuccess;
        this.dbRequest.onupgradeneeded = this.onUpgradeNeeded;
        this.dbRequest.onblocked = this.onBlocked;
    }

    onDBSuccess = () => {
        this.dbTransaction = this.dbRequest.result;
    }

    onDBError() {
        console.error("IndexDBUtils Error: " + this.dbRequest.error);
    }

    onBlocked() {

    }

    onVersionChange() {

    }

    onTxComplete(event: Event, callBack: Function) {
        callBack(event);
    }

    onTxError(event: Event, callBack: Function) {
        callBack(event);
    }


    addTransaction(data: any, successCallback?: Function, failureCallback?: Function) {
        if (!this.dbTransaction) {
            throw Error("DB Transaction is null");
        } else if(ktUtil.isNullOrUndefined(data)) {
            throw Error("Data object is null or undefined");
        } else {
            const tx = this.dbTransaction.transaction(KTEnum.INDEXED_DB.OBJECT_STORE.PROJECT.NAME, "readwrite");
            tx.oncomplete = (event) => this.onTxComplete(event, successCallback || ktUtil.getEmptyFunction());
            tx.onerror = (event) => this.onTxError(event, failureCallback || ktUtil.getEmptyFunction());
            const store = tx.objectStore(KTEnum.INDEXED_DB.OBJECT_STORE.PROJECT.NAME);
            store.add(data);
        }
    }

    onUpgradeNeeded() {
        const db = this.dbRequest.result;
        if (!db.objectStoreNames.contains(KTEnum.INDEXED_DB.OBJECT_STORE.PROJECT.NAME)) {
            db.createObjectStore(KTEnum.INDEXED_DB.OBJECT_STORE.PROJECT.NAME, {
                "keyPath": KTEnum.INDEXED_DB.OBJECT_STORE.PROJECT.KEY_PATH
            });
        }
    }
}