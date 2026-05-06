export function someGetter(/* state */) {}
export const routings = state =>
  state.routings.sort((a, b) => a.order - b.order);
export const factories = state => state.factories;

export const goodsTypes = state => state.goodsTypes;