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
    window.configuration = {
      widgetId: '35646b737343323738353130',
      tokenAuth: '446603TCnuMImrwXIQ67f96874P1',
      exposeMethods: true,
      success: (data) => {
        console.log('OTP verified successfully', data);
      },
      failure: (error) => {
        console.log('OTP verification failed', error);
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
    const options = Array.from(e.target.selectedOptions, option => option.value);
    this.setState({ instrument: options });
  };

  handleVerifyClick = () => {
    const { mobileNo } = this.state;
    if (!mobileNo || mobileNo.trim().length < 10) {
      alert('Please enter a valid mobile number.');
      return;
    }

    if (typeof window.sendOtp !== 'function') {
      alert('OTP methods not loaded yet. Please try again.');
      return;
    }

    window.sendOtp(
      `91${mobileNo}`,
      (data) => {
        console.log('OTP sent successfully.', data);
        this.setState({ showOtpModal: true, reqId: data.reqId });
      },
      (error) => {
        console.error('Error sending OTP', error);
        alert('Failed to send OTP');
      }
    );
  };

  handleOtpSubmit = () => {
    if (typeof window.verifyOtp !== 'function') {
      alert('OTP methods not loaded yet. Please try again.');
      return;
    }

    window.verifyOtp(
      this.state.otp,
      (data) => {
        console.log('OTP verified: ', data);
        this.setState({ isMobileVerified: true, showOtpModal: false });
      },
      (error) => {
        console.error('OTP verification failed', error);
        alert('Incorrect OTP');
      },
      this.state.reqId
    );
  };

  handleRetryOtp = () => {
    if (typeof window.retryOtp !== 'function') {
      alert('OTP methods not loaded yet. Please try again.');
      return;
    }

    window.retryOtp(
      '11',
      (data) => {
        console.log('Resend data: ', data);
      },
      (error) => {
        console.error('Resend error: ', error);
      },
      this.state.reqId
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
    if (instrument.length === 0) errors.instrument = 'At least one instrument is required';
    if (!address.trim()) errors.address = 'Address is required';

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  render() {
    const { errors, isMobileVerified, showOtpModal } = this.state;

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
              <button type="button" className="verify-btn" onClick={this.handleVerifyClick}>
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
                value={this.state.otp}
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
