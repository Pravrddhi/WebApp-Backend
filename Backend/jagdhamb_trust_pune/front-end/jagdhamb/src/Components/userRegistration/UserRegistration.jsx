import React, { Component } from 'react';
import './UserRegistration.css';

class UserRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      middleName: '',
      lastName: '',
      mobileNo: '',
      age: '',
      gender: '',
      instrument: [],
      address: '',
      errors: {},
      isMobileVerified: false,
      showOtpModal: false,
      otp: '',
      reqId: '',
    };
  }

  componentDidMount() {
    // IMPORTANT: If you're using verifyOtp callbacks, you can skip the config ones to avoid duplicate logs
    window.configuration = {
      widgetId: '35646b737343323738353130',
      tokenAuth: '446603TCnuMImrwXIQ67f96874P1',
      exposeMethods: true,
      success: (data) => {
        // This callback will still trigger unless handled in verifyOtp manually
        console.log('Global config success (can skip if using verifyOtp callback):', data);
      },
      failure: (error) => {
        console.log('Global config failure (can skip if using verifyOtp callback):', error);
      },
    };

    if (window.initSendOTP) {
      window.initSendOTP(window.configuration);
    } else {
      const script = document.createElement('script');
      script.src = 'https://verify.msg91.com/otp-provider.js';
      script.type = 'text/javascript';
      script.onload = () => {
        window.initSendOTP(window.configuration);
      };
      document.body.appendChild(script);
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleMultiSelectChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    this.setState({ instrument: options });
  };

  sendOtp = (identifier) => {
    if (!identifier) {
      alert('Please enter a valid identifier.');
      return;
    }

    window.sendOtp(
      identifier,
      (data) => {
        console.log('OTP sent successfully:', data);
        this.setState({ showOtpModal: true, reqId: data.reqId });
      },
      (error) => {
        console.log('OTP send error:', error);
        alert('Failed to send OTP.');
      }
    );
  };

  handleVerifyClick = () => {
    const { mobileNo } = this.state;
    if (!mobileNo || mobileNo.length < 10) {
      alert('Enter a valid mobile number.');
      return;
    }

    if (typeof window.sendOtp !== 'function') {
      alert('OTP methods not loaded yet.');
      return;
    }

    // Optionally check captcha status (returns true/false)
    const captchaVerified = window.isCaptchaVerified?.();
    console.log('Captcha is verified or not:', captchaVerified);

    // Optional: Get widget data
    const widgetData = window.getWidgetData?.();
    console.log('Widget Data:', widgetData);

    this.sendOtp(`91${mobileNo}`);
  };

  handleOtpSubmit = () => {
    const { otp, reqId } = this.state;

    if (!otp) {
      alert('Enter OTP first.');
      return;
    }

    if (typeof window.verifyOtp !== 'function') {
      alert('OTP verification method not loaded.');
      return;
    }

    window.verifyOtp(
      otp,
      (data) => {
        console.log('OTP verified:', data);
        this.setState({ isMobileVerified: true, showOtpModal: false });
        alert('Mobile number verified!');
      },
      (error) => {
        console.log('Verification error:', error);
        alert('Incorrect OTP.');
      },
      reqId
    );
  };

  handleRetryOtp = () => {
    const { reqId } = this.state;

    if (typeof window.retryOtp !== 'function') {
      alert('Retry OTP method not loaded.');
      return;
    }

    window.retryOtp(
      '11',
      (data) => {
        console.log('Resent OTP:', data);
        alert('OTP resent successfully.');
      },
      (error) => {
        console.log('Retry error:', error);
        alert('Failed to resend OTP.');
      },
      reqId
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validateForm()) {
      console.log('Form submitted:', this.state);
      alert('Registration successful!');
    }
  };

  validateForm = () => {
    const errors = {};
    const { firstName, lastName, mobileNo, age, gender, instrument, address } = this.state;

    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!mobileNo.trim()) errors.mobileNo = 'Mobile number is required';
    if (!age.trim()) errors.age = 'Age is required';
    if (!gender.trim()) errors.gender = 'Gender is required';
    if (instrument.length === 0) errors.instrument = 'At least one instrument must be selected';
    if (!address.trim()) errors.address = 'Address is required';

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  render() {
    const { errors, isMobileVerified, showOtpModal, otp } = this.state;

    return (
      <div className="form-container">
        <form className="registration-form" onSubmit={this.handleSubmit}>
          <h2>Registration Form</h2>

          <div className="row">
            <div className="form-group">
              <label>First Name*</label>
              <input type="text" name="firstName" onChange={this.handleChange} />
              <div className="error">{errors.firstName}</div>
            </div>
            <div className="form-group">
              <label>Middle Name</label>
              <input type="text" name="middleName" onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name*</label>
              <input type="text" name="lastName" onChange={this.handleChange} />
              <div className="error">{errors.lastName}</div>
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label>Age*</label>
              <input type="number" name="age" onChange={this.handleChange} />
              <div className="error">{errors.age}</div>
            </div>
            <div className="form-group">
              <label>Gender*</label>
              <select name="gender" onChange={this.handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <div className="error">{errors.gender}</div>
            </div>
          </div>

          <div className="row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>Mobile No*</label>
              <input type="text" name="mobileNo" onChange={this.handleChange} />
              <div className="error">{errors.mobileNo}</div>
            </div>
            <div className="form-group" style={{ alignSelf: 'end' }}>
              <button
                type="button"
                className="verify-btn"
                onClick={this.handleVerifyClick}
                disabled={isMobileVerified}
              >
                {isMobileVerified ? 'Verified' : 'Verify'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Instruments*</label>
            <select name="instrument" multiple onChange={this.handleMultiSelectChange}>
              <option value="Dhol">Dhol</option>
              <option value="Tasha">Tasha</option>
              <option value="Dhwaj">Dhwaj</option>
            </select>
            <div className="error">{errors.instrument}</div>
          </div>

          <div className="form-group">
            <label>Address*</label>
            <textarea name="address" onChange={this.handleChange}></textarea>
            <div className="error">{errors.address}</div>
          </div>

          <button type="submit">Register</button>
        </form>

        {showOtpModal && (
          <div className="otp-modal">
            <div className="otp-box">
              <h3>Enter OTP</h3>
              <input
                type="text"
                value={otp}
                onChange={(e) => this.setState({ otp: e.target.value })}
              />
              <div className="modal-actions-row">
                <button onClick={this.handleOtpSubmit}>Submit</button>
                <button onClick={() => this.setState({ showOtpModal: false })}>Cancel</button>
                <button onClick={this.handleRetryOtp}>Resend OTP</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserRegistration;
