// logoutHandler.js
import { logoutUser } from '../redux/auth/authSlice';
import { GlobalPopupError } from "../utils/GlobalPopupError";
import { setPopupError } from "../redux/popupError/popupError";

export const handleLogout = async (dispatch, setAnchorEl = null) => {
  try {
    // 调用 Redux 中的 logoutUser 异步操作
    dispatch(logoutUser());
  } catch (error) {
    if (error instanceof GlobalPopupError) {
      dispatch(setPopupError(error));
    } else {
      dispatch(setPopupError(new GlobalPopupError({ error, errorMessage: "未知エラーが発生しました。" })));
    }
  } finally {
    if (setAnchorEl) setAnchorEl(null); // 关闭菜单（可选）
  }
};
