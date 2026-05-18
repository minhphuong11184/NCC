export const adminRoutes = [
  {
    path: "",
    component: () => import("pages/Index.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/auth",
    component: () => import("pages/Auth.vue")
  },
  {
    path: "/access-denied",
    component: () => import("pages/AccessDenied.vue")
  },
  {
    path: "/master-data-department",
    component: () => import("pages/MasterData/Departments.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/master-role-department",
    component: () => import("pages/MasterData/RoleDepartment.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/wms-masters-users",
    component: () => import("pages/Administrator/Users.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/account-detail",
    component: () => import("pages/Administrator/AccountDetail.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/quan-ly-menu",
    component: () => import("pages/Administrator/PageMenus.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/quan-ly-menu-mobile",
    component: () => import("pages/Administrator/PageMenuMobile.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/wms-accounts",
    component: () => import("pages/Administrator/taikhoan.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/bb-nghiem-thu-go-keo-tron",
    component: () => import("pages/BBnghiemthugokeotron.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/import-go-tron",
    component: () => import("pages/ImportGoTron.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/phieu-nk-go-tron",
    component: () => import("pages/PhieuNKGoTron.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/phan-tich-go-tron",
    component: () => import("pages/PhanTichGoTron.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/import-kh",
    component: () => import("pages/ImportKH.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/chia-xe-go-tron",
    component: () => import("pages/ChiaXeGoTron.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/phieu-can-hang",
    component: () => import("pages/PhieuCanHang.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/bk-thu-mua-moi",
    component: () => import("pages/BKThuMuaMoi.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/bang-ke-lam-san",
    component: () => import("pages/BangKeLamSan.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/quan-ly-nguoi-dung",
    redirect: "/wms-masters-users"
  },
  {
    path: "/xuong-xe",
    component: () => import("pages/QuanLyXuongXe.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/ca-lam-viec",
    component: () => import("pages/CaLamViec.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/cham-cong",
    component: () => import("pages/ChamCong/PageChamCong.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/bang-cong",
    component: () => import("pages/ChamCong/PageBangCong.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/hop-dong-mau",
    component: () => import("pages/HopDongMau.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/phuong-an-khai-thac",
    component: () => import("pages/PhuongAnKhaiThac.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/danh-sach-kh",
    component: () => import("pages/DanhSachKH.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/chia-xe-ngay",
    component: () => import("pages/ChiaXeNgay.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/bieu-mau-dg",
    component: () => import("pages/BieuMauDG.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/ghep-lo-go",
    component: () => import("pages/GhepLoGo.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/phieu-go-xe",
    component: () => import("pages/PhieuGoXe.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/import-pnk-woodsland",
    component: () => import("pages/ImportPNKWoodsland.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/bang-cong-ca",
    component: () => import("pages/ChamCong/PageBangCongCa.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/bao-cao-nhap-xuat-ton",
    component: () => import("pages/BaoCaoNhapXuatTon.vue"),
    meta: { requiresAuth: true }
  }
];
