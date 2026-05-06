const types = {
    SOURCES: 100001,
    DESTINATIONS: 100002,
    FEATURES: 100003,
    MODULES: 100004,
    SCREEN: 100005
}
const modules = {
    PRODUCTION: 100001,
    FUNITURE: 100003,
    WOOD: 100004
}
const feature = {
    CONFIRM_PALLET: 100003,
    CREATE_PALLET: 100012,
    ALL_STOCK: 100014,
    XEP_SAY: 100000,
    CREATE_PALLET_LP: 100002,
    CREATE_PALLET_SC: 100042,
    XNT: 100014,
    KHO_LP: 100010,
    VAO_LO: 100013,
    CONFIRM_BATCH: 100015,
    CREATE_PLAN_BATCH: 100016,
    QC: 100005,
    RECIVE_PALLET: 100018,
    LOSAY: 100001,
    XUAT_PALLET: 100019,
    DONG_GOI: 100004,
    GOOD_ISSUE: 100029,
    ACCEPTS: 100031,
    CONFIRM_GI: 100030,
    QC_CONFIRM_GI: 100032,
    XUONG_CONFIRM_GI: 100033,
    XUAT_THANH_PHAM: 100034,
    BB_CHECK_LO_SAY: 100035,
    KHAI_BAO_CN: 100050,
    HOME: 999999,
    ACCOUNT: 999998,
    LOGOUT: 999997,
    WOOD_IN_STOCK: 100049,
    DCOC: 100037,
    WOOD_INSPECTION: 100043,
    WOOD_PRICE_LIST: 100044,
    WOOD_BB_TT: 100045,
    WOOD_APPROVAL_PRICE: 100047,
    WOOD_SETTING: 100046,
    WOOD_REPORT: 100048,
    WOOD_CREATE_PALLET: 100052,
    WOOD_XUAT_KHO: 100053,
    WOOD_XUAT_KHO_VAN_THO: 100054

}
const screens = [{
        ID: feature.HOME,
        SCREEN_PATCH: '',
        SCREEN_NAME: 'Home',
        SCREEN_TITLE: 'Home',
        PARAMS_KEY: ''
    },
    {
        ID: feature.LOGOUT,
        SCREEN_PATCH: '/',
        SCREEN_NAME: 'Đăng xuất',
        SCREEN_TITLE: 'Đăng xuất',
        PARAMS_KEY: ''
    },
    {
        ID: feature.ACCOUNT,
        SCREEN_PATCH: '/profile',
        SCREEN_NAME: 'Thông tin cá nhân',
        SCREEN_TITLE: 'Thông tin cá nhân',
        PARAMS_KEY: ''
    },
    /// nhập kho nghiệm thu gỗ, ván
    {
        ID: feature.WOOD_IN_STOCK,
        SCREEN_PATCH: '/wood-list-receipt',
        SCREEN_NAME: '',
        SCREEN_TITLE: '',
        PARAMS_KEY: ''
    },
    {
        ID: feature.WOOD_INSPECTION,
        SCREEN_PATCH: '/wood-list-receipt',
        SCREEN_NAME: '',
        SCREEN_TITLE: '',
        PARAMS_KEY: ''
    },
    {
        ID: feature.WOOD_BB_TT,
        SCREEN_PATCH: '/wood-list-pay',
        SCREEN_NAME: 'Danh sách biên bản tính tiền',
        SCREEN_TITLE: 'Danh sách biên bản tính tiền',
        PARAMS_KEY: ''
    },
    {
        ID: feature.WOOD_PRICE_LIST,
        SCREEN_PATCH: '/wood-price-list',
        SCREEN_NAME: 'Bảng giá',
        SCREEN_TITLE: 'Bảng giá',
        PARAMS_KEY: ''
    },
    {
        ID: feature.WOOD_APPROVAL_PRICE,
        SCREEN_PATCH: '/wood-price-approval',
        SCREEN_NAME: 'Phê duyệt bảng giá',
        SCREEN_TITLE: 'Phê duyệt bảng giá',
        PARAMS_KEY: ''
    },
    {
        ID: feature.WOOD_SETTING,
        SCREEN_PATCH: '/wood-setting-home',
        SCREEN_NAME: 'Phê duyệt bảng giá',
        SCREEN_TITLE: 'Phê duyệt bảng giá',
        PARAMS_KEY: ''
    },
    {
        ID: feature.WOOD_REPORT,
        SCREEN_PATCH: '/wood-reports',
        SCREEN_NAME: 'Báo cáo tổng hợp',
        SCREEN_TITLE: 'Báo cáo tổng hợp',
        PARAMS_KEY: '',
        CHILD: [{
                name: 'Theo dõi nhập gỗ',
                patch: '/wood-theo-doi-nhap-van'
            },
            {
                name: 'Ngày',
                patch: '/wood-report-nhap-van-ngay'
            }
        ]
    },
    ///// prod
    {
        ID: feature.XEP_SAY,
        SCREEN_PATCH: '/production-xep-say',
        SCREEN_NAME: 'Xếp sấy',
        SCREEN_TITLE: 'Xếp sấy',
        PARAMS_KEY: ''
    },
    {
        ID: feature.VAO_LO,
        SCREEN_PATCH: '/production-batchs',
        SCREEN_NAME: 'Vào lò',
        SCREEN_TITLE: 'Vào lò',
        PARAMS_KEY: ''
    },
    {
        ID: feature.CONFIRM_BATCH,
        SCREEN_PATCH: '/production-batchs',
        SCREEN_NAME: 'Xác nhận mẻ sấy',
        SCREEN_TITLE: '',
        PARAMS_KEY: ''
    },
    {
        ID: feature.CREATE_PLAN_BATCH,
        SCREEN_PATCH: '/production-batchs',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Tạo kế hoạch sấy',
        PARAMS_KEY: ''
    },
    {
        ID: feature.LOSAY,
        SCREEN_PATCH: '/production-batchs',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Chủ lò',
        PARAMS_KEY: ''
    },
    {
        ID: feature.BB_CHECK_LO_SAY,
        SCREEN_PATCH: '/production-batchs',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Cơ điện check lò sấy',
        PARAMS_KEY: ''
    },
    {
        ID: feature.CREATE_PALLET,
        SCREEN_PATCH: '/production-create-pallet',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Tạo pallet',
        PARAMS_KEY: ''
    },
    {
        ID: feature.CREATE_PALLET_LP,
        SCREEN_PATCH: '/production-create-pallet',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Tạo pallet Lựa phôi',
        PARAMS_KEY: ''
    },
    {
        ID: feature.CREATE_PALLET_SC,
        SCREEN_PATCH: '/production-create-pallet',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Tạo pallet Sơ chế',
        PARAMS_KEY: ''
    },
    {
        ID: feature.RECIVE_PALLET,
        SCREEN_PATCH: '/production-wait-recived',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Nhận pallet',
        PARAMS_KEY: ''
    },
    {
        ID: feature.KHO_LP,
        SCREEN_PATCH: '/production-pallet-inline',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Tồn kho theo pallet',
        PARAMS_KEY: ''
    },
    {
        ID: feature.QC,
        SCREEN_PATCH: '/production-qc-inspection',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Xử lý sản phẩm lỗi',
        PARAMS_KEY: ''
    },
    {
        ID: feature.XUAT_PALLET,
        SCREEN_PATCH: '/production-stockout-pallet',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Xuất pallet',
        PARAMS_KEY: ''
    },
    {
        ID: feature.DONG_GOI,
        SCREEN_PATCH: '/production-packing',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Đóng gói',
        PARAMS_KEY: ''
    },
    {
        ID: feature.XUAT_THANH_PHAM,
        SCREEN_PATCH: '/production-export-finish-good',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Xuất thành phẩm',
        PARAMS_KEY: ''
    },
    {
        ID: feature.DCOC,
        SCREEN_PATCH: '/production-coc',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Thông tin truy nguyên',
        PARAMS_KEY: ''
    },
    {
        ID: feature.WOOD_CREATE_PALLET,
        SCREEN_PATCH: '/wood-create-pallet',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Tạo pallet ván',
        PARAMS_KEY: ''
    },
    {
        ID: feature.KHAI_BAO_CN,
        SCREEN_PATCH: '/production-workers',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Khai báo nhân công',
        PARAMS_KEY: ''
    },
    {
        ID: feature.WOOD_XUAT_KHO,
        SCREEN_PATCH: '/wood-create-pallet2',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Xuất kho',
        PARAMS_KEY: ''
    },
    {
        ID: feature.WOOD_XUAT_KHO_VAN_THO,
        SCREEN_PATCH: '/wood-out-stock-location',
        SCREEN_NAME: '',
        SCREEN_TITLE: 'Xuất kho ván thô',
        PARAMS_KEY: ''
    },

]
const bienban = {
    BB_KIEM_TRA_DO_AM_LO_SAY: 'bieu-mau-kiem-tra-do-am',
    BB_KHAO_SAT_KHUYET_TAT_LO_SAY: 'bao-cao-khuyet-tat',
    BB_KIEM_TRA_LO_SAY: 'bien-ban-kiem-tra-lo-say'
}
export { types, modules, feature, bienban, screens }