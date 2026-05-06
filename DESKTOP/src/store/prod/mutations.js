export function GET_ROUTING_BY_ITEM_ID(state, currentRoutingData) {
  state.currentRoutingData = currentRoutingData;
}
export function INIT_MARKET(state, markets) {
  state.marketsWithQuantity = markets;
}

export const setRoutings = (state, payload) => (state.routings = payload);
