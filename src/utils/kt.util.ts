const ktUtil = {
    isNullOrUndefined: (data: any) => {
        return data === null || data === undefined;
    },
    getEmptyFunction: () => {
        return () => {};
    }
}

export default ktUtil;