import { types, feature } from "../../configs/constants";
import { isObjectEmpty } from "../../utils/utils";
export function isLogin(state) {}
export function myFactoryInfor(state) {
  if (!isObjectEmpty(state.userInfo.structure)) {
    return state.userInfo.structure["factory"];
  }
  return null;
}
export function myDepartmentInfor(state) {
  if (state.userInfo.structure["department"]) {
    return state.userInfo.structure["department"];
  } else if (state.userInfo.structure["qc"]) {
    return state.userInfo.structure["qc"];
  } else if (state.userInfo.structure["stock"]) {
    return state.userInfo.structure["stock"];
  } else {
    return state.userInfo.structure["factory"];
  }
}
export function myXuongInfor(state) {
  return state.userInfo.structure["xuong"];
}
export function myStepInfor(state) {
  return state.userInfo.structure["step"];
}
export function mySources(state) {
  const typeConstant = types.SOURCES;
  if (state.userInfo.id) {
    let sources = state.userInfo.role.types.find(type => {
      return type.id === typeConstant;
    }).value;
    return sources;
  }
  return [];
}
export function myDestinations(state) {
  const typeConstant = types.DESTINATIONS;
  if (state.userInfo.id) {
    let des = state.userInfo.role.types.find(type => {
      return type.id === typeConstant;
    }).value;
    return des;
  }
  return [];
}
export function myFeatures(state) {
  const typeConstant = types.FEATURES;
  if (state.userInfo.id) {
    let des = state.userInfo.role.types.find(type => {
      return type.id === typeConstant;
    }).value;
    let defaultFearture = [
      {
        id: 999999,
        code: "Home",
        name: "Màn hình chính",
        color: "secondary",
        icon: "home",
        active: true
      },
      {
        id: 999998,
        code: "ACCOUNT",
        name: "Tài khoản",
        icon: "people",
        color: "secondary",
        active: false
      },
      {
        id: 999997,
        code: "LOGOUT",
        name: "Đăng Xuất",
        icon: "power_settings_new",
        color: "secondary",
        active: false
      }
    ];
    return des.concat(defaultFearture);
  }
  return [];
}
export function myModules(state) {
  const typeConstant = types.MODULES;
  if (state.userInfo.id) {
    let des = state.userInfo.role.types.find(type => {
      return type.id === typeConstant;
    }).value;
    return des;
  }
  return [];
}

export const tonDauKys = state => {
  return state.tonDauKys;
};
export const lichsucapphoi = state => {
  return state.lichsucapphoi;
};
export const sanLuongs = state => s => {
  if (!s) return state.sanLuongs;
  return state.sanLuongs.filter(po =>
    [
      po.Item.code,
      po.Item.name,
      po.Item.length,
      po.Item.width,
      po.Item.height,
      po.number
    ]
      .join(" ")
      .toLowerCase()
      .includes(s.toLowerCase())
  );
};

export const lenhSanXuats = state => {
  return state.sanLuongs
    .map(sl => sl.number)
    .reduce((unique, item) => {
      return unique.includes(item) ? unique : [...unique, item];
    }, []);
};

export const getTonDauKysByDepartmentId = state => (departmentID, text) => {
  console.log("sjdfkjkd");
  if (departmentID) {
    const xyz = state.tonDauKys.filter(t => t.DEPARTMENT_ID === departmentID);
    if (text)
      return xyz.filter(t =>
        t.ITEM_NAME.toLowerCase().includes(text.toLowerCase())
      );
    return xyz;
  }
  return [];
};
export const pos = state => searchQuery => {
  if (searchQuery)
    return state.pos.filter(p =>
      [p.itemName.toLowerCase(), p.itemHeight, p.itemWidth, p.itemLength]
        .join("")
        .includes(searchQuery.toLowerCase())
    );
  return state.pos;
};
