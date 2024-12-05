import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearPopupInfo } from "../../../redux/popupInfoSlice/popupInfoSlice"; // Redux Slice のインポート
import Toast from "../Toast/Toast"; // Toast コンポーネント
import AlertModal from "../AlertModal/AlertModal"; // AlertModal コンポーネント

const GlobalPopupInfoHandler = () => {
  const dispatch = useDispatch();
  const { popupInfo, showInfoFlag } = useSelector((state) => state.popupInfo);

  // 関数名でグローバル関数を呼び出す
  const callFunctionByName = (functionName) => {
    if (typeof window[functionName] === "function") {
      window[functionName](); // グローバル関数を実行
    } else {
      console.error(`関数 "${functionName}" は存在しません。`);
    }
  };

  // 通知を閉じる処理
  const handleClose = () => {
    dispatch(clearPopupInfo()); // Redux 状態をリセット
  };

  if (!showInfoFlag || !popupInfo) {
    return null; // 通知がない場合は何も表示しない
  }

  // popupInfo の内容を展開
  const {
    popupType = "toast",
    variant = "success",
    title,
    content,
    cancelButtonLabel,
    cancelFunctionName,
    confirmButtonLabel,
    confirmFunctionName,
  } = popupInfo;

  // アラート通知の場合
  if (popupType === "alert") {
    return (
      <AlertModal
        open={showInfoFlag}
        title={title || "通知"}
        message={content || ""}
        severity={variant}
        confirmText={confirmButtonLabel || "確認"}
        cancelText={cancelButtonLabel || null}
        onConfirm={() => {
          if (confirmFunctionName) callFunctionByName(confirmFunctionName);
          handleClose();
        }}
        onCancel={() => {
          if (cancelFunctionName) callFunctionByName(cancelFunctionName);
          handleClose();
        }}
      />
    );
  }

  // デフォルトは Toast 通知
  return (
    <Toast
      open={showInfoFlag}
      message={content || ""}
      severity={variant}
      duration={5000}
      onClose={handleClose}
      vertical="top"
      horizontal="center"
    />
  );
};

export default GlobalPopupInfoHandler;
