import React from 'react';
import './PromoPanelCmp.css';

function PromoPanelCmp() {
  return (
    <div className="promo-panel slds-text-align_center">
      <h2 className="promo-title">あなたのビジネスにさらなる成長を</h2>
      <p className="promo-description">セールス、サービス、マーケティング、ITなど<br />会社のあらゆる業務の効率化を支援</p>
      <div className="promo-buttons">
        <button className="slds-button slds-button_brand">無料トライアル</button>
        <button className="slds-button slds-button_neutral">デモを見せる</button>
      </div>
    </div>
  );
}

export default PromoPanelCmp;
