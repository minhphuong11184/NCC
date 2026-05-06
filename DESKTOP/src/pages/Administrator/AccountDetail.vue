<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">
            Quản lý tài khoản chi tiết
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-mt-md">
          <div class="col-12">
            <DxDataGrid
              id="gridContainer"
              :data-source="dataSource"
              :show-borders="true"
              :show-row-lines="true"
              :word-wrap-enabled="true"
              :no-data-text="'Không có dữ liệu'"
              :show-column-lines="true"
              :allow-column-resizing="true"
              @row-updated="updated"
            >
              <DxEditing :allow-updating="true" mode="cell" />
              <DxScrolling mode="infinite" />
              <DxSorting mode="none" />
              <DxColumnChooser :enabled="true" />
              <DxHeaderFilter :visible="true" />
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
              <DxGrouping :auto-expand-all="true" />
              <DxColumn
                data-field="ACCOUNT"
                caption="Mã NV"
                width="100"
                :allowEditing="false"
              />
              <DxColumn
                data-field="LAST_NAME"
                :allowEditing="false"
                caption="Họ và tên"
                width="200"
              />
              <DxColumn
                data-field="POSITION"
                caption="Chức vụ"
                width="200"
                :allowEditing="false"
              />
              <DxColumn
                data-field="DEPARTMENT_NAME"
                caption="Bộ phận"
                :allowEditing="false"
                width="200"
              />
              <DxColumn
                data-field="NGAY_SINH"
                caption="Ngày sinh"
                data-type="date"
                format="dd/MM/yyyy"
                width="100"
              />
              <DxColumn
                data-field="GIOI_TINH"
                caption="Giới tính"
                width="100"
              />
              <DxColumn
                data-field="NGUYEN_QUAN"
                caption="Nguyên quán"
                width="100"
              />
              <DxColumn
                data-field="HO_KHAU_THUONG_TRU"
                caption="Hộ khẩu thường trú"
                width="100"
              />
              <DxColumn data-field="DAN_TOC" caption="Dân tộc" width="100" />
              <DxColumn data-field="SO_CMND" caption="Số CMND" width="150" />
              <DxColumn
                data-field="NGAY_CAP_CMND"
                caption="Ngày cấp"
                data-type="date"
                format="dd/MM/yyyy"
                width="100"
              />
              <DxColumn
                data-field="NOI_CAP_CMND"
                caption="Nơi cấp"
                width="100"
              />
              <DxColumn
                data-field="NGAY_VAO_CT"
                caption="Ngày vào"
                data-type="date"
                format="dd/MM/yyyy"
                width="100"
              />
              <DxColumn
                data-field="NOI_KY_HD"
                caption="Nơi ký HĐ"
                width="100"
              />
              <DxColumn data-field="TTHD" caption="TTHĐ" width="100" />
              <DxColumn
                data-field="TU_NGAY"
                caption="Từ ngày"
                data-type="date"
                format="dd/MM/yyyy"
                width="100"
              />
              <DxColumn
                data-field="DEN_NGAY"
                caption="Đến ngày"
                data-type="date"
                format="dd/MM/yyyy"
                width="100"
              />
              <DxColumn
                data-field="unActive"
                caption="Ngày nghỉ việc"
                :allowEditing="false"
                width="100"
              />
              <DxColumn
                data-field="FACTORY_NAME"
                :allowEditing="false"
                caption="Địa điểm làm việc"
                width="200"
              />
              <DxSearchPanel
                :visible="true"
                :placeholder="'Tìm kiếm'"
                :width="400"
              />
            </DxDataGrid>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxScrolling,
  DxSorting,
  DxExport,
  DxEditing,
  DxHeaderFilter,
  DxColumnChooser,
} from "devextreme-vue/data-grid";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxScrolling,
    DxSorting,
    DxPager,
    DxEditing,
    DxPaging,
    DxSearchPanel,
    DxExport,
    DxHeaderFilter,
    DxColumnChooser,
  },
  data() {
    return {
      dataSource: [],
    };
  },
  created() {
    this.load();
  },
  methods: {
    ...mapActions("hrm", [
      "getAccountDetail",
      "updateAccountDetail",
      "insertAccountDetail",
    ]),
    async load() {
      const data = await this.getAccountDetail();
      this.dataSource = data;
    },
    async updated(e) {
      console.log("e", e);
      const payload = {
        accountId: e.data.ID,
        ngaySinh: e.data.NGAY_SINH
          ? moment(e.data.NGAY_SINH).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
        gioiTinh: e.data.GIOI_TINH ? e.data.GIOI_TINH : "",
        nguyenQuan: e.data.NGUYEN_QUAN ? e.data.NGUYEN_QUAN : "",
        hoKhauThuongTru: e.data.HO_KHAU_THUONG_TRU
          ? e.data.HO_KHAU_THUONG_TRU
          : "",
        danToc: e.data.DAN_TOC ? e.data.DAN_TOC : "",
        soCMND: e.data.SO_CMND ? e.data.SO_CMND : "",
        ngayCapCMND: e.data.NGAY_CAP_CMND
          ? moment(e.data.NGAY_CAP_CMND).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
        noiCapCMND: e.data.NOI_CAP_CMND ? e.data.NOI_CAP_CMND : "",
        ngayVaoCT: e.data.NGAY_VAO_CT
          ? moment(e.data.NGAY_VAO_CT).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
        noikyHD: e.data.NOI_KY_HD ? e.data.NOI_KY_HD : "",
        TTHD: e.data.TTHD ? e.data.TTHD : "",
        tuNgay: e.data.TU_NGAY
          ? moment(e.data.TU_NGAY).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
        denNgay: e.data.TU_NGAY
          ? moment(e.data.DEN_NGAY).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
      };
      if (e.data.ACCOUNT_ID) {
        const data = await this.updateAccountDetail(payload);
        this.load();
      } else {
        const data = await this.insertAccountDetail(payload);
        this.load();
      }
    },
  },
};
</script>

<style>
#gridContainer {
  height: 800px;
}
</style>