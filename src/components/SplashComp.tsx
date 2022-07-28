import React from "react";
import '../scss/component/splash.scss';

export default class SplashComp extends React.Component {
    render(): React.ReactNode {
        return (
            <div className="kta-landing-page kta-full-width kta-full-height kta-display-flex kt-align-center">
                <div className="kta-splash-loader"></div>
            </div>
        );
    }
}