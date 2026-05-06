import state from "../base/state";

export const getKhoByAccount = () => user => {
    if (user.account == "17Q202") return "YS1";
    if (user.account == "17Q201") return "YS4";
    if (user.account == "04T049") return "TH";
    if (user.account == "15Q060") return "YS1";
    if (user.account == "15Q028") return "YS4";
    if (user.account == "12T0106") return "TH";
    return null;
};
export const getDaiDienKho = () => maPhieu => {
    if (maPhieu.includes("TH")) return "Nguyên Văn Kiểm";
    if (maPhieu.includes("YS1")) return "Nguyễn Thanh Xuân";
    if (maPhieu.includes("YS4")) return "Nguyễn Văn Chung";
    return "";
};
export const getAllKhos = () => {
    return ["YS1", "YS4", "TH"];
};
export const phieuNhapKhos = state => state.phieuNhapKhos;