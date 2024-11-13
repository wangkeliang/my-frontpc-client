import React from 'react';
import InputMask from 'react-input-mask';

const PhoneInput = ({ value, onChange }) => {
  return (
    <div className="phone-input">
      <label htmlFor="phone">電話番号</label>
      {/* 使用掩码来处理不同长度的区号 */}
      <InputMask
        mask="99[9][9]-9999-9999"
        value={value}
        onChange={onChange}
        className="slds-input"
        placeholder="例: 03-1234-5678 or 099-123-4567"
      >
        {(inputProps) => <input {...inputProps} type="text" />}
      </InputMask>
    </div>
  );
};

export default PhoneInput;
