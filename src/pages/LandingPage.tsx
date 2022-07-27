import React from "react";
import SplashComp from "../components/SplashComp";

export default class LandingPage extends React.Component {
    render(): React.ReactNode {
        return (
            <div className="kta-landing-page kta-full-width kta-full-height">
                <SplashComp />
            </div>
        );
    }
}