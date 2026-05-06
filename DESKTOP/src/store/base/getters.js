import { isObjectEmpty } from "../../ultils";
export function isLogin(state) {
  if (!isObjectEmpty(state.userInfo)) {
    return true;
  }
  return false;
}
export function myMenu(state) {
  const roleMenu = state.userInfo.role.types.find(t => {
    return t.id === 100006;
  });
  let myMenu = roleMenu.value;
  for (let i = 0; i < myMenu.length; i++) {
    const element = myMenu[i];
    if (
      myMenu.filter(m => {
        return m.parentId === element.id;
      }).length > 0
    ) {
      myMenu[i].hashChild = true;
    } else {
      myMenu[i].hashChild = false;
    }
  }
  return myMenu;
}
export function customeMenu() {
  return [];
}
export function myFactoryInfor(state) {
  if (!isObjectEmpty(state.userInfo.structure)) {
    return state.userInfo.structure["nhaMay"];
  }
  return null;
}
export function myKhoCBG(state) {
  const sources = state.userInfo.role.types.find(type => {
    return type.id === 100001;
  }).value;
  const dskho = sources.filter(s => {
    return s.type2 === "stock2";
  });
  return dskho;
}
export function mySources(state) {
  if (state.userInfo.id) {
    const sources = state.userInfo.role.types.find(type => {
      return type.id === 100001;
    }).value;
    return sources;
  }
  return [];
}
export const congDoans = state => factoryId => {
  if (state.userInfo.id) {
    const sources = state.userInfo.role.types.find(type => {
      return type.id === 100001;
    }).value;
    return sources.filter(
      s => s.type2 === "to" && s.factoryId === factoryId
    );
  }
  return [];
};
export const opCongDoans = state => factoryId => {
  if (state.userInfo.id) {
    const sources = state.userInfo.role.types.find(type => {
      return type.id === 100001;
    }).value;
    return sources
      .filter(
        s =>
          (s.type2 === "department" || s.type2 === "stock") &&
          s.factoryId === factoryId
      )
      .map(o => ({
        label: o.name,
        value: o.id,
        description: `[${o.code}] ${o.name}`,
        icon: "mail"
      }));
  }
  return [];
};
export function userInfo(state) {
  return state.userInfo;
}
export function menu() {
  return [];
}
export function dsCongDoans(state) {
  return state.dsCongDoans;
}
export function markets(state) {
  return state.markets;
}

export const departments = state => state.departments;

export const menus = state => menuType => {
  return state.menus
    .filter(m => m.type === menuType)
    .map(m => ({ ...m, parentId: m.parentId ? m.parentId : 0 }));
};

export const getDepartmentsByType2 = state => type2 => {
  return state.departments.filter(d => d.TYPE2 == type2);
};
