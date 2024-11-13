// src/components/RegistrationFormCmp/RegistrationFormCmp.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';
import './RegistrationFormCmp.css';
import { useNavigate } from 'react-router-dom';
import {
  handleEmailChange,
  handlePasswordChange,
  handleConfirmPasswordChange,
  handleSubmit,
  getPasswordStrengthColor,
} from '../../services/RegistrationFormService';
import { setFormError } from '../../redux/auth/registerSlice';

function RegistrationFormCmp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formError, status } = useSelector((state) => state.register);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'individual',
  });
  const [emailError, setEmailError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <div className="registration-container slds-box slds-theme_default slds-p-around_large slds-m-around_medium">
      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            formData,
            dispatch,
            navigate,
            (error) => dispatch(setFormError(error)), 
            emailError,
            agreeTerms,
            passwordMatch,
            passwordStrength
          )
        }
        className="slds-form slds-form_stacked"
      >
        <h2 className="slds-text-heading_medium custom-title">アカウントの新規作成（無料）</h2>

        <div style={{ minHeight: '24px' }}>
          {formError && (
            <div className="slds-text-color_error slds-m-bottom_medium slds-text-heading_small" style={{ fontWeight: 'bold' }}>
              <span className="slds-icon_container slds-icon-utility-error" title="error" style={{ marginRight: '5px' }}>
                ❗
              </span>
              {formError}
            </div>
          )}
        </div>

        <div className="slds-form-element custom-form-element">
          <div className="slds-form-element__control">
            <div className="slds-radio">
              <input
                type="radio"
                id="individual"
                name="accountType"
                value="individual"
                checked={formData.accountType === 'individual'}
                onChange={() => setFormData({ ...formData, accountType: 'individual' })}
              />
              <label className="slds-radio__label" htmlFor="individual">
                <span className="slds-radio_faux"></span>
                <span>個人事業主</span>
              </label>
            </div>
            <div className="slds-radio">
              <input
                type="radio"
                id="corporate"
                name="accountType"
                value="corporate"
                checked={formData.accountType === 'corporate'}
                onChange={() => setFormData({ ...formData, accountType: 'corporate' })}
              />
              <label className="slds-radio__label" htmlFor="corporate">
                <span className="slds-radio_faux"></span>
                <span>法人</span>
              </label>
            </div>
          </div>
        </div>

        <label className="slds-form-element__label" htmlFor="email">メールアドレス</label>
        <div className="slds-form-element__control custom-form-element">
          <input
            type="email"
            id="email"
            maxLength="40"
            value={formData.email}
            onChange={(e) => handleEmailChange(e, setEmailError, setFormData)}
            className="slds-input"
            placeholder="メールアドレス"
          />
          {emailError && <span className="slds-text-color_error">{emailError}</span>}
        </div>

        <label className="slds-form-element__label" htmlFor="password">パスワード</label>
        <div className="slds-form-element__control custom-form-element">
          <input
            type="password"
            id="password"
            maxLength="30"
            value={formData.password}
            onChange={(e) => handlePasswordChange(e, setFormData, setPasswordStrength)}
            className="slds-input"
            placeholder="8文字以上"
          />
          <span style={{ color: getPasswordStrengthColor(passwordStrength) }}>{passwordStrength}</span>
        </div>

        <label className="slds-form-element__label" htmlFor="confirmPassword">もう一度入力してください</label>
        <div className="slds-form-element__control custom-form-element">
          <input
            type="password"
            id="confirmPassword"
            maxLength="30"
            value={formData.confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e, setPasswordMatch, setFormData, formData.password)}
            className="slds-input"
            placeholder="もう一度入力してください"
          />
          <div className="slds-text-color_error">
            {!passwordMatch && 'パスワードが一致しません'}
          </div>
        </div>

        <div className="slds-form-element slds-m-bottom_large">
          <label className="slds-checkbox__label">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span className="slds-checkbox_faux"></span>
            <span>以下の規約・ポリシーを確認の上、同意します。</span>
          </label>
          <div className="slds-m-top_x-small slds-text-body_small">
            <a href="#">利用規約</a>・<a href="#">プライバシーポリシー</a>・<a href="#">反社条項付き誓约书はこちら</a>
          </div>
        </div>

        <div className="button-container">
          <button type="submit" className="custom-registration-button" disabled={!agreeTerms || status === 'loading'}>
            サインアップ
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationFormCmp;
