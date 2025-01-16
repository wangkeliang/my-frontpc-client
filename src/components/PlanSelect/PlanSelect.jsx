import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { fetchPlanSelect } from '../../redux/planSelect/planSelectSlice';
import { useNavigate } from 'react-router-dom';
import { useErrorBoundary } from 'react-error-boundary'; // 错误边界处理
import ErrorHandler from '../../utils/ErrorHandler'; // 自定义错误处理
import { LocalError } from '../../utils/LocalError'; // 本地错误处理类
import PlanPurchase from '../PlanPurchase/PlanPurchase';

const PlanSelect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const [localError, setLocalError] = useState(null); // 本地错误状态
  const { plans = [], planSelectLoading } = useSelector((state) => ({
    plans: state.planSelect?.plans || [], // 确保 plans 始终为数组
    planSelectLoading: state.planSelect?.planSelectLoading || false, // 默认加载状态为 false
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocalError(null); // 重置本地错误
        await dispatch(fetchPlanSelect()).unwrap();
      } catch (error) {
        ErrorHandler.doCatchedError(
          error,
          setLocalError, // 本地错误处理
          showBoundary, // 错误边界处理
          'popup', // 全局弹窗处理方式
          'throw',
          'SYSTEM_ERROR' // 默认错误代码
        );
      }
    };

    fetchData();
  }, [dispatch]);

  // 点击“详细”按钮
  const handleDetailClick = (planCode) => {
    navigate(`/main/account/plan/select/detail/${planCode}`);
  };

  // 点击“购买”按钮
  const handlePurchaseClick = (planId) => {
    navigate(`/plan/purchase/${planId}`);
  };

  if (localError) {
    return (
      <Box
        sx={{
          minHeight: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 2,
        }}
      >
        {localError && (
          <Typography
            variant="body2"
            color="error"
            sx={{
              textAlign: 'center',
              lineHeight: '24px',
            }}
          >
            {localError.errorMessage}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 4,
        backgroundColor: '#f5f5f5', // 页面背景色
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px', // 最大宽度限制
        }}
      >
        {/* 标题部分 */}
        <Box sx={{ textAlign: 'left', mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: '20px',
              color: '#1a237e', // 深蓝色标题
              lineHeight: 1.6,
            }}
          >
            ご希望に応じたプランをお選びください。詳細をご確認いただき、ご購入手続きを進めてください。
          </Typography>
        </Box>

        {planSelectLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : plans.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: '16px',
                color: '#757575',
              }}
            >
              現在、選択可能なプランがありません。後ほど再度ご確認ください。
            </Typography>
          </Box>
        ) : (
            <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'flex-start',
            }}
            >
            {plans.map((plan) => (
                <Box
                key={plan.id}
                sx={{
                    width: '500px',
                    flex: '0 0 auto',
                    position: 'relative',
                }}
                >
                <Card
                    sx={{
                    border: '1px solid #ddd',
                    borderRadius: 3,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s',
                    height: '300px', // 固定卡片高度
                    display: 'flex',
                    flexDirection: 'column', // 确保内容垂直对齐
                    justifyContent: 'space-between', // 卡片内容和按钮保持间距
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    },
                    }}
                >
                    <CardContent
                    sx={{
                        flex: 1, // 内容部分填充剩余空间
                        display: 'flex',
                        flexDirection: 'column', // 内容竖直布局
                        justifyContent: 'space-between', // 确保内容在上下均匀分布
                    }}
                    >
                    <Box>
                        <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                        }}
                        >
                        {plan.isRecommended && (
                            <Box
                            sx={{
                                backgroundColor: '#ff9800',
                                color: '#fff',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                marginRight: '8px',
                            }}
                            >
                            お勧め
                            </Box>
                        )}
                        <Typography
                            variant="h6"
                            sx={{
                            fontWeight: 'bold',
                            color: '#1a237e',
                            }}
                        >
                            {plan.planName}
                        </Typography>
                        </Box>
                        <Box
                        sx={{
                            textAlign: 'left',
                            mb: 3,
                            lineHeight: 1.8,
                            fontSize: '14px',
                            color: '#616161',
                        }}
                        dangerouslySetInnerHTML={{ __html: plan.planDescription }}
                        />
                    </Box>
                    <Box>
                        <Typography
                        variant="h6"
                        sx={{
                            color: '#388e3c',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            mb: 1,
                        }}
                        >
                        価格: {plan.basePrice} {plan.currency}
                        </Typography>
                        <Typography
                        variant="body2"
                        sx={{
                            textAlign: 'center',
                            color: '#757575',
                        }}
                        >
                        契約期間: {plan.subscriptionPeriod} ヶ月
                        </Typography>
                    </Box>
                    </CardContent>
                    <Box
                    sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                    >
                    <Button
                        variant="outlined"
                        size="medium"
                        sx={{
                        borderColor: '#1a237e',
                        color: '#1a237e',
                        '&:hover': {
                            backgroundColor: '#e3f2fd',
                            borderColor: '#0d47a1',
                        },
                        }}
                        onClick={() => handleDetailClick(plan.planCode)}
                    >
                        詳細
                    </Button>
                    <PlanPurchase planCode={plan.planCode} companyId="a4250109165806kwzzxbfn3eng94np" />
                    {/* <Button
                        variant="contained"
                        size="medium"
                        sx={{
                        backgroundColor: '#1a237e',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#0d47a1',
                        },
                        }}
                        onClick={() => handlePurchaseClick(plan.id)}
                    >
                        購入
                    </Button> */}
                    </Box>
                </Card>
                </Box>
            ))}
            </Box>

        )}
      </Box>
    </Box>
  );
};

export default PlanSelect;
