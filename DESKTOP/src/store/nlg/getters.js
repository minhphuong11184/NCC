import state from "../base/state";

export const getKhoByAccount = () => user => {
    if (user.account == "17Q202") return "YS1";
    if (user.account == "17Q201") return "TB";
    if (user.account == "04T049") return "TH";
    if (user.account == "15Q060") return "YS1";
    if (user.account == "20Q3582") return "YS1";
    if (user.account == "15Q028") return "YS1";
    if (user.account == "20Q3585") return "YS1";
    if (user.account == "12T0106") return "TH";
    return null;
};
export const getDaiDienKho = () => maPhieu => {
    if (maPhieu.includes("TH")) return "Nguyễn Việt Hùng";
    if (maPhieu.includes("YS1")) return "Mai Hiển Sỹ";
    if (maPhieu.includes("TB","YS4")) return "Nguyễn Văn Chung";
    return "";
};
export const getAllKhos = () => {
    return ["YS1", "TB","YS4" , "TH"];
};
export const phieuNhapKhos = state => state.phieuNhapKhos;