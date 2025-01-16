import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow,CircularProgress } from '@mui/material';
import { fetchPlanHistoryDetail } from '../../redux/planHistory/planHistorySlice'; // 正确引入 Redux 异步方法
import { useErrorBoundary } from 'react-error-boundary'; // 错误边界处理
import ErrorHandler from '../../utils/ErrorHandler'; // 自定义错误处理
import { LocalError } from '../../utils/LocalError'; // 本地错误处理类
import { Button } from '@mui/material'; 
const PlanHistoryDetail = ({ planHistoryId }) => {
  const dispatch = useDispatch();
  const { showBoundary } = useErrorBoundary();
  const { selectedPlanHistory,isFetchingDetailLoading } = useSelector((state) => state.planHistory);
  const [localError, setLocalError] = useState(null); // 本地错误状态
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
        try {
            console.log('****planHistoryId=',planHistoryId);
            setLocalError(null); // 重置本地错误
            await dispatch(fetchPlanHistoryDetail(planHistoryId)).unwrap(); // 正确使用 fetchPlanHistoryDetail
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
　}, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 优先检查加载状态
  if (isFetchingDetailLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (localError) {
    return (
      <Box
        sx={{
            minHeight: 24, // 为错误信息预留固定高度
            display: 'flex', // 使用 flex 布局
            alignItems: 'center', // 垂直居中
            justifyContent: 'center', // 水平居中
            marginBottom: 2, // 与下方输入框保持距离
        }}
        >
        {localError && (
            <Typography 
            variant="body2" 
            color="error"
            sx={{
                textAlign: 'center', // 文本居中对齐
                lineHeight: '24px', // 确保文字垂直居中
            }}
            >
            {localError.errorMessage}
            </Typography>
        )}
    </Box>
    );
  }

  if (!selectedPlanHistory || !selectedPlanHistory.plan) {
    return <Typography variant="h6">プライの詳細データが見つかりません。</Typography>;
  }

  const { 
    planName, 
    planDescription, 
    prepaymentAmount, 
    basePrice, 
    subscriptionPeriod, 
    scheduledStartDate,
    scheduledEndDate,
    actualStartDate,
    actualEndDate,
    status,
    isRenewable,
    license 
  } = selectedPlanHistory.plan;

  return (
    <Box>
        {/* 添加按钮的区域 */}
        <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end', // 按钮右对齐
        alignItems: 'center',
        marginBottom: 2, // 与下方内容保持距离
        padding: '8px 16px', // 按钮区域内边距
      }}
    >
      {/* プランを継続按钮 */}
      <Button
        variant="outlined"
        sx={{
          textTransform: 'none', // 禁用大写
          fontWeight: 'bold', // 加粗文字
          fontSize: '0.875rem', // 字体大小
          color: '#0073e6', // 文字蓝色
          borderColor: '#0073e6', // 边框蓝色
          borderRadius: '20px', // 椭圆形
          padding: '4px 16px', // 高度较小，左右间距
          minWidth: 'auto', // 自适应宽度
          backgroundColor: '#ffffff', // 背景白色
          '&:hover': {
            backgroundColor: '#f5faff', // 悬停时背景淡蓝
          },
        }}
        onClick={() => console.log('プランを継続 clicked')}
      >
        現在のプランを継続購入する
      </Button>

      {/* 间距 */}
      <Box sx={{ width: '8px' }} />

      {/* プランを変更按钮 */}
      <Button
        variant="outlined"
        sx={{
          textTransform: 'none', // 禁用大写
          fontWeight: 'bold', // 加粗文字
          fontSize: '0.875rem', // 字体大小
          color: '#0073e6', // 文字蓝色
          borderColor: '#0073e6', // 边框蓝色
          borderRadius: '20px', // 椭圆形
          padding: '4px 16px', // 高度较小，左右间距
          minWidth: 'auto', // 自适应宽度
          backgroundColor: '#ffffff', // 背景白色
          '&:hover': {
            backgroundColor: '#f5faff', // 悬停时背景淡蓝
          },
        }}
        onClick={() => console.log('プランを変更 clicked')}
      >
        現在のプランを変更する
      </Button>
    </Box>

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
        {/* <Typography variant="h6" gutterBottom>
          プラン履歴情報
        </Typography> */}
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
              <TableCell>金額</TableCell>
              <TableCell>{prepaymentAmount} JPY</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>契約期間</TableCell>
              <TableCell>{subscriptionPeriod} ヶ月</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>予定開始日</TableCell>
              <TableCell>{new Date(scheduledStartDate).toLocaleDateString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>予定終了日</TableCell>
              <TableCell>{new Date(scheduledEndDate).toLocaleDateString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>実際開始日</TableCell>
              <TableCell>{actualStartDate ? new Date(actualStartDate).toLocaleDateString() : '未定'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>実際終了日</TableCell>
              <TableCell>{actualEndDate ? new Date(actualEndDate).toLocaleDateString() : '未定'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ステータス</TableCell>
              <TableCell>{status}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>自動更新可能</TableCell>
              <TableCell>{isRenewable ? 'はい' : 'いいえ'}</TableCell>
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
                      let scopeText = '';
                      let periodText = '';
                      let restrictionText = '';

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

                      restrictionText = `${scopeText}${periodText}${service.useLimit}${service.unit}`;
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

export default PlanHistoryDetail;
