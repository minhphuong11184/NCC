export function lenhSanXuats(state) {
    return state.lenhSanXuats.map((lenhSanXuat, id) => ({...lenhSanXuat, id }));
}
export function keHoachSanXuats(state) {
    return state.keHoachSanXuats;
}
export function soLenhSanXuats(state) {
    return state.soLenhSanXuats;
}
export const soLenhSanXuatCons = state => goodsType => {
   
        return state.soLenhSanXuatCons.filter(s => s.number.slice(0, 2) == "TH").length > 0 ? state.soLenhSanXuatCons.filter(s => s.number.slice(0, 2) == "TH" || s.number.slice(0, 2) == "NH"): state.soLenhSanXuatCons.filter(s => s.number.slice(0, 2) == "YS" || s.number.slice(0, 2) == "TB" || s.number.slice(0, 2) == "QM" );

    return state.soLenhSanXuatCons;
};

export const getKeHoachDongGois = state => market => {
    return state.keHoachSanXuats.filter(
        kh => kh.conThucHien > 0 && kh.market == market
    );
};

export const soLenhs = state => goodsType => [
    ...new Set(
        state.keHoachSanXuats.filter(k => k.approvedAt === null).map(k => k.number)
    )
];

export const getPheDuyets = state => lsxs => {
    if (lsxs.length > 0)
        return state.keHoachSanXuats.filter(k => lsxs.includes(k.number));
    return [];
};

export const keHoachDongGois = state => lsxs => {
    if (lsxs.length > 0)
        return state.keHoachDongGois.filter(k => lsxs.includes(k.number));
    return state.keHoachDongGois;
};

export const lenhSXDongGois = state => {
    let lsxs = state.keHoachDongGois.map(k => k.number);
    const set = new Set([...lsxs]);
    return [...set];
};