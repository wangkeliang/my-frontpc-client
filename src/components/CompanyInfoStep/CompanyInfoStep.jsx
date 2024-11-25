import React, { useState, useImperativeHandle, forwardRef } from 'react';
import InputMask from 'react-input-mask';
import styles from './CompanyInfoStep.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addCompany, updateCompany,fetchCompanyByDomain } from '../../redux/company/companySlice';
import { transferUserRolesFromApplications } from '../../redux/user/userSlice';
const CompanyInfoStep = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const companyInfo = useSelector((state) => state.company?.companyInfo || null);
  const domain = useSelector((state) => state.auth?.domain || '');
  const userId = useSelector((state) => state.auth?.userId || '');
  const [errors, setErrors] = useState({}); // 错误状态
  const [errorMessage, setErrorMessage] = useState(''); // 错误信息

  const [fields, setFields] = useState({
    id:'',
    companyName: '',
    postalCode: '',
    address: '',
    websiteUrl: '',
    phone: '',
    salesEmail: '',
    hrEmail: '',
  });

  // 初始化字段，如果存在公司信息
  React.useEffect(() => {
    if (companyInfo) {
      setFields({
        id: companyInfo.id || '',
        companyName: companyInfo.companyName || '',
        postalCode: companyInfo.postalCode || '',
        address: companyInfo.address || '',
        websiteUrl: companyInfo.websiteUrl || '',
        phone: companyInfo.phone || '',
        salesEmail: companyInfo.salesEmail || '',
        hrEmail: companyInfo.hrEmail || '',
      });
    }
  }, [companyInfo]);

  const handleFieldChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const validateFields = () => {
    const errors = {};
    let errorMessage = '';

    if (!fields.hrEmail.trim() || fields.hrEmail.length > 40 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.hrEmail)) {
      errors.hrEmail = true;
      errorMessage = '有効な採用共通メールを入力してください。';
    }

    if (!fields.salesEmail.trim() || fields.salesEmail.length > 40 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.salesEmail)) {
      errors.salesEmail = true;
      errorMessage = '有効な営業共通メールを入力してください。';
    }

    if (!fields.phone) {
      errors.phone = true;
      errorMessage = '電話番号を入力してください。';
    } else if (!/^\d{2,3}-\d{4}-\d{4}$/.test(fields.phone)) {
      errors.phone = true;
      errorMessage = '電話番号の形式が正しくありません (例: 090-0000-0000)。';
    }

    if (fields.websiteUrl && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.+)?$/.test(fields.websiteUrl)) {
      errors.websiteUrl = true;
      errorMessage = '有効なURLを入力してください。';
    }

    if (!fields.address.trim() || fields.address.length > 40) {
      errors.address = true;
      errorMessage = '住所を入力してください。';
    }


    if (!fields.companyName.trim() || fields.companyName.length > 40) {
      errors.companyName = true;
      errorMessage = '会社名を入力してください。';
    }

    setErrors(errors);
    setErrorMessage(errorMessage);
    return Object.keys(errors).length === 0;
  };

  const handlePostalCodeChange = (e) => {
    const code = e.target.value;
    handleFieldChange('postalCode', code);

    if (code.length === 8 && /^\d{3}-\d{4}$/.test(code)) {
      fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code.replace('-', '')}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.results) {
            const result = data.results[0];
            const fullAddress = `${result.address1} ${result.address2} ${result.address3}`;
            handleFieldChange('address', fullAddress);
          } else {
            handleFieldChange('address', '');
          }
        })
        .catch(() => {
          handleFieldChange('address', '');
        });
    } else {
      handleFieldChange('address', '');
    }
  };

  const saveChanges = async () => {
    setErrorMessage('');
    if (!validateFields()) return false; 

    try {
      // 从数据库重新获取最新的公司信息
      const updatedCompanyInfo = await dispatch(fetchCompanyByDomain(domain)).unwrap();
  
      const hasChanges = Object.keys(fields).some(
        (key) => fields[key] !== (updatedCompanyInfo ? updatedCompanyInfo[key] || '' : '')
      );
  
      if (hasChanges) {
        if (updatedCompanyInfo) {
          // 更新公司信息
          await dispatch(updateCompany(fields)).unwrap();
        } else {
          // 添加公司信息
          await dispatch(addCompany(fields)).unwrap();
        }   
        return true;     
      }       
    } catch (error) {
      // 捕获错误并显示
      setErrorMessage(`保存中にエラーが発生しました: ${error}`);
      console.error('Error saving changes:', error);
      return false;
    }
  
    return true;
  };

  useImperativeHandle(ref, () => ({
    saveChanges,
  }));

  return (
    <div className={styles.companyInfoStep}>
      <div className={styles.companyErrorMessage}>
        {errorMessage && <span>{errorMessage}</span>}
      </div>
      
  
      <div className={styles.companyFormRow}>
        <div className={styles.companyFormGroup}>
          <label htmlFor="companyName" className={styles.companyLabel}>
            <span className={styles.companyRequiredStar}>*</span> 会社名:
          </label>
          <input
            type="text"
            id="companyName"            
            value={fields.companyName}
            className={`${styles.companyFormInput} ${errors.companyName ? styles.errorInput : ''}`}
            onChange={(e) => handleFieldChange('companyName', e.target.value)}
            placeholder="会社名を入力してください"
            maxLength={40}
          />
        </div>
      </div>
  
      <div className={styles.companyFormRow}>
        <div className={styles.companyFormGroup}>
          <label htmlFor="postalCode" className={styles.companyLabel}>
            <span className={styles.companyRequiredStar}>*</span> 住所:
          </label>
          <div className={styles.companyPostalInputContainer}>
            <span className={styles.companyPostalSymbol}>〒</span>
            <InputMask
              mask="999-9999"
              value={fields.postalCode}
              onChange={handlePostalCodeChange}
              className={`${styles.companyPostalInput} ${errors.postalCode ? styles.errorInput : ''}`}
              placeholder="郵便番号"
            >
              {(inputProps) => <input {...inputProps} type="text" id="postalCode" />}
            </InputMask>
            <input
              type="text"
              id="companyAddress"
              className={`${styles.companyAddressInput} ${errors.address ? styles.errorInput : ''}`}
              value={fields.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              placeholder="住所を入力してください"
              maxLength={40}
            />
          </div>
        </div>
      </div>
  
      <div className={styles.companyFormRow}>
        <div className={styles.companyFormGroup}>
          <label htmlFor="websiteUrl" className={styles.companyLabel}>ホームページ:</label>
          <input
            type="text"
            id="websiteUrl"
            className={`${styles.companyFormInput} ${errors.websiteUrl ? styles.errorInput : ''}`}
            value={fields.websiteUrl}
            onChange={(e) => handleFieldChange('websiteUrl', e.target.value)}
            placeholder="ホームページを入力してください"
          />
        </div>
        <div className={styles.companyFormGroup}>
          <label htmlFor="phone" className={styles.companyLabel}>
            <span className={styles.companyRequiredStar}>*</span> 電話番号:
          </label>
          <input
            type="text"
            id="phone"
            className={`${styles.companyFormInput} ${errors.phone ? styles.errorInput : ''}`}
            value={fields.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="電話番号を入力してください (例: 090-0000-1111)"
            maxLength={13}
          />
        </div>
      </div>
  
      <div className={styles.companyFormRow}>
        <div className={styles.companyFormGroup}>
          <label htmlFor="salesEmail" className={styles.companyLabel}>
            <span className={styles.companyRequiredStar}>*</span> 営業共通メール:
          </label>
          <input
            type="email"
            id="salesEmail"
            className={`${styles.companyFormInput} ${errors.salesEmail ? styles.errorInput : ''}`}
            value={fields.salesEmail}
            onChange={(e) => handleFieldChange('salesEmail', e.target.value)}
            placeholder="営業メールを入力してください"
            maxLength={40}
          />
        </div>
        <div className={styles.companyFormGroup}>
          <label htmlFor="hrEmail" className={styles.companyLabel}>
            <span className={styles.companyRequiredStar}>*</span> 採用共通メール:
          </label>
          <input
            type="email"
            id="hrEmail"
            className={`${styles.companyFormInput} ${errors.hrEmail ? styles.errorInput : ''}`}
            value={fields.hrEmail}
            onChange={(e) => handleFieldChange('hrEmail', e.target.value)}
            placeholder="採用メールを入力してください"
            maxLength={40}
          />
        </div>
      </div>
    </div>
  );
  
});

export default CompanyInfoStep;
