import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../../redux/user/userSlice'; // 假设该方法已存在
import './CompletionStep.css';

const CompletionStep = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [statusMessage, setStatusMessage] = useState('');
  const userId = useSelector((state) => state.auth?.userId); // 从 store 获取 userId

  useEffect(() => {
    const checkUserApplicationStatus = async () => {
      try {
        // 调用 fetchUserInfo 获取最新的 userInfo
        const userInfo = await dispatch(fetchUserInfo(userId)).unwrap();

        // 检查 applicationStatus 的状态
        const applicationStatus = userInfo?.applicationStatus;

        if (applicationStatus === 'applying') {
          setStatusMessage(
            'お客様の情報をご入力いただき、誠にありがとうございます。\n\n' +
            '現在、貴社のシステム管理者による承認手続きが進行中です。\n' +
            '承認が完了次第、システムをご利用いただけるようになりますので、\n' +
            'しばらくお待ちください。'
          );
        } else if (applicationStatus === 'approved') {
          setStatusMessage(
            'お客様の情報をご入力いただき、誠にありがとうございます。\n\n' +
            '現在、システムをご利用いただける状態となっております。\n' +
            '必要な機能をご活用いただき、業務の効率化にお役立てください。'
          );
        } else if (applicationStatus === 'rejected') {
          setStatusMessage(
            'お客様の情報をご入力いただき、誠にありがとうございます。\n\n' +
            '残念ながら、貴社のシステム管理者により申請が拒否されました。\n' +
            '詳細については、貴社のシステム管理者までお問い合わせください。'
          );
        } else {
          setStatusMessage(
            'お客様の情報をご入力いただき、誠にありがとうございます。\n\n' +
            '現在の申請状況は確認中です。少々お待ちください。'
          );
        }
      } catch (error) {
        console.error('ユーザー情報の取得中にエラーが発生しました: ', error);
        setStatusMessage(
          'お客様の情報を取得できませんでした。\n\n' +
          '再度お試しいただくか、管理者までお問い合わせください。'
        );
      }
    };

    if (userId) {
      checkUserApplicationStatus();
    }
  }, [dispatch, userId]);

  // 确保 useImperativeHandle 正确绑定 ref
  useImperativeHandle(ref, () => ({
    completeAction: () => {
      console.log('Completion action executed');
    },
  }));

  return (
    <div className="completion-step">
      <div className="completion-message">
        <p>{statusMessage}</p>
      </div>
    </div>
  );
});

export default CompletionStep;
