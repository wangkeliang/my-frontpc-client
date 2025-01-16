import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  breadcrumbMap: {}, // 存储路径和名称的映射
  sortedBreadcrumbs: [], // 存储排序后的导航项
};

const accountNavigateSlice = createSlice({
  name: 'accountNavigate',
  initialState,
  reducers: {
    // 添加或更新导航项，同时清理不相关的导航项
    addBreadcrumb: (state, action) => {
      const { path, name } = action.payload;

      // 添加或更新当前页面的导航
      state.breadcrumbMap[path] = name;

      // 自动清理不相关的导航项
      Object.keys(state.breadcrumbMap).forEach((key) => {
        if (!path.startsWith(key) && !key.startsWith(path)) {
          delete state.breadcrumbMap[key];
        }
      });

      // 重新生成排序后的导航项
      state.sortedBreadcrumbs = Object.entries(state.breadcrumbMap)
        .sort(([pathA], [pathB]) => pathA.length - pathB.length) // 按路径长度排序
        .map(([path, name]) => ({ path, name })); // 转换为数组格式
    },
  },
});

export const { addBreadcrumb } = accountNavigateSlice.actions;
export default accountNavigateSlice.reducer;
