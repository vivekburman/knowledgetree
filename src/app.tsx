import React from "react";
import AppPage from "./pages/AppPage";
import LandingPage from "./pages/LandingPage";
import IndexDBUtils from './utils/indexDBUtils';
import KTEnum from "./utils/KTEnum";

/**
 * Task: 
 * 1. Load the main app
 * 2. Show splash screen until information from indexDB is fetched
 * 3. Load the App Page
 */

export class App extends React.Component {
    indexedDB: IndexDBUtils;
    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.state = {
            projects: null
        };
        this.indexedDB = IndexDBUtils.getInstance();
    }
    componentDidMount() {
        this.indexedDB.openDB(KTEnum.INDEXED_DB.DB_NAME, KTEnum.INDEXED_DB.DB_VERSION, this.onDBOpen);
    }
    onDBOpen = () => {
        this.indexedDB.getEntries(this.onEntriesSuccess);
    }
    onEntriesSuccess = () => {
        console.log("heelop");
    }
    onEntriesFailure = () => {
        // TODO: show an error UI
    }
    render(): React.ReactNode {
        return (
            <div className="kta-full-width kta-full-height">
                <LandingPage />
                <AppPage />
            </div>
        )
    }
}