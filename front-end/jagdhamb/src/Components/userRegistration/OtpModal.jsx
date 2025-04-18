import React from 'react';
import './OtpModal.css';
import isResendDisabled from './UserRegistration'

class OtpModal extends React.Component {
  render() {
    const { otp, onChange, onSubmit, onCancel, onRetry } = this.props;

    return (
      <div className="otp-modal-overlay">
        <div className="otp-modal">
          <div className="otp-box">
            <h3>Enter OTP</h3>
            <input
              type="number"
              value={otp}
              onChange={onChange}
            />
            <div className="modal-actions-row">
              <button onClick={onSubmit}>Submit</button>
              <button onClick={onCancel}>Cancel</button>
              <button onClick={onRetry} disabled={isResendDisabled}>Resend OTP</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OtpModal;
