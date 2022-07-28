import React from "react";
import AppComp from "../components/AppComp";

export default class AppPage extends React.Component {
    render(): React.ReactNode {
        return (
            <div className="kta-full-width kta-full-height">
                <AppComp />
            </div>
        );
    }
}