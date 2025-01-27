/* global Fincode */
import React, { useState, useEffect,useImperativeHandle,forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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

import PaymentCreditCardAdd from "../PaymentCreditCardAdd/PaymentCreditCardAdd";
import { fetchFinCodeCustomer,fetchFinCodeCards,processPayment  } from "../../redux/finCode/finCodeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcVisa, faCcMastercard, faCcAmex, faCcDiscover, faCcJcb, faCcDinersClub } from "@fortawesome/free-brands-svg-icons";

import ErrorHandler from "../../utils/ErrorHandler"; // 错误处理工具
import { LocalError } from "../../utils/LocalError"; // 引入 LocalError
import { useErrorBoundary } from "react-error-boundary"; // 错误边界

const Payment = forwardRef(({ purchaseData }, ref) => {
  const dispatch = useDispatch();
  const { planDetails } = purchaseData;
  const [paymentMethod, setPaymentMethod] = useState("クレジットカード"); // 初始支付方式
  const [selectedCard, setSelectedCard] = useState(null); // 当前选中的信用卡
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenCreditCard, setModalOpenCreditCard] = useState(false);
  const [addCardModalOpen, setAddCardModalOpen] = useState(false); // 控制添加信用卡模态窗体
  const [paymentRedirectUrl, setPaymentRedirectUrl] = useState(null);
  const [cards, setCards] = useState([]);
  const { userId, companyId } = useSelector((state) => state.auth);
  const { customerData, fetchCustomerLoading, cardsData,paymentData } = useSelector(
    (state) => state.finCode
  );
  const { showBoundary } = useErrorBoundary(); // 错误边界函数
  const [localError, setLocalError] = useState(null); // 本地错误状态
  useImperativeHandle(ref, () => ({
    handleCreditCardPayment,
  }));
  // 根据品牌返回对应的图标组件
  const CardIcon = ({ brand }) => {
    switch (brand) {
      case "VISA":
        return <FontAwesomeIcon icon={faCcVisa} size="2x" color="#1a237e" />;
      case "MASTER":
        return <FontAwesomeIcon icon={faCcMastercard} size="2x" color="#f79e1b" />;
      case "AMEX":
        return <FontAwesomeIcon icon={faCcAmex} size="2x" color="#016fd0" />;
      case "DISCOVER":
        return <FontAwesomeIcon icon={faCcDiscover} size="2x" color="#ff6000" />;
      case "JCB":
        return <FontAwesomeIcon icon={faCcJcb} size="2x" color="#0060a9" />;
      case "DINERS":
        return <FontAwesomeIcon icon={faCcDinersClub} size="2x" color="#1a237e" />;
      default:
        return <FontAwesomeIcon icon={faCcVisa} size="2x" color="#999" />;
    }
  };

  // 获取客户信息
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        await dispatch(fetchFinCodeCustomer({ companyId, userId })).unwrap();
      } catch (error) {
        console.log('****fetchFinCodeCustomer catched error=',error);
        ErrorHandler.doCatchedError(
          error,
          setLocalError, // 本地错误处理函数
          showBoundary, // 错误边界处理函数
          "popup", // GlobalPopupError 处理方式
          "throw", // 其他错误处理方式
          "SYSTEM_ERROR" // 默认错误代码
        );
      }
    };

    fetchCustomer();
  }, [dispatch, companyId, userId, showBoundary]);
  
  // 获取信用卡信息
  useEffect(() => {
    const fetchCards = async () => {
      try {
        if (companyId) {
          await dispatch(fetchFinCodeCards({ companyId })).unwrap();
        }
      } catch (error) {
        ErrorHandler.doCatchedError(
          error,
          setLocalError, // 本地错误处理函数
          showBoundary, // 错误边界处理函数
          "popup", // GlobalPopupError 处理方式
          "throw", // 其他错误处理方式
          "SYSTEM_ERROR" // 默认错误代码
        );
      }
    };

    fetchCards();
  }, [dispatch, companyId, showBoundary]);


  useEffect(() => {
    // 当 cardsData 发生变化时，更新信用卡列表
    console.log("***cardsData=",cardsData);
    if (cardsData?.list) {
      setCards(cardsData.list);
    }
  }, [cardsData]);

  // 监听 paymentData?.redirect_url 更新状态
useEffect(() => {
  if (paymentData?.redirect_url) {
    setPaymentRedirectUrl(paymentData.redirect_url);
    setModalOpenCreditCard(true);
  }
}, [paymentData?.redirect_url]);


  const handleAddCard = async () => {
    console.log('***handleAddCard.companyId=',companyId);
    try {
      await dispatch(fetchFinCodeCards({ companyId })).unwrap();
    } catch (error) {
      ErrorHandler.doCatchedError(
        error,
        setLocalError,
        showBoundary,
        "popup",
        "throw",
        "SYSTEM_ERROR"
      );
    }
  };


  const handleCreditCardPayment = async () => {
    if (!selectedCard) {
      alert("クレジットカードを選択してください。");
      return;
    }
  
 
    try {
      const paymentPayload = {
        companyId,
        userId,
        paymentMethod: "Card",
        amount: purchaseData.planDetails.plan.basePrice,
        card: {
          customer_id: selectedCard.customer_id,
          card_id: selectedCard.id,
        },
      };
      console.log('****paymentPayload=',paymentPayload);
  
      // 触发支付请求
      await dispatch(processPayment(paymentPayload)).unwrap();
    } catch (error) {
      ErrorHandler.doCatchedError(
        error,
        setLocalError,
        showBoundary,
        "popup",
        "throw",
        "SYSTEM_ERROR"
      );
    } finally {

    }
  };
  
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleOpenAddCardModal = () => {  
      setAddCardModalOpen(true); // 打开模态窗体    
  };

  const handleCloseAddCardModal = () => {
    setAddCardModalOpen(false); // 关闭模态窗体
  };


  const handleSelectMethod = (method) => {
    setPaymentMethod(method);
    handleModalClose();
  };

  const handleSelectCard = (card) => {
    setSelectedCard(card);
  };

