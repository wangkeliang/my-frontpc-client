/* global Fincode */
import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { initFincode, registerCard } from "@fincode/js";
import { useSelector } from "react-redux";
const PaymentCreditCardAdd = ({ onCardAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fincodeUIId = "fincode-ui-container";
  const fincodeRef = useRef(null);
  const uiRef = useRef(null);
  const { customerData } = useSelector((state) => state.finCode);

  // 初始化 Fincode 对象
  useEffect(() => {
    const fincodePublicKey =
      "p_test_YzdjM2I3ODEtZjI3My00MWE3LTg1MWYtOTZmZDdmYTZiMDAyYjcxNjIyOWMtZDYwZi00YjI1LWE3ZjAtYWE2ODMzNDMyNzQ2c18yNTAxMTgzNTE0Mg";

    const initializeFincode = async () => {
      // 初始化 Fincode 实例
      if (!fincodeRef.current) {
        fincodeRef.current = await initFincode({
          publicKey: fincodePublicKey,
          isLiveMode: false, // 设置为 true 表示生产环境
        });
      }

      // 挂载 UI
      if (isModalOpen) {
        requestAnimationFrame(() => {
          // if (!uiRef.current) {
            uiRef.current = fincodeRef.current.ui({ layout: "horizontal" });
            uiRef.current.create("payment", { layout: "horizontal" });
            uiRef.current.mount(fincodeUIId, "500");
          // }
        });
      }
    };

    initializeFincode();
  }, [isModalOpen]);

  // 提交信用卡信息到 Fincode
  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");

    if (!customerData?.customer_id) {
      setErrorMessage("顧客情報が不足しています。再度お試しください。");
      setLoading(false);
      return;
    }

    try {
      // 获取用户输入的信用卡数据
      const formData = await uiRef.current.getFormData();
      console.log("Form Data:", formData);

      // 提交信用卡信息到 Fincode
      await registerCard({
        fincode: fincodeRef.current,
        ui: uiRef.current,
        customerId: customerData.customer_id, // 从 Redux 中动态获取 customerId
        useDefault: true, // 设置为默认卡片
      });

      // 调用回调函数，通知父组件
      onCardAdded({
        number: `**** **** **** ${formData.cardNo.slice(-4)}`,
        holder: formData.holderName,
      });

      handleCloseModal();
    } catch (error) {
      setErrorMessage(
        error.message || "クレジットカード登録に失敗しました。再度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage(""); // 清空错误信息
  };

  return (
    <>
      {/* 追加按钮 */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          marginTop: 2,
          width: "100%",
          padding: "10px",
          fontWeight: "bold",
          color: "#fff",
          backgroundColor: "#1a237e",
          "&:hover": { backgroundColor: "#3949ab" },
        }}
        onClick={handleOpenModal}
      >
        クレジットカードを追加
      </Button>

      {/* 模态窗体 */}
      {isModalOpen && (
        <Modal open onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              height: "68%",
              transform: "translate(-50%, -50%)",
              width: "550px", // 调整宽度
              padding: "16px", // 减少 padding
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#1a237e",
                marginBottom: 2,
                textAlign: "center",
              }}
            >
              クレジットカードを追加
            </Typography>

            {/* 显示错误信息 */}
            {errorMessage && (
              <Typography
                sx={{
                  color: "red",
                  fontSize: "0.9rem",
                  marginBottom: 2,
                  textAlign: "center",
                }}
              >
                {errorMessage}
              </Typography>
            )}

            {/* Fincode UI 容器 */}
            <form id="fincode-ui-container-form">
              <div id={fincodeUIId}></div>
            </form>

            {/* 提交按钮 */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                marginTop: 1, // 减少与表单的距离
                backgroundColor: "#1a237e",
                "&:hover": { backgroundColor: "#3949ab" },
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "登録中..." : "登録する"}
            </Button>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default PaymentCreditCardAdd;
