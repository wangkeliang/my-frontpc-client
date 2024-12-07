import React, { useEffect } from 'react';
import Header from '../Header/Header';
import ContentArea from '../ContentArea/ContentArea';
import LoginFooterCmp from '../LoginFooterCmp/LoginFooterCmp';
import Footer from '../Footer/Footer';
import InitialSetupModal from '../InitialSetupModal/InitialSetupModal';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo} from '../../redux/user/userSlice';
import { fetchUserPermissions, setRefreshPermissionFlag } from '../../redux/permission/permissionSlice';
import { fetchInitialSetupData } from '../../redux/initialSetupSlice/initialSetupSlice';
import { GlobalPopupError } from "../../utils/GlobalPopupError"; // 引入 GlobalPopupError 类
import { useErrorBoundary } from "react-error-boundary"; // 错误边界
import { setPopupError } from "../../redux/popupError/popupError"; // 引入 Popup 错误处理
// import { showGlobalLoading, hideGlobalLoading } from '../../redux/loading/loadingSlice.js'; // 引入 loading actions
// import GlobalLoading from '../Common/GlobalLoading/GlobalLoading'; // 引入 GlobalLoading


const MainLayout = () => {
  const { userId, webSocketSuccess } = useSelector((state) => state.auth);
  const { refreshPermissionFlag } = useSelector((state) => state.permissions);
  const { showModal } = useSelector((state) => state.initialSetup);
  const { showBoundary } = useErrorBoundary();
  // const isGlobalLoading = useSelector((state) => state.loading.isGlobalLoading); // 假设全局 loading 状态
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeData = async () => {
      if (userId && webSocketSuccess) {
        try {
          console.log('Fetching initialization data...');
          // dispatch(showGlobalLoading()); // 显示全局加载状态
          // await new Promise((resolve) => setTimeout(resolve, 2000)); // 模拟 API 请求
          await dispatch(fetchUserInfo(userId)).unwrap();
          await dispatch(fetchInitialSetupData({ userId })).unwrap();          
          await dispatch(fetchUserPermissions()).unwrap();

        } catch (error) {
          if (error instanceof GlobalPopupError) {            
            dispatch(setPopupError(error));
          } else {
            showBoundary(new GlobalPopupError({ error, errorMessage: "未知エラーが発生しました。" }));
          }
        } 
      }
    };

    initializeData();
  }, [userId, webSocketSuccess]);
  // 根据全局加载状态渲染
  // if (isGlobalLoading||!userId) {
  //   return <GlobalLoading />;
  // }
  if (!userId){
    return null;
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden', // 避免整个页面滚动
      }}
    >
      {/* Header 部分 - 固定在页面顶部 */}
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1100,
          backgroundColor: 'background.default',
          boxShadow: 1,
        }}
      >
        <Header />
      </Box>

      {/* 内容区域 - 可滚动 */}
      <Box
        component="main"
        sx={{
          flex: 1,
          marginTop: '64px', // 确保内容从 Header 下方开始（Header 的高度）
          overflowY: 'auto', // 只允许内容区域垂直滚动         
          backgroundColor: 'background.paper',
 
        }}
      >
        <ContentArea />
      </Box>

      {/* Footer 部分 */}
      <Box
        component="footer"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'background.default',
          boxShadow: 1,
          textAlign: 'center',
          zIndex: 1100,
        }}
      >
        {/* <LoginFooterCmp /> */}
        <Footer/> 
      </Box>

      {/* 初始化设置模态窗口 */}
      {showModal && <InitialSetupModal />}

      {/* 全局加载状态 */}
      {/* {isGlobalLoading && <GlobalLoading />} 根据全局状态是否加载 */}
    </Box>
  );
};

export default MainLayout;
