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
import { 
  fetchFinCodeCustomer, 
  fetchFinCodeCards, 
  registerPayment, 
  processPayment, 
  clearFinCodeData, 
  clearCardsData, 
  clearRegisterPaymentData, 
  clearPaymentData, 
  clearCardPaymentWebhookResult,
  clearBankPaymentWebhookResult
 } from "../../redux/finCode/finCodeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcVisa, faCcMastercard, faCcAmex, faCcDiscover, faCcJcb, faCcDinersClub } from "@fortawesome/free-brands-svg-icons";

import ErrorHandler from "../../utils/ErrorHandler"; // 错误处理工具
import { LocalError } from "../../utils/LocalError"; // 引入 LocalError
import { useErrorBoundary } from "react-error-boundary"; // 错误边界
import { AccessibleRounded } from "@mui/icons-material";

const Payment = forwardRef(({ purchaseData, doPaymentResult }, ref) => {
  const dispatch = useDispatch();
  const { planDetails } = purchaseData;
  const [pay_type, setPayType] = useState("クレジットカード"); // 初始支付方式
  const [selectedCard, setSelectedCard] = useState(null); // 当前选中的信用卡
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenCreditCard, setModalOpenCreditCard] = useState(false);
  const [addCardModalOpen, setAddCardModalOpen] = useState(false); // 控制添加信用卡模态窗体

  const [cards, setCards] = useState([]);
  const { userId, companyId } = useSelector((state) => state.auth);
  const { customerData, fetchCustomerLoading, cardsData,paymentData } = useSelector(
    (state) => state.finCode
  );
  const cardWebhookResult = useSelector((state) => state.finCode.cardPaymentWebhookResult);
  const bankWebhookResult = useSelector((state) => state.finCode.bankPaymentWebhookResult);
  const [isPaymentAuthWindowClosed, setIsPaymentAuthWindowClosed] = useState(false);
  const { showBoundary } = useErrorBoundary(); // 错误边界函数
  const [localError, setLocalError] = useState(null); // 本地错误状态

  useImperativeHandle(ref, () => ({
    handlePayment,
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
    // 组件加载时先清空所有支付相关数据
    setLocalError(null);
    dispatch(clearFinCodeData());
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
    // 清空相关支付信息，客户信息保持不变
    dispatch(clearCardsData());
    fetchCreditCards();
  }, [dispatch, companyId, showBoundary]);

  const fetchCreditCards = async () => {
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

  useEffect(() => {
    // 当 cardsData 发生变化时，更新信用卡列表
    console.log("***cardsData=",cardsData);
    if (cardsData?.list) {
      setCards(cardsData.list);
    }
  }, [cardsData]);


  useEffect(() => {
    console.log('***paymentData?.redirect_url=',paymentData?.redirect_url);
    if (paymentData?.redirect_url) {
      setLocalError(null);
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const popupWidth = 800;
      const popupHeight = 600;
      const left = (screenWidth - popupWidth) / 2;
      const top = (screenHeight - popupHeight) / 2;
  
      // 打开支付认证窗口
      const paymentAuthWindow = window.open(
        paymentData.redirect_url,
        "_blank",
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no`
      );
  
      setIsPaymentAuthWindowClosed(false); // 设置支付认证窗口打开状态
  
      // 定义回调函数，供支付窗口关闭后调用
      const handlePaymentAuthWindowClose = () => {
        console.log("支付认证窗口已关闭");
        dispatch(clearPaymentData());
        console.log('★★★paymentData?.redirect_url=',paymentData?.redirect_url);
        setIsPaymentAuthWindowClosed(true); // 记录支付认证窗口关闭状态
      };
  
      // 监听窗口关闭
      const interval = setInterval(() => {
        if (paymentAuthWindow && paymentAuthWindow.closed) {
          console.log('***setInterval');
          clearInterval(interval);
          handlePaymentAuthWindowClose();
        }
      }, 100);
  
      // 处理窗口关闭事件（更快地触发）
      paymentAuthWindow.onbeforeunload = () => {
        console.log('***onbeforeunload');
        clearInterval(interval);        
        handlePaymentAuthWindowClose();
      };
  
      return () => {
        clearInterval(interval);
      };
    }
  }, [paymentData?.redirect_url]);


  useEffect(() => {
    console.log('***isPaymentAuthWindowClosed=',isPaymentAuthWindowClosed);
    console.log('***cardWebhookResult=',cardWebhookResult);
    if (isPaymentAuthWindowClosed && cardWebhookResult) {
      console.log("Webhook 结果:", cardWebhookResult);
      if (cardWebhookResult.isSuccess) {
        doPaymentResult({
          status: 'success',
          method: pay_type,  // 传递支付方式（クレジットカード 或 銀行振込）
          details: selectedCard ? `**** **** **** ${selectedCard.card_no.slice(-4)}` : '銀行振込',
        });
      } else {
        setLocalError(new LocalError({ errorMessage: cardWebhookResult.error?.errorMessage}));
        doPaymentResult({
          status: 'failure',
          method: pay_type,
          details: cardWebhookResult.error?.errorMessage || "支払い失敗",
        });
      }
    }
  }, [isPaymentAuthWindowClosed, cardWebhookResult]);


  useEffect(() => {    
    console.log('***bankWebhookResult=',bankWebhookResult);
    if (bankWebhookResult) {
      console.log("Webhook 结果:", bankWebhookResult);
      if (bankWebhookResult.isSuccess) {
        doPaymentResult({
          status: 'success',
          method: pay_type,  // 传递支付方式（クレジットカード 或 銀行振込）
          details: '銀行振込',
        });
      } else {
        setLocalError(new LocalError({ errorMessage: bankWebhookResult.error?.errorMessage}));
        doPaymentResult({
          status: 'failure',
          method: pay_type,
          details: bankWebhookResult.error?.errorMessage || "支払い失敗",
        });
      }
      dispatch(clearBankPaymentWebhookResult());
    }
  }, [bankWebhookResult]);

  // 组件内部方法，处理支付完成
  const handlePaymentCompletion = (result) => {
    //获得当前的支付完后的状态

    
  };
  
  

  const handleAddCard = async () => {
    setLocalError(null);
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


  const handlePayment = async () => {
    let paymentType = "";
    let paymentPayload = {};
    let  registerPayload = {};
      // 在发起支付之前先清空支付相关数据
      setLocalError(null);
      dispatch(clearRegisterPaymentData());
      dispatch(clearPaymentData());
      dispatch(clearCardPaymentWebhookResult());
      dispatch(clearBankPaymentWebhookResult());
      
    
    if (pay_type === "クレジットカード") {
      if (!selectedCard) {
        setLocalError(new LocalError({ errorMessage: 'クレジットカードを選択してください。'}));
        return false;
      }
      paymentType = "Card";
      registerPayload = {
        companyId,
        userId,
        pay_type: paymentType,
        amount: planDetails?.plan?.basePrice,
      };

      paymentPayload = {
        companyId,
        userId,
        orderId: null,  // 先占位，后续赋值
        accessId: null, // 先占位，后续赋值
        pay_type: paymentType,
        amount: planDetails?.plan?.basePrice,
        card: {
          customer_id: selectedCard.customer_id,
          card_id: selectedCard.id,
        },
      };
    } else if (pay_type === "銀行振込") {
      paymentType = "Virtualaccount";
      registerPayload = {
        companyId,
        userId,
        pay_type: paymentType,
        billing_amount: planDetails?.plan?.basePrice,
      };
      paymentPayload = {
        companyId,
        userId,
        orderId: null,  // 先占位，后续赋值
        accessId: null, // 先占位，后续赋值
        pay_type: paymentType,
        billing_amount: planDetails?.plan?.basePrice,
        paymentTermDay:10,
      };
    } else {
      setLocalError(new LocalError({ errorMessage: 'お支払い方法を選択してください。'}));
      return false;
    }
  
    try {
      // 先注册支付信息，获取 orderId 和 accessId 

  
      console.log("**** registerPayment payload:", registerPayload);
  
      const registerResponse = await dispatch(registerPayment(registerPayload)).unwrap();
  
      console.log("**** registerPayment response:", registerResponse);
  
      if (!registerResponse || !registerResponse.orderId || !registerResponse.accessId) {
        setLocalError(new LocalError({ errorMessage: '支払登録に失敗しました。'}));
        return false;
      }
  
      // 将获取到的 orderId 和 accessId 设置到支付请求参数
      paymentPayload.orderId = registerResponse.orderId;
      paymentPayload.accessId = registerResponse.accessId;
  
      console.log("**** paymentPayload:", paymentPayload);
  
      // 触发支付请求
      await dispatch(processPayment(paymentPayload)).unwrap();
  
      return true;  // 支付成功
    } catch (error) {
      ErrorHandler.doCatchedError(
        error,
        setLocalError,
        showBoundary,
        "popup",
        "throw",
        "SYSTEM_ERROR"
      );
      return false;  // 支付失败
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
    setPayType(method);
  
    // 清空相关支付信息，客户信息保持不变
    setLocalError(null);
    dispatch(clearCardsData());
    dispatch(clearRegisterPaymentData());
    dispatch(clearPaymentData());
    dispatch(clearCardPaymentWebhookResult());
    dispatch(clearBankPaymentWebhookResult());
    handleModalClose();
  
    if (method === "クレジットカード") {
      fetchCreditCards();
    }
  };

  const handleSelectCard = (card) => {
    setSelectedCard(card);
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
          {pay_type}
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
      {pay_type === "クレジットカード" && (
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





    {pay_type === "銀行振込" && (
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
});

export default Payment;
