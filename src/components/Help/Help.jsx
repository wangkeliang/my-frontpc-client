// src/components/Header/Help.jsx
import React from 'react';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';

const Help = () => (
  <div >
    <button className="slds-button slds-button_icon slds-button_icon-large custom-icon-button" title="Help">
      <svg className="slds-button__icon" aria-hidden="true">
        <use href="/assets/icons/utility-sprite/svg/symbols.svg#help"></use>
      </svg>
      <span className="slds-assistive-text">Help</span>
    </button>
  </div>
);

export default Help;
