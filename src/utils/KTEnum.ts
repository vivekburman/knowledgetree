const KTEnum = {
    INDEXED_DB: {
        DB_NAME: "knowledge_tree_db",
        DB_VERSION: 1,
        STATE: {
            PENDING: "pending",
            DONE: "done"
        },
        OBJECT_STORE: {
            PROJECT: {
                NAME: "projectStore",
                KEY_PATH: "projectId"
            },
        }
    }
};
export default KTEnum;