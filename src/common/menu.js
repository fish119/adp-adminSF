import { isUrl } from '../utils/utils';

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
      hideInMenu: item.onlySa || item.hideInMenu,
    };
    if (item.children && item.children.length > 0) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = menuData => formatter(menuData);
