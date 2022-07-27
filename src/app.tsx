import React from "react";
import AppPage from "./pages/AppPage";
import LandingPage from "./pages/LandingPage";

/**
 * Task: 
 * 1. Load the main app
 * 2. Show splash screen until information from indexDB is fetched
 * 3. Load the App Page
 */

export class App extends React.Component {
    render(): React.ReactNode {
        return (
            <div className="kta-full-width kta-full-height">
                <LandingPage />
                <AppPage />
            </div>
        )
    }
}