import client from "../../utils";
// export const getTonsByStepId = async ({ commit }, payload) => {
//   const { data } = await client.get(
//     `/api/v2/production-order/${payload.stepId}/ton-tren-chuyen?startDate=${payload.startDate}&endDate=${payload.endDate}`,
//   );

//   if (data) commit("setTons", data);
// };
export const getTonsByStepId = async ({ commit }, payload) => {
  const { data } = await client.get(
    `/api/v2/production-order/${payload.factoryId}/ton-cong-doan-ngang?startDate=${payload.startDate}&endDate=${payload.endDate}`,
  );

  if (data) commit("setTons", data);
};
export const nhapcongdoan = async ({ commit }, payload) => {
  const { data } = await client.get(
    `/api/v2/production-order/${payload.factoryId}/ton-nhap-cong-doan?startDate=${payload.startDate}&endDate=${payload.endDate}`,
  );

};
export const tondkcongdoan = async ({ commit }, payload) => {
  const { data } = await client.get(
    `/api/v2/production-order/${payload.factoryId}/ton-dau-ky-cong-doan?startDate=${payload.startDate}&endDate=${payload.endDate}`,
  );

};
export const capnhatQC = async ({ commit }, payload) => {
  const { data } = await client.get(
    `/api/v2/production-order/${payload.fa}/cap-nhat-qc?roleId=${payload.roleId}`,
  );

};
export const getTonsByStepIdchitiet = async ({ commit }, payload) => {
  const { data } = await client.get(
    `/api/v2/production-order/${payload.factoryId}/ton-cong-doan?startDate=${payload.startDate}&endDate=${payload.endDate}`,
  );

  if (data) commit("setTons", data);
};
export const getTonsGhiNhan = async ({ commit }, payload) => {
  const { data } = await client.get(
    `/api/v2/production-order/${payload.factoryId}/ton-ghi-nhan?startDate=${payload.startDate}&endDate=${payload.endDate}`,
  );

  if (data) commit("setTons", data);
};
export async function postTonsGhiNhan({ commit }, payload) {
  const data = await postRequest(
      `api/v2/production-order/ton-ghi-nhan`,
      payload
  );
  console.log("dataCP", data);
  return data.data;
}
export const getTonsByStepId2 = async ({ commit }, payload) => {
  const { data } = await client.post(
    `/api/v2/production-order/ton-cong-doan-2`, payload
  );
    return data;

};
