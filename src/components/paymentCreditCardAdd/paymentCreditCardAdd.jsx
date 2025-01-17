/* global Fincode */
import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";

const PaymentCreditCardAdd = ({ onCardAdded }) => {
  const [isMounted, setIsMounted] = useState(false); // 检测UI是否已经挂载

  useEffect(() => {
    // 初始化 Fincode UI
    const publicKey = "p_test_ZjBjOTE5ZTEtM2FmZS00ZTUzLWE4MjQtY2EyZWUyMjNlMDUwYWYwODI2MjQtNDc3Mi00NzIxLWI2YTAtZjQ0NjVhOWQ1MTc5c18yNTAxMTEyNDM1Ng"; // 替换为真实的公钥
    const fincode = Fincode(publicKey);

    const ui = fincode.ui({
      layout: "vertical",
      hideLabel: false,
      labelCardNo: "カード番号",
      labelExpire: "有効期限 (YYMM)",
      labelCvc: "セキュリティコード",
      labelHolderName: "カード名義人",
    });

    // 挂载 UI 到指定的 DOM 元素
    if (!isMounted) {
      ui.mount("fincode", "400"); // 挂载宽度为 400
      setIsMounted(true);
    }

    return () => {
      // 清理挂载
      setIsMounted(false);
    };
  }, [isMounted]);

  // 提交表单
  const handleSubmit = () => {
    const publicKey = "p_test_eagefdfsfew52443526f5345rf2353466345346ffsdf36345235rf4363fsdsdf45634tg53673523542"; // 替换为真实的公钥
    const fincode = Fincode(publicKey);

    const ui = fincode.ui();
    ui.getFormData().then((result) => {
      console.log("表单数据：", result);
      // 调用 API 或保存数据
      onCardAdded(result); // 通知主组件信用卡已添加
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#1a237e",
          textAlign: "center",
        }}
      >
        クレジットカードを追加
      </Typography>

      <form id="fincode-form">
        <div id="fincode"></div>
      </form>

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          width: "100%",
          padding: "10px",
          fontWeight: "bold",
          color: "#fff",
          backgroundColor: "#1a237e",
          "&:hover": { backgroundColor: "#3949ab" },
        }}
      >
        登録する
      </Button>
    </Box>
  );
};

export default PaymentCreditCardAdd;
