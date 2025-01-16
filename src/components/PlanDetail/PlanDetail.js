import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { fetchPlanDetail } from '../../redux/planDetail/planDetailSlice'; // 引入 Redux 异步方法
import { useErrorBoundary } from 'react-error-boundary'; // 错误边界处理
import ErrorHandler from '../../utils/ErrorHandler'; // 自定义错误处理
import { LocalError } from '../../utils/LocalError'; // 本地错误处理类
import { useParams  } from 'react-router-dom';
const PlanDetail = () => {
  const dispatch = useDispatch();
  const { showBoundary } = useErrorBoundary();
  const { planDetail, isLoading } = useSelector((state) => state.planDetail || {}); // 确保 plan 存在
  const { companyId} = useSelector((state) => state.auth || {}); 
  const [localError, setLocalError] = useState(null); // 本地错误状态
  const [activeTab, setActiveTab] = useState(0);
  const { planCode } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('***planCode=',planCode);
        setLocalError(null); // 重置本地错误
        await dispatch(fetchPlanDetail({ planCode, companyId })).unwrap();
      } catch (error) {
        ErrorHandler.doCatchedError(
          error,
          setLocalError, // 本地错误处理
          showBoundary, // 错误边界处理
          'popup', // 全局弹窗处理方式
          'toast', // Toast 方式
          'SYSTEM_ERROR' // 默认错误代码
        );
      }
    };

    fetchData();
  }, [dispatch, planCode, companyId, showBoundary]);

 
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return <Typography variant="h6">読み込み中...</Typography>;
  }

  if (localError) {
    return (
      <Box>
        <Typography variant="body2" color="error" textAlign="center">
          {localError.errorMessage}
        </Typography>
      </Box>
    );
  }

  if (!planDetail || !planDetail.plan) {
    return <Typography variant="h6">データが見つかりません。</Typography>;
  }

  const { planName, planDescription, prepaymentAmount, basePrice, subscriptionPeriod, license } = planDetail.plan;

  return (
    <Box>
      {/* Plan Overview Section */}
      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          background: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6" gutterBottom>
          プラン情報
        </Typography>
        <Table
          sx={{
            '& th, & td': {
              fontSize: '0.9rem',
              padding: '8px',
              border: '1px solid #ddd',
            },
            '& td': {
              backgroundColor: '#f9f9f9',
            },
          }}
        >
          <TableBody>
            <TableRow>
              <TableCell>プラン名</TableCell>
              <TableCell>{planName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>説明</TableCell>
              <TableCell>{planDescription}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>事前支払金額</TableCell>
              <TableCell>{prepaymentAmount} JPY</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>基本価格</TableCell>
              <TableCell>{basePrice} JPY</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>契約期間</TableCell>
              <TableCell>{subscriptionPeriod} ヶ月</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* Functions and Services Section */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6" gutterBottom>
          機能情報
        </Typography>

        {license?.functions?.length > 0 ? (
          <>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                mb: 3,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 'bold',
                },
              }}
            >
              {license.functions.map((func, index) => (
                <Tab key={func.id} label={func.functionName} />
              ))}
            </Tabs>

            {license.functions.map((func, index) => (
              <Box
                key={func.id}
                sx={{ display: activeTab === index ? 'block' : 'none', mt: 2 }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  {func.functionDescription}
                </Typography>

                <Table
                    sx={{
                        '& th': {
                        backgroundColor: '#e3f2fd',
                        color: '#0d47a1',
                        fontWeight: 'bold',
                        textAlign: 'left',
                        fontSize: '0.9rem',
                        padding: '10px',
                        },
                        '& td': {
                        backgroundColor: '#f9f9f9',
                        fontSize: '0.85rem',
                        padding: '10px',
                        },
                        border: '1px solid #ddd',
                    }}
                    >
                    <TableHead>
                        <TableRow>
                        <TableCell>サービス内容</TableCell>
                        <TableCell>制限</TableCell>
                        <TableCell>超過料金</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {func.services.map((service) => {
                        // 处理制限字段
                        let scopeText = '';
                        let periodText = '';
                        let restrictionText = '';

                        // 根据 statisticScope 确定显示的范围
                        switch (service.statisticScope) {
                            case 'company':
                            scopeText = '全社';
                            break;
                            case 'candidate':
                            scopeText = '一人候補者';
                            break;
                            case 'case':
                            scopeText = '毎ケース';
                            break;
                            case 'user':
                            scopeText = '一人ユーザー';
                            break;
                            default:
                            scopeText = '';
                        }

                        // 根据 statisticPeriod 确定显示的周期
                        switch (service.statisticPeriod) {
                            case 'month':
                            periodText = '毎月';
                            break;
                            case 'day':
                            periodText = '毎日';
                            break;
                            default:
                            periodText = '';
                        }

                        // 将以上信息与 useLimit 和 unit 组合成完整字符串
                        restrictionText = `${scopeText}${periodText}${service.useLimit}${service.unit}`;

                        // 处理超過料金字段
                        const overUsageChargeText = `${service.overUsageChargeAmount} ${service.currencyType} / ${service.unit}`;

                        return (
                            <TableRow key={service.id}>
                            <TableCell>{service.serviceContent}</TableCell>
                            <TableCell>{restrictionText}</TableCell>
                            <TableCell>{overUsageChargeText}</TableCell>
                            </TableRow>
                        );
                        })}
                    </TableBody>
                    </Table>

              </Box>
            ))}
          </>
        ) : (
          <Typography variant="body2">利用可能な機能がありません。</Typography>
        )}
      </Box>
    </Box>
  );
};

export default PlanDetail;