// 关闭模态窗体时清空 URL
const handleCloseModalCreditCard = () => {
  setModalOpenCreditCard(false);  // 关闭模态窗口
  setPaymentRedirectUrl(null);    // 清空支付 URL
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

      {/* 错误显示区域 */}
      <Box
        sx={{
          height: "24px", // 固定高度，确保无错误时也占据同样的空间
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 2,
        }}
      >
        {localError && (
          <Typography
            sx={{
              color: "red", // 有错误时显示红色文字
              textAlign: "center",
            }}
          >
            {localError.errorMessage}
          </Typography>
        )}
      </Box>


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
            height: "215px", // 固定高度
            overflowX: "auto", // 启用横向滚动条
            overflowY: "auto", // 启用纵向滚动条
            "&::-webkit-scrollbar": {
              width: "6px", // 滚动条宽度
              height: "6px", // 横向滚动条高度
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column", // 保持竖向排列
                gap: "0px", // 卡片间距
              }}
            >
              {cards.map((card) => (
                <Box
                  key={card.id}
                  sx={{
                    minWidth: "100%", // 卡片宽度最小为容器宽度
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    backgroundColor: selectedCard?.id === card.id ? "#d8ecf8" : "#f9f9f9",
                    border: selectedCard?.id === card.id ? "2px solid #0288d1" : "1px solid #e0e0e0",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    boxShadow: selectedCard?.id === card.id
                      ? "0 6px 12px rgba(2, 136, 209, 0.3)"
                      : "0 2px 6px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                    },
                    overflow: "hidden", // 防止内容超出
                    whiteSpace: "nowrap", // 防止内容换行
                    textOverflow: "ellipsis", // 超出内容显示省略号
                  }}
                  onClick={() => handleSelectCard(card)}
                >
                  {/* 左侧内容：单选按钮 + 卡片信息 */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: "16px", width: "80%" }}>
                    <Radio
                      checked={selectedCard?.id === card.id}
                      onChange={() => handleSelectCard(card)}
                      sx={{
                        color: "#0288d1",
                        "&.Mui-checked": {
                          color: "#0288d1",
                        },
                      }}
                    />
                    <CardIcon brand={card.brand} /> {/* 动态显示信用卡品牌图标 */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          fontWeight: "bold",
                          color: "#333",
                          fontFamily: "Roboto, Arial, sans-serif",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        **** **** **** {card.card_no.slice(-4)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: "300",
                          color: "#757575",
                          fontFamily: "Roboto, Arial, sans-serif",
                        }}
                      >
                        有効期限: {`${card.expire.slice(0, 2)}/${card.expire.slice(2, 4)}`}
                      </Typography>
                    </Box>
                  </Box>
              
                  {/* 右侧持卡人信息 */}
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      color: "#424242",
                      fontFamily: "Roboto, Arial, sans-serif",
                      textAlign: "right",
                      flexShrink: 0, // 防止右侧持卡人信息被压缩
                      overflow: "hidden", // 防止内容溢出
                      whiteSpace: "nowrap", // 防止换行
                      textOverflow: "ellipsis", // 超出部分显示省略号
                    }}
                  >
                    {card.holder_name || "未登録"}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        {/* 添加信用卡按钮 */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddCardModal}
          sx={{
            width: "100%",
            backgroundColor: "#1a237e",
            "&:hover": { backgroundColor: "#3949ab" },
          }}
        >
          クレジットカードを追加
        </Button>

        {/* 添加信用卡模态窗体 */}
        <PaymentCreditCardAdd
          open={addCardModalOpen}
          onClose={handleCloseAddCardModal}
          onCardAdded={handleAddCard}
        />
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

      <div>
        {modalOpenCreditCard && (
          <Modal open={modalOpenCreditCard} onClose={handleCloseModalCreditCard}>
            <Box 
              sx={{ 
                width: "100%", 
                height: "100%", 
                margin: "auto", 
                position: "relative" 
              }}
            >
              {/* 关闭按钮 */}
              <Button 
                onClick={handleCloseModalCreditCard} 
                sx={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  minWidth: "40px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  fontSize: "20px",
                  color: "#333",
                  "&:hover": {
                    backgroundColor: "#e0e0e0"
                  }
                }}
              >
                ×
              </Button>

              <iframe 
                id="fincodeIframe"
                src={paymentData?.redirect_url} 
                width="100%" 
                height="100%" 
                style={{ border: "none" }} 
                sandbox="allow-scripts allow-forms allow-same-origin"
              />
            </Box>
          </Modal>
        )}
      </div>
    </Box>
  );
});

export default Payment;
