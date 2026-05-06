const apiVersion = "v2";
const apiVersion3 = "v3";
const BASE_URL = "http://localhost:2003" + "/api/" + apiVersion;
const BASE_URLV3 = "http://localhost:2003" + "/api/" + apiVersion3;
const apiConfig = {
    CHECK_TOKEN: BASE_URL + "/",
    ACCOUNT_FORMS: BASE_URLV3 + "/account-forms/",
    AUTHENTICATION: BASE_URLV3 + "/login",
    PALLETS_IN_LINE: BASE_URL + "/reports/step/",
    DETAIL_PALLET: BASE_URL + "/ballets/",
    GET_ALL_ITEMS: BASE_URL + "/items",
    GET_PACKAGE_TYPE: BASE_URL + "/package-type",
    POST_CREATE_PALLET: BASE_URL + "/ballets",
    GET_ONLY_WOODS_ITEMS: BASE_URL + "/woods",
    GET_SUPPILES: BASE_URL + "/chemistrys",
    GET_PROVIDERS: BASE_URL + "/vendors",
    GET_PARCELS: BASE_URL + "/parcels",
    POST_ADD_SUPPLIES_TO_PL: BASE_URL + "/ballets", ///ballets/19400321/supplies
    GET_PALLET_WAIT_RECIVE: BASE_URL + "/reports/step/", ///reports/step/100107/in-not-verify
    POST_RECIVED_PALLET: BASE_URL + "/packages/", //packages/{{package_id}}/verify
    POST_STEP_PALLET: BASE_URL + "/ballets/", //ballets/19370023/step
    GET_RANGES_BATCH: BASE_URL + "/ranges",
    POST_CREATE_BATCH: BASE_URL + "/kilns/",
    GET_TON_QC: BASE_URL + "/reports/inventory-qc",
    GET_SOLUTIONS_QC: BASE_URL + "/remedies", // giải pháp qc
    POST_CREATE_PACKAGE: BASE_URL + "/packages", // TẠO PACKAGE CHO QC
    POST_QC_CONFIRM_BATCH: BASE_URL + "/kiln-batch/", ///kiln-batch/{{kiln_batch_id}}/verify
    POST_VAO_LO: BASE_URL + "/ballets/",
    POST_RA_LO: BASE_URL + "/kiln-batch/",
    GET_DES_BY_ITEM: BASE_URL + "/items/", //items/110024/routing?token={{token}}
    PUT_CHANGE_PASS: BASE_URL + "/password",
    IKEA_SEARCH: BASE_URL + "/reports/ikea-code/", ///{{ikea_code}}/decode?token={{token}}
    CANCEL_IKEA: BASE_URL + "/ballets/", // ikea
    GET_PROD_ORDERS: BASE_URL + "/production-orders",
    GET_WOOD_TYPES: BASE_URL + "/wood-types",
    POST_CREATE_BB_MC: BASE_URL + "/bien-ban",
    GET_BB_MC_BY_BATCHID: BASE_URL + "/kiln-batch/",
    POST_CREATE_BB_KT: BASE_URL + "/bien-ban",
    GET_BB_KT_BY_BATCHID: BASE_URL + "/kiln-batch/",
    GET_QC_HISTORY_BY_STEP_ID: BASE_URL + "/reports/step/",
    PUT_STATUS_BATCH: BASE_URL + "/kiln-batch/",
    CREATE_COC_DONG_GOI: BASE_URL + "/coc",
    GET_PRODUCTS: BASE_URL + "/products",
    GET_BATCHS: BASE_URL + "/kiln-batch",
    GET_KILNS: BASE_URL + "/kilns",
    GET_RATE_PLAN: BASE_URL + "/bao-cao-raw-data/week2",
    GET_SAN_LUONG: BASE_URL + "/san-luong",
    LICH_SU_CONFIRM: BASE_URL + "/packages/lich-su",
    PO: BASE_URL + "/production-order",
    TON_DAU_KY: BASE_URL + "/ton-dau-ky",
    MARKET: BASE_URL + "/markets",

    //Nội thất
    GET_PROJECTS: BASE_URL + "/projects",
    FUNITURE_GET_ITEM_FROM_PROJECTID: BASE_URL + "/projects/", //PRODUCTS
    FUNITURE_GET_ACCEPTS: BASE_URL + "/accepts",
    FUNITURE_POST_CREATE_ACCEPT: BASE_URL + "/accepts",
    FUNITURE_GET_DETAIL_ACCEPT: BASE_URL + "/accepts/", ///accepts/100002/products?token={{token}}
    FUNITURE_POST_ADD_DATA_TO_ACCEPT: BASE_URL + "/accept-products",
    FUNITURE_POST_CREATE_GOOD_ISSUE: BASE_URL + "/goods-issues",
    FUNITURE_GET_GOODS_ISSUE: BASE_URL + "/goods-issues",
    FUNITURE_GET_PRODUCT_IN_GISSUE: BASE_URL + "/goods-issues/",
    FUNITURE_POST_ADD_ITEM_TO_GI: BASE_URL + "/goods-issue-products",
    FUNITURE_POST_WH_CONFIRM_GI: BASE_URL + "/goods-issues/",

    // Nguyen lieu go, van
    WOOD_GET_RECEIPTS: BASE_URL + "/wood-warehouse",
    WOOD_GET_VENDORS: BASE_URL + "/vendors",
    WOOD_CREATE_WH_RECEIPT: BASE_URL + "/wood-warehouse",
    WOOD_GET_RECEIPT_BY_ID: BASE_URL + "/wood-warehouse/",
    WOOD_GET_INPUT_TYPE: BASE_URL + "/wood-input-type",
    WOOD_TYPE: BASE_URL + "/wood-type",
    GET_ITEM: BASE_URL + "/items",
    CREATE_DETAIL_WH: BASE_URL + "/wood-input",
    GET_RECEIPT_DETAIL_DLT: BASE_URL + "/wood-input/",
    GET_INSPECTION_BY_RID: BASE_URL + "/wood-inspection/",
    CREATE_INSPECTION: BASE_URL + "/wood-inspection",
    GET_DLT_BY_RECEIPT_ID: BASE_URL + "/wood-input",
    WOOD_UPDATE_WH_RECEIPT: BASE_URL + "/wood-warehouse/",
    GET_LIST_PAYMENT: BASE_URL + "/wood-payment",
    GET_PAYMENT_DETAIL: BASE_URL + "/wood-payment/",
    GET_PRICE_RAW_DATA: BASE_URL + "/wood-price",
    GET_DTYPE: BASE_URL + "/wood-dtype",
    CREATE_REQ_PRICE: BASE_URL + "/wood-req-price",
    GET_REQUEST_PRICE: BASE_URL + "/wood-req-price",
    GET_PRICE_BY_REQ_ID: BASE_URL + "/wood-req-price/",
    APPROVAL_PRICE: BASE_URL + "/wood-req-price",
    POST_COMPLETED_PAYMENT: BASE_URL + "/wood-payment/",
    GET_REGION: BASE_URL + "/wood-region",
    POST_REGION: BASE_URL + "/wood-region",
    POST_VENDOR: BASE_URL + "/vendors",
    UPDATE_VENDOR: BASE_URL + "/vendors/",
    GET_WORKERS: BASE_URL + "/work-time",
    GET_LIST_INSP_BY_RDLT_ID: BASE_URL + "/wood-inspection/",
    P_POS: BASE_URL + "/khsx",
    ATTENDANCE_LOG: BASE_URL + "/attendance-log",
    ATTENDANCE_SYNC: BASE_URL + "/attendance-log/sync",
    ATTENDANCE_MACHINE: BASE_URL + "/attendance-machine"
};
export default apiConfig;