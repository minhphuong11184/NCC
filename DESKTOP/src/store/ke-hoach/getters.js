export const tonPhois = state =>
    state.tonPhois.map(t => ({
        ...t,
        tonDauKy: t.tonDauKy - t.loiDauKy,
        tonDauKyM3: (t.tonDauKy - t.loiDauKy) * t.volumn,
        nhapM3: t.nhap * t.volumn,
        xuatM3: t.xuat * t.volumn,
        loiM3: t.loi * t.volumn,
        nhapquantityM3: t.nhapquantity * t.volumn,
        chuanhanM3: t.chuanhan * t.volumn,
        tonCuoiKyM3: t.tonCuoiKy * t.volumn
    }));