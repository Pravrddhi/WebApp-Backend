import React from 'react';
import './logIn.css';

class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
        };
        this.otpDivId = 'otp-widget'; // Unique ID for Msg91 widget div
    }

    componentDidMount() {
        // Dynamically load the Msg91 OTP widget script
        const script = document.createElement('script');
        script.src = 'https://verify.msg91.com/otp-provider.js';
        script.async = true;
        script.onload = () => {
            const configuration = {
                widgetId: '35646b737343323738353130',
                tokenAuth: '446603TCnuMImrwXIQ67f96874P1',
                identifier: this.state.mobile,
                exposeMethods: false, // Let widget handle UI itself
                success: (data) => {
                    console.log('Success:', data);
                    // Save token, proceed to next step
                },
                failure: (error) => {
                    console.log('Failure:', error);
                },
                var_otp: '' // optional
            };
            window.initSendOTP && window.initSendOTP(configuration);
        };
        document.body.appendChild(script);
    }

    handleMobileChange = (e) => {
        this.setState({ mobile: e.target.value });
    };

    render() {
        return (
            <div className="login-container">
                <div className="login-header">
                    <div className="test">Sign In</div>
                    <div className="underline"></div>
                </div>
                <h1>Login</h1>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="tel"
                        name="mobile"
                        value={this.state.mobile}
                        onChange={this.handleMobileChange}
                        placeholder="Enter mobile number"
                        maxLength={10}
                        required
                    />

                    {/* Msg91 OTP Widget will render here */}
                    <div id={this.otpDivId}></div>

                    <input type="password" placeholder="Password" required />

                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

export default LogIn;
