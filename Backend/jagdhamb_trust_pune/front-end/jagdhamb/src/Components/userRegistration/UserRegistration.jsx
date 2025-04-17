import React, { Component } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './UserRegistration.css';
import RegistrationImage from '../Assets/g.jfif';
import OtpModal from './OtpModal';

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
      popupMessage: '',
      showPopup: false,
      showSuccessPopup: false,
    };
  }

  componentDidMount() {
    window.configuration = {
      widgetId: '35646b737343323738353130',
      tokenAuth: '446603TCnuMImrwXIQ67f96874P1',
      exposeMethods: true,
      success: (data) => console.log('Global config success:', data),
      failure: (error) => console.log('Global config failure:', error),
    };

    if (window.initSendOTP) {
      window.initSendOTP(window.configuration);
    } else {
      const script = document.createElement('script');
      script.src = 'https://verify.msg91.com/otp-provider.js';
      script.type = 'text/javascript';
      script.onload = () => window.initSendOTP(window.configuration);
      document.body.appendChild(script);
    }
  }

  showPopup = (message) => {
    this.setState({ popupMessage: message, showPopup: true });
  };

  closePopup = () => {
    this.setState({ popupMessage: '', showPopup: false });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleMultiSelectChange = (e) => {
    this.setState({ instrument: e.value });
  };

  checkIfUserExists = async (mobileNo) => {
    try {
      const response = await fetch('http://backend_jagdhamb_trust_pune_local/api/users/existing_user/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: mobileNo }),
      }); 
      const data = await response.json();
      console.log("--------------------", data)
      return data.existing_user;
    } catch (error) {
      console.error('Error checking user:', error);
      this.showPopup('Error checking mobile number.');
      return;
    }
  };

  sendOtp = (identifier) => {
    window.sendOtp(
      identifier,
      (data) => {
        console.log('OTP sent successfully:', data);
        this.setState({ showOtpModal: true, reqId: data.reqId });
      },
      (error) => {
        console.log('OTP send error:', error);
        this.showPopup('Failed to send OTP.');
      }
    );
  };

  handleVerifyClick = async () => {
    const { mobileNo } = this.state;
    if (!mobileNo || mobileNo.length < 10) {
      this.showPopup('Enter a valid mobile number.');
      return;
    }

    if (typeof window.sendOtp !== 'function') {
      this.showPopup('OTP methods not loaded yet.');
      return;
    }

    const exists = await this.checkIfUserExists(mobileNo);
    if (exists) {
      this.showPopup('Mobile number is already registered.');
      return;
    }

    const identifier = `91${mobileNo}`;
    this.sendOtp(identifier);
  };

  handleOtpSubmit = () => {
    const { otp, reqId } = this.state;

    if (!otp) {
      this.showPopup('Enter OTP first.');
      return;
    }

    if (typeof window.verifyOtp !== 'function') {
      this.showPopup('OTP verification method not loaded.');
      return;
    }

    window.verifyOtp(
      otp,
      (data) => {
        console.log('OTP verified:', data, this.state.otp);
        this.setState({ isMobileVerified: true, showOtpModal: false });
        this.showPopup('Mobile number verified!');
      },
      (error) => {
        console.log('Verification error:', error);
        this.showPopup('Incorrect OTP.');
      },
      reqId
    );
  };

  handleRetryOtp = () => {
    const { reqId } = this.state;

    if (typeof window.retryOtp !== 'function') {
      this.showPopup('Retry OTP method not loaded.');
      return;
    }

    window.retryOtp(
      '11',
      (data) => {
        console.log('Resent OTP:', data);
        this.showPopup('OTP resent successfully.');
      },
      (error) => {
        console.log('Retry error:', error);
        this.showPopup('Failed to resend OTP.');
      },
      reqId
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.state.isMobileVerified) {
      this.showPopup('Please verify your mobile number first.');
      return
    }
    let successLink = '';

    if (this.state.gender === 'Female') {
      successLink = 'https://example.com/female-success'; // replace with actual link
    } else if (this.state.gender === 'Male') {
      successLink = 'https://example.com/male-success'; // replace with actual link
    }


    if (this.validateForm()) {
      console.log('Form submitted:', this.state);
      this.setState({ showSuccessPopup: true , successLink});
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
    const {
      errors, isMobileVerified, showOtpModal, otp, instrument,
      showPopup, popupMessage, showSuccessPopup
    } = this.state;

    return (
      <div className="form-container">
        <form className="registration-form" onSubmit={this.handleSubmit}>
          <img src={RegistrationImage} alt="Registration Banner" className="registration-image" />
          <h2>Registration Form</h2>

          <div className="row">
            <div className="form-group">
              <input type="text" name="firstName" placeholder="First Name" onChange={this.handleChange} />
              <div className="error">{errors.firstName}</div>
            </div>
            <div className="form-group">
              <input type="text" name="middleName" placeholder="Middle Name" onChange={this.handleChange} />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <input type="text" name="lastName" placeholder="Last Name" onChange={this.handleChange} />
              <div className="error">{errors.lastName}</div>
            </div>
            <div className="form-group">
              <input type="number" name="age" placeholder="Age" onChange={this.handleChange} />
              <div className="error">{errors.age}</div>
            </div>
          </div>

          <div className="row">
            <div className="form-group" style={{ flex: 2 }}>
              <select name="gender" onChange={this.handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <div className="error">{errors.gender}</div>
            </div>
            <div className="form-group" style={{ flex: 2 }}>
              <MultiSelect
                value={instrument}
                options={['Dhol', 'Tasha', 'Dhwaj']}
                onChange={this.handleMultiSelectChange}
                placeholder="Select Instrument"
              />
              <div className="error">{errors.instrument}</div>
            </div>
          </div>

          <div className="row">
            <div className="form-group" style={{ flex: 2 }}>
              <input type="text" name="mobileNo" placeholder="Mobile No" onChange={this.handleChange} />
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
            <textarea name="address" onChange={this.handleChange} placeholder="Address"></textarea>
            <div className="error">{errors.address}</div>
          </div>

          <button type="submit">Register</button>

          <div>
            <span style={{color: '#800000'}}>
            If registration fail Contact:9767704126
            </span>
          </div>
        </form>

        {showOtpModal && (
          <OtpModal
            otp={otp}
            onChange={(e) => this.setState({ otp: e.target.value })}
            onSubmit={this.handleOtpSubmit}
            onCancel={() => this.setState({ showOtpModal: false })}
            onRetry={this.handleRetryOtp}
          />
        )}

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <p>{popupMessage}</p>
              <button onClick={this.closePopup}>OK</button>
            </div>
          </div>
        )}

        {showSuccessPopup && (
          <div className="popup-overlay">
            <div className="popup-box large">
              <h3>Registration Successful!</h3>
              {this.state.gender === 'Female' && (
                <p style={{ fontWeight: 'bold', marginTop: '10px', color: '#e91e63', fontSize: '15px' }}>
                  Note: Female vadaks have a separate group. Jagdhamb prioritizes your privacy.
                </p>
              )}

              <button
                className='' 
                href={this.state.successLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '15px', color: '#007bff' }}
              >
                Join WhatsApp Group
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }
}

export default UserRegistration;
