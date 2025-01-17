/* global Fincode */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Radio,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AddIcon from "@mui/icons-material/Add";
import VisaIcon from "@mui/icons-material/Payment";

const Payment = ({ purchaseData, onPaymentComplete }) => {
  const { planDetails } = purchaseData;
  const [paymentMethod, setPaymentMethod] = useState("クレジットカード"); // 初始支付方式
  const [selectedCard, setSelectedCard] = useState(null); // 当前选中的信用卡
  const [modalOpen, setModalOpen] = useState(false);

  // 模拟信用卡数据
  const cards = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    number: `**** **** **** ${1000 + i}`,
    holder: `持卡人 ${i + 1}`,
    type: i % 2 === 0 ? "Visa" : "MasterCard",
  }));

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleSelectMethod = (method) => {
    setPaymentMethod(method);
    handleModalClose();
  };

  const handleSelectCard = (id) => {
    setSelectedCard(id);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "inherit",
        margin: "0 auto",
        padding: "2%",
        display: "flex",
        flexDirection: "column",
        gap: "2%",
        alignItems: "center",
      }}
    >
      {/* 标题 */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#1a237e",
          textAlign: "center",
        }}
      >
        支払
      </Typography>

      {/* 标题与金额 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          background: "#f5f5f5",
          padding: "1% 2%",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            color: "#333",
          }}
        >
          お支払い金額
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#1a237e",
          }}
        >
          ¥{planDetails?.plan?.basePrice?.toLocaleString() || "N/A"}
        </Typography>
      </Box>

      {/* 支付方式选择 */}
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          color: "#333",
          width: "100%",
          padding: 0,
          marginTop: 2,
          marginBottom: 1,
        }}
      >
        お支払い方法をご選択ください
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "1% 2%",
          border: "1px solid #ccc",
          borderRadius: "8px",
          background: "#f9f9f9",
          cursor: "pointer",
        }}
        onClick={handleModalOpen}
      >
        <Typography
          sx={{
            fontSize: "1rem",
            color: "#333",
          }}
        >
          {paymentMethod}
        </Typography>
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#1a237e",
          }}
        >
          ▶
        </Typography>
      </Box>

      {/* 信用卡或银行转账显示区域 */}
      {paymentMethod === "クレジットカード" && (
        <>
          <Box
            sx={{
              width: "100%",
              marginTop: 2,
              background: "#f5f5f5",
              borderRadius: "8px",
              padding: "1% 2%",
              height: "230px", // 固定高度
              overflowY: "auto", // 启用滚动条
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f0f0f0",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#1a237e",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#3949ab",
              },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#333", marginBottom: 1 }}
            >
              登録済みクレジットカード
            </Typography>

            {/* 条件渲染：如果没有信用卡数据，显示提示信息 */}
            {cards.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "80%", // 撑满高度
                  textAlign: "left",
                  gap: 2,
                  color: "#888",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#999",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                  }}
                >
                  お支払いを続行するには、クレジットカードを登録してください。<br />
                  ボタンをクリックしてカードを追加できます。
                </Typography>
              </Box>
            ) : (
              // 有数据时渲染卡片列表
              cards.map((card) => (
                <Box
                  key={card.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5% 1%",
                    background: selectedCard === card.id ? "#e3f2fd" : "#fff",
                    border: selectedCard === card.id
                      ? "2px solid #1a237e"
                      : "1px solid #ddd",
                    borderRadius: "8px",
                    marginBottom: 1,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Radio
                      checked={selectedCard === card.id}
                      onChange={() => handleSelectCard(card.id)}
                      sx={{ color: "#1a237e" }}
                    />
                    <VisaIcon sx={{ color: "#1a237e", fontSize: "1.5rem" }} />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <Typography sx={{ fontSize: "1rem", color: "#333" }}>
                        {card.number}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
                        {card.type} - 有効期限: {`12/${25 + card.id}`}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#666",
                      marginRight: "8px",
                    }}
                  >
                    {card.holder}
                  </Typography>
                </Box>
              ))
            )}
          </Box>

          {/* 追加信用卡按钮（即使卡为空时显示） */}
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
            onClick={() => {
              console.log("Redirect to Add Credit Card Page");
              // 跳转到添加信用卡页面或执行其他操作
            }}
          >
            クレジットカードを追加
          </Button>
        </>
      )}




    {paymentMethod === "銀行振込" && (
    <Box
        sx={{
        width: "100%",
        marginTop: 2,
        background: "#f5f5f5",
        borderRadius: "8px",
        padding: "1% 2%",
        }}
    >
        <Typography
        sx={{
            color: "#666",
            fontSize: "0.9rem", // 提醒文字字体较小
            lineHeight: "1.5", // 调整行高
            marginBottom: 1,
        }}
        >
        お支払い用口座情報をお送りします。
        </Typography>
        <Typography
        sx={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: 2,
            fontSize: "0.9rem",
        }}
        >
        お名前: Test Customer
        </Typography>
        <Typography
        sx={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: 2,
            fontSize: "0.9rem",
        }}
        >
        メールアドレス: wangkeliang2018@outlook.com
        </Typography>
        <Typography
        sx={{
            color: "#666",
            fontSize: "0.8rem",
            lineHeight: "1.8", // 行间距
        }}
        >
        【留意事項】<br />
        ・振込手数料はお客様負担となります。<br />
        ・有効期限を経過するとお振込みいただけなくなりますのでご注意ください。<br />
        ・<span style={{ fontWeight: "bold", color: "#d32f2f" }}>毎月第２土曜日21:50～翌日曜日{" "}
         6:00</span> はシステムメンテナンスのため、振込先の口座情報の表示ができません。<br />
        ・メンテナンス中もお振込みは可能ですが、入金確認はメンテナンス終了後に順次行われます。
        支払期限がメンテナンス時間内の場合、
        <span style={{ fontWeight: "bold", color: "#d32f2f" }}>21:49</span>
        までにお振込みください。
        </Typography>
    </Box>
    )}


      {/* 模态窗体 */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            maxWidth: "320px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            p: "2%",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: "#1a237e",
              marginBottom: "2%",
            }}
          >
            お支払い方法の選択
          </Typography>
          <List>
            <ListItem
              button
              onClick={() => handleSelectMethod("クレジットカード")}
              sx={{
                padding: "2%",
              }}
            >
              <ListItemIcon>
                <CreditCardIcon style={{ color: "#1a237e" }} />
              </ListItemIcon>
              <ListItemText
                primary="クレジットカード"
                primaryTypographyProps={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              />
            </ListItem>
            <ListItem
              button
              onClick={() => handleSelectMethod("銀行振込")}
              sx={{
                padding: "2%",
              }}
            >
              <ListItemIcon>
                <AccountBalanceIcon style={{ color: "#1a237e" }} />
              </ListItemIcon>
              <ListItemText
                primary="銀行振込"
                primaryTypographyProps={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Modal>
    </Box>
  );
};

export default Payment;
