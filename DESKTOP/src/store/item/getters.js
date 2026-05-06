export function items(state) {
  return state.items;
}
export const listItems = state => state.items;

export function itemSelect(state) {
  let itemsCp = state.items.reduce((newArray, element) => {
    newArray.push({
      id: element.id,
      name:
        element.code.split(".")[0] +
        " " +
        element.height +
        " " +
        element.name +
        " (" +
        element.height +
        "*" +
        element.width +
        "*" +
        element.length +
        ") " +
        element.code
    });

    return newArray;
  }, []);
  // console.log(itemsCp)
  return itemsCp;
}
