// src/components/Header/Notifications.jsx
import React from 'react';
import '@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg';

const Notifications = () => (
  <div className="notifications">
    <button className="slds-button slds-button_icon slds-button_icon-large custom-icon-button" title="Notifications">
     <svg className="slds-button__icon" aria-hidden="true">
        <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#notification"></use>
      </svg>
      <span className="slds-assistive-text">Notifications</span>
    </button>
  </div>
);

export default Notifications;
