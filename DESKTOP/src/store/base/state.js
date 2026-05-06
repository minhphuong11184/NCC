const defaultState = {
  userInfo: {},
  currentItemSelected: {},
  roleInfoById: {},
  currentMaterialSelected: {},
  isLogout: false,
  dsCongDoans: [],
  markets: [],
  departments: [],
  menus: [],
  getDefaultState: getDefaultState
};
export function getDefaultState() {
  return defaultState;
}
export default function() {
  return defaultState;
}
