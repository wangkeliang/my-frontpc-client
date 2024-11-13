import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import styles from './CompanyInfoStep.module.css';

const CompanyInfoStep = () => {
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
            setAddress(''); // 如果找不到地址，不显示错误信息，允许用户自行输入
          }
        })
        .catch(() => {
          setAddress(''); // 如果发生错误，不显示错误信息，允许用户自行输入
        });
    } else {
      setAddress(''); // 重置地址
    }
  };

  return (
    <div className={styles.companyInfoStep}>
      <div className={styles.companyErrorMessage}>
        エラーメッセージがあればここに表示。各項目のチェックはフォーム項目の上に表示する。
      </div>

      {/* 行 1 */}
      <div className={styles.companyFormRow}>
        <div className={styles.companyFormGroup}>
          <label htmlFor="companyName" className={styles.companyLabel}>
            <span className={styles.companyRequiredStar}>*</span> 会社名:
          </label>
          <input
            type="text"
            id="companyName"
            className={styles.companyFormInput}
            placeholder="会社名を入力してください"
          />
        </div>
      </div>

      {/* 行 2 */}
      <div className={styles.companyFormRow}>
        <div className={styles.companyFormGroup}>
          <label htmlFor="postalCode" className={styles.companyLabel}>
            <span className={styles.companyRequiredStar}>*</span> 住所:
          </label>
          <div className={styles.companyPostalInputContainer}>
            <span className={styles.companyPostalSymbol}>〒</span>
            <InputMask
              mask="999-9999"
              value={postalCode}
              onChange={handlePostalCodeChange}
              className={styles.companyPostalInput}
              placeholder="郵便番号"
            >
              {(inputProps) => <input {...inputProps} type="text" id="postalCode" />}
            </InputMask>
            <input
              type="text"
              id="companyAddress"
              className={styles.companyAddressInput}
              value={address}
              onChange={(e) => setAddress(e.target.value)} // 允许用户自行输入地址
              placeholder="住所を入力してください"
            />
          </div>
        </div>
      </div>

      {/* 行 3 */}
      <div className={styles.companyFormRow}>
        <div className={styles.companyFormGroup}>
          <label htmlFor="homepage" className={styles.companyLabel}>ホームページ:</label>
          <input
            type="text"
            id="homepage"
            className={styles.companyFormInput}
            placeholder="ホームページを入力してください"
          />
        </div>
        <div className={styles.companyFormGroup}>
          <label htmlFor="phoneNumber" className={styles.companyLabel}>
            <span className={styles.companyRequiredStar}>*</span> 電話番号:
          </label>
          <input
            type="text"
            id="phoneNumber"
            className={styles.companyFormInput}
            placeholder="電話番号を入力してください"
          />
        </div>
      </div>

      {/* 行 5 */}
      <div className={styles.companyFormRow}>
        <div className={styles.companyFormGroup}>
          <label htmlFor="salesEmail" className={styles.companyLabel}>
            <span className={styles.companyRequiredStar}>*</span> 営業共通メール:
          </label>
          <input
            type="email"
            id="salesEmail"
            className={styles.companyFormInput}
            placeholder="営業メールを入力してください"
          />
        </div>
        <div className={styles.companyFormGroup}>
          <label htmlFor="recruitmentEmail" className={styles.companyLabel}>
            <span className={styles.companyRequiredStar}>*</span> 採用共通メール:
          </label>
          <input
            type="email"
            id="recruitmentEmail"
            className={styles.companyFormInput}
            placeholder="採用メールを入力してください"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoStep;
