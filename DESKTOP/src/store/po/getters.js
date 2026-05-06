export function pos(state) {
  return state.pos.map(po => ({
    ...po,
    quantity:
      po.keHoach - po.ys1a - po.ys1b - po.tb - po.soLuongUuTien + po.hanMucTon
  }));
}

export const approvedPos = state => soLenhSXs => {
  if (soLenhSXs.length === 0) return state.approvedPos;
  return state.approvedPos.filter(a => soLenhSXs.includes(a.number));
};
export function boms(state) {
  return state.boms;
}

export function getAllCongDoan() {
  return [
    {
      label: "Lựa phôi - X3",
      value: "100274"
    },
    {
      label: "Lựa phôi - X1",
      value: "100264"
    }
  ];
}
