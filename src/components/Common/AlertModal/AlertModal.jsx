// src/components/common/AlertModal/AlertModal.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert } from '@mui/material';

// 通用のアラートモーダルコンポーネント
const AlertModal = ({
  open,
  title = '通知',
  message = 'こちらは警告または通知メッセージです！',
  severity = 'info', // 選択可能: 'error', 'warning', 'info', 'success'
  confirmText = '確認',
  cancelText = 'キャンセル',
  showCancel = false, // キャンセルボタンを表示するかどうか
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} 
    onClose={onCancel || onConfirm}
    slotProps={{
        backdrop: {
          invisible: true, // 将蒙层设置为不可见
        },
      }}
      
      >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Alert severity={severity}>{message}</Alert>
      </DialogContent>
      <DialogActions>
        {showCancel && (
          <Button onClick={onCancel} color="secondary">
            {cancelText}
          </Button>
        )}
        <Button onClick={onConfirm} color="primary" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertModal;
