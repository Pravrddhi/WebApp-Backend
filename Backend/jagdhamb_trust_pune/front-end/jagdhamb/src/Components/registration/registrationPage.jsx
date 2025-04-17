import React from 'react';
import './registrationpage.css';

class RegistrationWithOTP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            middleName: '',
            lastName: '',
            mobile: '',
            age: '',
            gender: '',
            instrument: [],
            address: '',
            otpVerified: false,
            otpScriptLoaded: false,
        };
    }

    componentDidMount() {
        const script = document.createElement('script');
        script.src = 'https://verify.msg91.com/otp-provider.js';
        script.async = true;
        script.onload = () => {
            this.setState({ otpScriptLoaded: true });
        };
        document.body.appendChild(script);
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleInstrumentChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        this.setState({ instrument: selected });
    };

    handleVerifyClick = () => {
        const { mobile, otpScriptLoaded } = this.state;

        if (!mobile || mobile.length !== 10) {
            alert("Please enter a valid 10-digit mobile number first.");
            return;
        }

        if (otpScriptLoaded && window.initSendOTP) {
            const configuration = {
                widgetId: "35646b737343323738353130",
                tokenAuth: "446603TCnuMImrwXIQ67f96874P1",
                identifier: mobile,
                exposeMethods: true,
                success: (data) => {
                    console.log("OTP verified:", data);
                    if (data.type === "success") {
                        this.setState({ otpVerified: true });
                    }
                },
                failure: (error) => {
                    console.error("OTP verification failed:", error);
                },
            };
            window.initSendOTP(configuration);
        } else {
            alert("OTP widget is still loading. Please wait a moment and try again.");
        }
    };

    isFormValid = () => {
        const { firstName, lastName, mobile, age, gender, instrument, address, otpVerified } = this.state;
        return (
            firstName &&
            lastName &&
            mobile.length === 10 &&
            age &&
            gender &&
            instrument.length > 0 &&
            address &&
            otpVerified
        );
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.isFormValid()) {
            console.log("Form submitted:", this.state);
            alert("Registration successful!");
        } else {
            alert("Please fill all required fields and verify your mobile number.");
        }
    };

    render() {
        return (
            <div className="registration-container">
                <h2>Registration Form</h2>
                <form onSubmit={this.handleSubmit}>
                    <input name="firstName" value={this.state.firstName} onChange={this.handleChange} placeholder="First Name*" required />
                    <input name="middleName" value={this.state.middleName} onChange={this.handleChange} placeholder="Middle Name" />
                    <input name="lastName" value={this.state.lastName} onChange={this.handleChange} placeholder="Last Name*" required />
                    <input type="tel" name="mobile" value={this.state.mobile} onChange={this.handleChange} placeholder="Mobile No*" maxLength={10} required />
                    <button type="button" onClick={this.handleVerifyClick}>Verify Mobile No</button>
                    <input name="age" value={this.state.age} onChange={this.handleChange} placeholder="Age*" type="number" required />
                    <select name="gender" value={this.state.gender} onChange={this.handleChange} required>
                        <option value="">Select Gender*</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <select name="instrument" multiple value={this.state.instrument} onChange={this.handleInstrumentChange} required>
                        <option value="Dhol">Dhol</option>
                        <option value="Tasha">Tasha</option>
                        <option value="Dhwaj">Dhwaj</option>
                    </select>
                    <textarea name="address" value={this.state.address} onChange={this.handleChange} placeholder="Address*" required />
                    <button type="submit" disabled={!this.isFormValid()}>Submit</button>
                </form>
            </div>
        );
    }
}

export default RegistrationWithOTP;