import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';

const PostalCodeInput = () => {
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');

  // 处理邮政编码变化
  const handlePostalCodeChange = (e) => {
    const code = e.target.value;
    setPostalCode(code);

    // 检查邮政编码是否完整（7 位数字）
    if (code.length === 8 && /^\d{3}-\d{4}$/.test(code)) {
      // 调用邮政编码 API
      fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code.replace('-', '')}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.results) {
            const result = data.results[0];
            // 拼接地址
            const fullAddress = `${result.address1} ${result.address2} ${result.address3}`;
            setAddress(fullAddress);
          } else {
            setAddress('住所が見つかりません');
          }
        })
        .catch(() => {
          setAddress('エラーが発生しました');
        });
    } else {
      setAddress(''); // 重置地址
    }
  };

  return (
    <div className="slds-form slds-form_stacked">
      <div className="slds-form-element">
        <label className="slds-form-element__label" htmlFor="postal-code">
          郵便番号
        </label>
        <div className="slds-form-element__control">
          <InputMask
            mask="999-9999"
            value={postalCode}
            onChange={handlePostalCodeChange}
            className="slds-input"
            placeholder="例: 123-4567"
          >
            {(inputProps) => <input {...inputProps} type="text" id="postal-code" />}
          </InputMask>
        </div>
      </div>
      <div className="slds-form-element">
        <label className="slds-form-element__label" htmlFor="address">
          住所
        </label>
        <div className="slds-form-element__control">
          <p className="slds-text-body_regular slds-truncate" id="address">
            {address || '住所が自動的に表示されます'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostalCodeInput;
