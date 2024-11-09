import React from "react";
import { Modal, Input, Button } from "antd";

const OTPPopup = ({ visible, onClose, otpValue, setOtpValue, onVerify }) => {
  return (
    <Modal
      title="OTP Verification"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="flex flex-col items-center">
        <Input
          placeholder="Enter OTP"
          value={otpValue}
          onChange={(e) => setOtpValue(e.target.value)}
          className="mb-4 text-center"
        />
        <Button type="primary" onClick={onVerify}>
          Verify OTP
        </Button>
      </div>
    </Modal>
  );
};

export default OTPPopup;
