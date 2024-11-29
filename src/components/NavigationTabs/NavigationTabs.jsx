import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../../redux/mainLayout/tabSlice';
import './NavigationTabs.css';

const NavigationTabs = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tab); // 从 Redux 中获取 activeTab
  const permissionInfo = useSelector((state) => state.permissions.permissioninfo); // 获取权限信息

  // 判断某个 Tab 是否有权限显示
  const isTabVisible = (tabId) => {
    return permissionInfo?.Tab?.[tabId] === 1; // 根据权限信息判断是否显示
  };

  return (
    <nav className="custom-navigation-tabs slds-tabs_default">
      {isTabVisible('HomeTab') && (
        <a
          id="HomeTab"
          onClick={() => dispatch(setActiveTab('Home'))}
          className={`custom-navigation-tab ${activeTab === 'Home' ? 'active' : ''}`}
        >
          ホーム
        </a>
      )}
      {isTabVisible('CaseTab') && (
        <a
          id="CaseTab"
          onClick={() => dispatch(setActiveTab('Case'))}
          className={`custom-navigation-tab ${activeTab === 'Case' ? 'active' : ''}`}
        >
          案件
        </a>
      )}
      {isTabVisible('CandidateTab') && (
        <a
          id="CandidateTab"
          onClick={() => dispatch(setActiveTab('Candidate'))}
          className={`custom-navigation-tab ${activeTab === 'Candidate' ? 'active' : ''}`}
        >
          人材
        </a>
      )}
      {isTabVisible('PartnerTab') && (
        <a
          id="PartnerTab"
          onClick={() => dispatch(setActiveTab('Partner'))}
          className={`custom-navigation-tab ${activeTab === 'Partner' ? 'active' : ''}`}
        >
          パートナ
        </a>
      )}
      {isTabVisible('MeetingTab') && (
        <a
          id="MeetingTab"
          onClick={() => dispatch(setActiveTab('Meeting'))}
          className={`custom-navigation-tab ${activeTab === 'Meeting' ? 'active' : ''}`}
        >
          会議
        </a>
      )}
      {isTabVisible('MailTab') && (
        <a
          id="MailTab"
          onClick={() => dispatch(setActiveTab('Mail'))}
          className={`custom-navigation-tab ${activeTab === 'Mail' ? 'active' : ''}`}
        >
          メール送信
        </a>
      )}
      {isTabVisible('ReportTab') && (
        <a
          id="ReportTab"
          onClick={() => dispatch(setActiveTab('Report'))}
          className={`custom-navigation-tab ${activeTab === 'Report' ? 'active' : ''}`}
        >
          レポート
        </a>
      )}
      {isTabVisible('BulletinBoardTab') && (
        <a
          id="BulletinBoardTab"
          onClick={() => dispatch(setActiveTab('BulletinBoard'))}
          className={`custom-navigation-tab ${activeTab === 'BulletinBoard' ? 'active' : ''}`}
        >
          掲示板
        </a>
      )}
    </nav>
  );
};

export default NavigationTabs;