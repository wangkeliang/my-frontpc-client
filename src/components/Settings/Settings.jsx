// src/components/Header/Settings.jsx
import React from 'react';
import '@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg';

const Settings = () => (
  <div className="settings ">
      <button className="slds-button slds-button_icon slds-button_icon-large custom-icon-button" title="Setting">
      <svg className="slds-button__icon" aria-hidden="true">
        <use xlinkHref={`${process.env.PUBLIC_URL}/assets/icons/utility-sprite/svg/symbols.svg#settings`}></use>
      </svg>
      <span className="slds-assistive-text">Settings</span>
    </button>
  </div>
);

export default Settings;
