<template>
  <q-page class="q-pa-sm">
    <div>
      <div class="row print-hide" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Biên bản giao nhận gỗ bán thành phẩm
        </div>

        <div
          class="col-6 cursor-pointer text-blue text-bold"
          style="font-size: 18px"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày <span class="text-amber-14">{{ tuNgay }}</span> đến
          <span class="text-amber-14">{{ denNgay }}</span>
        </div>
      </div>
    </div>
    <div style="padding: 5px">
      <div class="row bg-grey-1 print-hide" style="padding: 5px 0 5px 0">
        <div class="col-12" align="right"></div>
      </div>
      <div class="q-gutter-md row print-hide">
        <q-select
          class="col-2"
          color="grey-3"
          label-color="orange"
          filled
          v-model="code"
          :options="codes"
          label="Chọn biên bản"
          @input="onChangeCode"
          dense
        />
      </div>
      <div class="row" v-if="dataSource.length > 0">
        <table border="1" style="width: 100%; border-collapse: collapse; margin-bottom: 30px">
       
            <thead class="w-100">
            <tr>{{ TEN_CTY }}</tr>
            <tr>
              <th style="font-size: 16px">SỔ TAY COC</th>
              <td rowspan="2" style="width: 200px">
                BM.COC.01-a <br />
                Ngày ban hành: 10.02.2022 <br />
                Lần ban hành: 02
              </td>
            </tr>
            <tr>
              <th style="font-size: 18px">
               BIÊN BẢN NGHIỆM THU VÀ GIAO NHẬN GỖ KEO TRÒN FSC100%
              </th>
            </tr>
          </thead>
        </table>
        <table border="1" style="width: 100%; border-collapse: collapse">
          <tbody class="w-100">
            <tr>
              <td   colspan="2">
                Đơn vị giao hàng 
              </td>
            <td   colspan="3">
                <b>{{ dataSource[0].Chu_rung }}</b>
              </td>
              <td   colspan="2">
                Số phiếu: 
              </td>
               <td   colspan="3">
              <b>{{ dataSource[0].So_phieu }}</b>
              </td>
            </tr>
            <tr>
              <td   colspan="2">
                Địa chỉ: 
              </td>
                <td   colspan="3">
                 <b>{{ dataSource[0].Thon }}</b>
              </td>
              <td   colspan="2">Biển số xe:</td>
              <td   colspan="3">{{ dataSource[0].Xe }}</td>
            </tr>
            <tr>
              <td   colspan="2">Số chứng chỉ FM/COC:</td>
              <td   colspan="3">{{ dataSource[0].So_chung_chi }}</td>
              <td   colspan="2">Nơi giao nhận</td>
              <td   colspan="2">Tại bãi 1:</td>
              <td   colspan="1">{{ dataSource[0].Chu_rung }}</td>
            </tr>
            <tr>
              <td colspan="2">
                Đơn vị nhận hàng:
              </td>
              <td colspan="3"><b>{{ UQ }} ({{ TEN_CTY }})</b></td>
              <td colspan="2">Ngày nghiệm thu & giao nhận: </td>
              <td>{{ formatDate(dataSource[0].Ngay_nhap) }}</td>
            </tr>
            <tr>
                  <td   colspan="2">
                Địa chỉ: 
              </td>
                <td   colspan="3">
                 {{ DIA_CHI_CTY }}
              </td>
            <td   colspan="2">Trạng thái MT:</td>
            <td   colspan="1">FSC 100%</td>
            <td   colspan="1">Nhóm SP:</td>
            <td   colspan="1">W1.1:</td>
            </tr>
            <tr>
            <td   colspan="2">Số chứng chỉ FM/COC:</td>
            <td   colspan="1">{{ CHUNG_CHI_CTY }}</td>
            <td   colspan="1">Hiệu lực đến ngày:</td>
            <td   colspan="1">{{ HIEU_LUC_CTY }}</td>
            <td   colspan="3">Mã lô gỗ nhập:</td>
            <td   colspan="2">{{ dataSource[0].Lo_go }}</td>
            </tr>
              <tr>
    <td rowspan="2" style="text-align: center; vertical-align: middle;">STT</td>
    <td colspan="2" style="text-align: center;">Quy cách</td>
    <td rowspan="2" style="text-align: center; vertical-align: middle;">Khối lượng thực nhập (M3)</td>
    <td rowspan="2" style="text-align: center; vertical-align: middle;">Loại gỗ</td>
    <td rowspan="2" style="text-align: center; vertical-align: middle;">Khoảnh</td>
    <td rowspan="2" style="text-align: center; vertical-align: middle;">Lô</td>
    <td rowspan="2" style="text-align: center; vertical-align: middle;">Diện Tích (Ha)</td>
    <td rowspan="2" colspan="2"  style="text-align: center; vertical-align: middle;">Ghi chú</td>
  </tr>
    <tr>
    <td style="text-align: center;">Dài (m)</td>
    <td style="text-align: center;">Đường kính (cm)</td>
  </tr>
          <tr>
    <td colspan="1" style="text-align: center; vertical-align: middle;">1</td>
    <td colspan="1" style="text-align: center;">2</td>
    <td colspan="1" style="text-align: center;">Từ 13cm trở lên</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;">{{ dataSource[0].Khoi_luong }}</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;">Gỗ keo tròn FSC 100 % (Acacia magium)</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;">{{ dataSource[0].Khoang }}</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;">{{ dataSource[0].Lo }}</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;">{{ dataSource[0].Dien_tich }}</td>
    <td colspan="2" style="text-align: center; vertical-align: middle;"></td>
  </tr>
    <tr>
    <td colspan="3" style="text-align: center; vertical-align: middle;">Tổng</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;">{{ dataSource[0].Khoi_luong }}</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;"></td>
    <td colspan="1" style="text-align: center; vertical-align: middle;"></td>
    <td colspan="1" style="text-align: center; vertical-align: middle;"></td>
    <td colspan="1" style="text-align: center; vertical-align: middle;"></td>
    <td colspan="2" style="text-align: center; vertical-align: middle;"></td>
  </tr>
          </tbody>
        </table>

      </div>
      <div
        v-if="dataSource.length > 0"
        class="row text-bold"
        style="margin-bottom: 50px"
      >
        <div class="col-6" align="center">Đại diện giao hàng</div>
        <div class="col-6" align="center">Đại diện nhận hàng</div>
      </div>
      <div  v-if="dataSource.length > 0"
        class="row text-bold"
        style="margin-bottom: 50px">
        <div class="col-6" align="center">{{ dataSource[0].Chu_rung }}</div>
        <div class="col-6" align="center">{{ UQ }}</div>
      </div>
       <br>
    <br>
     <br>
    <br>
     <br>
    <br>
     <br>
    <br>
        <br>
    <br>
     <br>
    <br>
     <br>
    <br>
    
      <div class="row" v-if="dataSource.length > 0">
        <table border="1" style="width: 100%; border-collapse: collapse; margin-bottom: 30px">
       
            <thead class="w-100">
            <tr>{{ TEN_CTY }}</tr>
            <tr>
              <th style="font-size: 16px">SỔ TAY COC</th>
              <td rowspan="2" style="width: 200px">
                BM.COC.01-a <br />
                Ngày ban hành: 10.02.2022 <br />
                Lần ban hành: 02
              </td>
            </tr>
            <tr>
              <th style="font-size: 18px">
               PHIẾU NHẬP KHO GỖ KEO TRÒN FSC100%
              </th>
            </tr>
          </thead>
        </table>
   
        <table border="1" style="width: 100%; border-collapse: collapse">
          <tbody class="w-100">
            <tr>
              <td   colspan="2">
                Người giao hàng: 
              </td>
            <td   colspan="3">
                <b>{{ UQ }}</b>
              </td>
              <td   colspan="2">
                Số phiếu: 
              </td>
               <td   colspan="3">
              <b>{{ dataSource[0].So_phieu }}</b>
              </td>
            </tr>
            <tr>
              <td   colspan="2">
                Kho nhập 
              </td>
                <td   colspan="3">
                 <b>{{ TEN_CTY }}</b>
              </td>
              <td   colspan="2">Biển số xe:</td>
              <td   colspan="3">{{ dataSource[0].Xe }}</td>
            </tr>
            <tr>
              <td   colspan="2">Địa chỉ:</td>
              <td   colspan="3">{{ DIA_CHI_CTY }}</td>
              <td   colspan="2">Ngày nhập:</td>
              <td   colspan="3">{{ formatDate(dataSource[0].Ngay_nhap) }}</td>
            </tr>
            <tr>
            <td colspan="2">
                Trạng thái MT:
            </td>
            <td   colspan="1">FSC 100%</td>
            <td   colspan="1">Nhóm SP:</td>
            <td   colspan="1">W1.1:</td>
             <td   colspan="3">Mã lô gỗ nhập:</td>
            <td   colspan="2">{{ dataSource[0].Lo_go }}</td>
            </tr>
            <tr>
                  <td   colspan="4">
                Số chứng chỉ FM/COC:
              </td>
                 <td   colspan="6">
              {{ dataSource[0].So_chung_chi }}
              </td>
            </tr>
              <tr>
    <td rowspan="2" style="text-align: center; vertical-align: middle;">STT</td>
    <td colspan="2" style="text-align: center;">Quy cách</td>
    <td rowspan="2" style="text-align: center; vertical-align: middle;">Khối lượng thực nhập (M3)</td>
    <td rowspan="2" style="text-align: center; vertical-align: middle;">Loại gỗ</td>
    <td rowspan="2" style="text-align: center; vertical-align: middle;">Khoảnh</td>
    <td rowspan="2" style="text-align: center; vertical-align: middle;">Lô</td>
    <td rowspan="2" style="text-align: center; vertical-align: middle;">Diện Tích (Ha)</td>
    <td rowspan="2" colspan="2"  style="text-align: center; vertical-align: middle;">Ghi chú</td>
  </tr>
    <tr>
    <td style="text-align: center;">Dài (m)</td>
    <td style="text-align: center;">Đường kính (cm)</td>
  </tr>
          <tr>
    <td colspan="1" style="text-align: center; vertical-align: middle;">1</td>
    <td colspan="1" style="text-align: center;">2</td>
    <td colspan="1" style="text-align: center;">Từ 13cm trở lên</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;">{{ dataSource[0].Khoi_luong }}</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;">Gỗ keo tròn FSC 100 % (Acacia magium)</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;">{{ dataSource[0].Khoang }}</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;">{{ dataSource[0].Lo }}</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;">{{ dataSource[0].Dien_tich }}</td>
    <td colspan="2" style="text-align: center; vertical-align: middle;"></td>
  </tr>
    <tr>
    <td colspan="3" style="text-align: center; vertical-align: middle;">Tổng</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;">{{ dataSource[0].Khoi_luong }}</td>
    <td colspan="1" style="text-align: center; vertical-align: middle;"></td>
    <td colspan="1" style="text-align: center; vertical-align: middle;"></td>
    <td colspan="1" style="text-align: center; vertical-align: middle;"></td>
    <td colspan="1" style="text-align: center; vertical-align: middle;"></td>
    <td colspan="2" style="text-align: center; vertical-align: middle;"></td>
  </tr>
          </tbody>
        </table>

      </div>
      <div
        v-if="dataSource.length > 0"
        class="row text-bold"
        style="margin-bottom: 50px"
      >
        <div class="col-6" align="center">Đại diện giao hàng</div>
        <div class="col-6" align="center">Đại diện nhận hàng</div>
      </div>
      <div  v-if="dataSource.length > 0"
        class="row text-bold"
        style="margin-bottom: 50px">
        <div class="col-6" align="center">{{ dataSource[0].Chu_rung }}</div>
        <div class="col-6" align="center">{{ UQ }}</div>
      </div>
   
    </div>
 
    
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxExport,
  DxColumn,
  DxFilterRow,
  DxSummary,
  DxTotalItem,
} from "devextreme-vue/data-grid";
import { mapGetters, mapActions } from "vuex";
import DialogSelectDate from "../components/commons/DialogSelectFromDateToDate";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../ultils";
import moment from "moment";
import xuongXeMixin from "../mixins/xuongXeMixin";
export default {
  mixins: [xuongXeMixin],
  components: {
    DxDataGrid,
    DxFilterRow,
    DxExport,
    DxColumn,
    DialogSelectDate,
    DxSummary,
    DxTotalItem,
  },
  data() {
    return {
      fromDate: null,
      toDate: null,
      showChooseDate: false,
      codes: [],
      code: null,
      ngayNhap: null,
      dataSource: [],
      TEN_CTY: "",
      UQ: "",
      DIA_CHI_CTY: "",
      CHUNG_CHI_CTY: "",
      HIEU_LUC_CTY: "",
    };
  },
  computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  async created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    await this.loadXuongXe();
  },
  methods: {
    ...mapActions("prod", ["getCodebangiaogotron", "getBBgiaogotron"]),
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      this.loadCodeNhanPhoi();
    },
        formatDate(d){
      return formatDateVN(d)
    },
    async onChange() {
      this.loadCodeNhanPhoi();
    },
    async loadCodeNhanPhoi() {
      const payload = {
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).add(1, "day").format("YYYY-MM-DD 00:00:00"),
      };
      const data = await this.getCodebangiaogotron(payload);
      this.codes = data.data;
    },
    async onChangeCode() {
      const payload = {
        code: this.code.value,
      };
      const data = await this.getBBgiaogotron(payload);
       this.ngayNhap = data.data[0].Ngay_nhap;
      this.dataSource = data.data;
      this.applyXuongConfig();
    },
    applyXuongConfig() {
      if (!this.dataSource.length) return;
      const row = this.dataSource[0];
      const xuong = row.Xuong_xe ? row.Xuong_xe.trim() : "";
      const cfg = this.getXuongConfig(xuong);
      this.TEN_CTY = cfg.ten || "";
      this.UQ = cfg.nguoi_dai_dien || row.UQ || "";
      this.DIA_CHI_CTY = cfg.dia_chi || "";
      this.CHUNG_CHI_CTY = cfg.chung_chi || "";
      this.HIEU_LUC_CTY = cfg.hieu_luc_cc || "";
    },
  },
};
</script>

<style>
</style>