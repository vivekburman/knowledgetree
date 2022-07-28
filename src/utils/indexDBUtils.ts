
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
    dbTransaction!: IDBDatabase;
    static objectStoreName: string;
    static objectStorePath: string;

    static getInstance(objectStoreName?: string, objectStorePath?: string) {
        if (!this.instance) {
            this.instance = new IndexDBUtils();
            this.objectStoreName = objectStoreName || KTEnum.INDEXED_DB.OBJECT_STORE.PROJECT.NAME;
            this.objectStorePath = objectStorePath || KTEnum.INDEXED_DB.OBJECT_STORE.PROJECT.KEY_PATH;
        }
        return this.instance;
    }
    
    openDB(dbName: string, dbVersion: number, successCallback?: Function, failureCallback?: Function) {
        this.dbRequest = indexedDB.open(dbName, dbVersion);
        this.dbRequest.onerror = () => this.onDBError(failureCallback || ktUtil.getEmptyFunction());
        this.dbRequest.onsuccess = () => this.onDBSuccess(successCallback || ktUtil.getEmptyFunction());
        this.dbRequest.onupgradeneeded = this.onUpgradeNeeded;
        this.dbRequest.onblocked = this.onBlocked;
    }

    onDBSuccess = (successCallback: Function) => {
        if (this.dbRequest.readyState === KTEnum.INDEXED_DB.STATE.DONE) {
            this.dbTransaction = this.dbRequest.result;
            successCallback();
        }
    }

    onDBError(failureCallback: Function) {
        failureCallback(this.dbRequest);
    }

    onBlocked() {
        console.error("IndexDBUtils Blocked:");
    }

    onVersionChange() {
        console.log("IndexDBUtils Version Changed:");
    }

    onTxComplete(event: Event, callBack: Function) {
        callBack(event);
    }

    onTxError(event: Event, callBack: Function) {
        callBack(event);
    }

    getEntry(keyPath: IDBValidKey | IDBKeyRange, successCallback: Function, failureCallback?: Function) {
        if(ktUtil.isNullOrUndefined(keyPath)) {
            throw Error("Key Path is null or undefined");
        } else {
            const store = this.createTransaction({
                successCallback, 
                failureCallback,
                objectStoreName: IndexDBUtils.objectStoreName
            });
            store.get(keyPath);
        }
    }

    getEntries(successCallback: Function, failureCallback?: Function) {
        const store = this.createTransaction({
            successCallback, 
            failureCallback,
            objectStoreName: IndexDBUtils.objectStoreName
        });
        store.getAll();
    }

    getEntriesKeys(successCallback: Function, failureCallback?: Function) {
        const store = this.createTransaction({
            successCallback, 
            failureCallback,
            objectStoreName: IndexDBUtils.objectStoreName
        });
        store.getAllKeys();
    }

    getEntryKey(keyPath: IDBValidKey | IDBKeyRange, successCallback: Function, failureCallback?: Function) {
        if(ktUtil.isNullOrUndefined(keyPath)) {
            throw Error("Key Path is null or undefined");
        } else {
            const store = this.createTransaction({
                successCallback, 
                failureCallback,
                objectStoreName: IndexDBUtils.objectStoreName
            });
            store.getKey(keyPath);
        }
    }


    addTransaction(data: any, successCallback: Function, failureCallback?: Function) {
        if (!this.dbTransaction) {
            throw Error("DB Transaction is null");
        } else if(ktUtil.isNullOrUndefined(data)) {
            throw Error("Data object is null or undefined");
        } else {
            const store = this.createTransaction({
                successCallback, 
                failureCallback,
                objectStoreName: IndexDBUtils.objectStoreName
            });
            store.add(data);
        }
    }
    deleteTransaction(keyPath: string | number, successCallback: Function, failureCallback?: Function) {
        if (!this.dbTransaction) {
            throw Error("DB Transaction is null");
        } else if(ktUtil.isNullOrUndefined(keyPath)) {
            throw Error("Key path is null or undefined");
        } else {
            const store = this.createTransaction({
                successCallback, 
                failureCallback,
                objectStoreName: IndexDBUtils.objectStoreName
            });
            store.delete(keyPath);
        }
    }
    updateTransaction = (data: any, successCallback: Function, failureCallback?: Function) => {
        if (!this.dbTransaction) {
            throw Error("DB Transaction is null");
        } else if(ktUtil.isNullOrUndefined(data)) {
            throw Error("Data object is null or undefined");
        } else {
            const store = this.createTransaction({
                successCallback, 
                failureCallback,
                objectStoreName: IndexDBUtils.objectStoreName
            });
            store.put(data);
        }
    }

    createTransaction(props: {successCallback?: Function, failureCallback?: Function, objectStoreName: string}) {
        const { successCallback, failureCallback, objectStoreName } = props;
        const tx = this.dbTransaction.transaction(objectStoreName, "readwrite");
        tx.oncomplete = (event) => this.onTxComplete(event, successCallback || ktUtil.getEmptyFunction());
        tx.onerror = (event) => this.onTxError(event, failureCallback || ktUtil.getEmptyFunction());
        const store = tx.objectStore(objectStoreName);
        return store;
    }

    onUpgradeNeeded = () => {
        if (this.dbRequest.readyState === KTEnum.INDEXED_DB.STATE.DONE) {
            const db = this.dbRequest.result;
            if (!db.objectStoreNames.contains(IndexDBUtils.objectStoreName)) {
                db.createObjectStore(IndexDBUtils.objectStoreName, {
                    "keyPath": IndexDBUtils.objectStorePath
                });
            }
        }
    }
}