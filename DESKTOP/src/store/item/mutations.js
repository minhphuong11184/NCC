export function setItems(state, payload) {
  state.items = payload
}

export function updateItem(state, {
  key,
  values
}) {
  let item = state.items.filter(item => item.id === key)
  item.heso = values.heso
}
