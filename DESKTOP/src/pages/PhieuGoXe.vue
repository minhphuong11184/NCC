<template>
  <q-page padding>
    <div class="text-h5 q-mb-md no-print">Phiếu gỗ xẻ (NKTP / XK / BKLS)</div>

    <!-- Toolbar -->
    <div class="row q-col-gutter-md items-end q-mb-md no-print">
      <div class="col-auto">
        <q-select v-model="thang" :options="thangOptions" emit-value map-options label="Tháng" filled dense style="width:140px" />
      </div>
      <div class="col-auto">
        <q-input v-model.number="nam" type="number" label="Năm" filled dense style="width:100px" />
      </div>
      <div class="col-auto">
        <q-select v-model="mancc" :options="nccOptions" option-value="code" option-label="label"
          emit-value map-options label="Xưởng xẻ" filled dense style="min-width:300px"
          use-input @filter="filterNcc" />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="search" label="Tải biên bản đã lưu" @click="load" :loading="loading" />
      </div>
    </div>

    <!-- Toolbar 2: chọn phiếu + nút in/xuất -->
    <div v-if="phieuList.length" class="row q-col-gutter-md items-end q-mb-md no-print">
      <div class="col-auto"><q-chip color="blue" text-color="white">{{ phieuList.length }} phiếu</q-chip></div>
      <div class="col-auto"><q-chip color="teal" text-color="white">{{ tongChiTiet }} dòng</q-chip></div>
      <div class="col-auto"><q-chip color="green" text-color="white">{{ fmtKL(tongKL) }} m³</q-chip></div>
      <div class="col-auto">
        <q-select v-model="selectedIdx" :options="phieuDropdown" emit-value map-options
          label="Chọn phiếu" filled dense style="min-width:380px" />
      </div>
      <div class="col-auto">
        <q-btn flat icon="navigate_before" :disable="selectedIdx <= 0" @click="selectedIdx--" />
        <span class="text-bold">{{ selectedIdx + 1 }} / {{ phieuList.length }}</span>
        <q-btn flat icon="navigate_next" :disable="selectedIdx >= phieuList.length - 1" @click="selectedIdx++" />
      </div>
      <div class="col-auto">
        <q-btn color="secondary" icon="print" label="In phiếu này" @click="printPage" />
      </div>
      <div class="col-auto">
        <q-btn color="blue-7" icon="description" label="Xuất Word (3 mẫu × phiếu)"
          :loading="exportingWord" @click="exportAllWord" />
      </div>
      <div class="col-auto">
        <q-btn color="green-7" icon="grid_on" label="Xuất Excel (4 sheet)"
          :loading="exportingExcel" @click="exportAllExcel" />
      </div>
    </div>

    <!-- Tabs chọn mẫu -->
    <q-tabs v-if="phieuList.length" v-model="currentTab" class="no-print bg-grey-2 text-primary" align="left" dense>
      <q-tab name="NKTP" label="NKTP — Phiếu nhập kho thành phẩm" />
      <q-tab name="XK" label="XK — Phiếu xuất kho" />
      <q-tab name="BKLS" label="BKLS — Bảng kê lâm sản" />
    </q-tabs>
    <q-separator class="no-print" />

    <!-- Preview phiếu hiện tại -->
    <div v-if="currentPhieu" class="print-area q-mt-md">

      <!-- ========== NKTP ========== -->
      <div v-show="currentTab === 'NKTP'" class="phieu-form">
        <table class="head">
          <tr>
            <td class="bold">{{ cfg.ten || '...' }}</td>
            <td class="right small italic">BM: {{ cfg.bm_nhap_kho || 'CoC' }}<br/>Ngày BH: {{ cfg.ngay_ban_hanh || '___' }}<br/>Lần BH: {{ cfg.lan_ban_hanh || '___' }}</td>
          </tr>
          <tr><td colspan="2">Địa Chỉ: {{ cfg.dia_chi }}</td></tr>
          <tr><td colspan="2">Số chứng chỉ: <b>{{ cfg.chung_chi }}</b>. Hiệu lực chứng chỉ: <b>{{ cfg.hieu_luc_cc }}</b></td></tr>
        </table>
        <div class="title">PHIẾU NHẬP KHO THÀNH PHẨM</div>
        <table class="info-2col">
          <tr>
            <td class="lbl">Số phiếu:</td><td class="val bold">{{ currentPhieu.SOPHIEU }}</td>
            <td class="right">☑ P.Tươi   ☐ P.Khô   ☐ T/c</td>
          </tr>
          <tr>
            <td class="lbl">Tên thành phẩm:</td><td class="val">Gỗ keo xẻ FSC 100%</td>
            <td class="right">☑ FSC 100%   ☐ Mix   ☐ Non FSC   ☐ CW   ☐ KLS</td>
          </tr>
          <tr>
            <td class="lbl">Nhập tại kho:</td><td class="val" colspan="2">{{ cfg.ten }}</td>
          </tr>
          <tr>
            <td class="lbl">Loài gỗ:</td><td class="val" colspan="2">Keo tai tượng (Acacia mangium)</td>
          </tr>
        </table>
        <table class="tbl">
          <thead>
            <tr>
              <th rowspan="2">STT</th>
              <th rowspan="2">Tên thành phẩm</th>
              <th rowspan="2">Tên chủ rừng</th>
              <th rowspan="2">Số lô gỗ tròn</th>
              <th rowspan="2">Số lô gỗ xẻ</th>
              <th colspan="3">Quy cách (dày/rộng/dài) mm</th>
              <th colspan="2">Khối lượng</th>
              <th rowspan="2">Ghi chú</th>
            </tr>
            <tr>
              <th>Dày</th><th>Rộng</th><th>Dài</th>
              <th>Thanh</th><th>m³</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d, di) in currentPhieu.chi_tiet" :key="'nktp-'+di">
              <td>{{ di + 1 }}</td>
              <td>Gỗ keo xẻ FSC 100%</td>
              <td>{{ d.chu_rung || '' }}</td>
              <td>{{ d.lo_go_tron || '' }}</td>
              <td>{{ d.lo_go_xe || '' }}</td>
              <td>{{ d.dt_day }}</td>
              <td>{{ d.dt_rong }}</td>
              <td>{{ d.dt_cao }}</td>
              <td>{{ d.tong_thanh }}</td>
              <td class="num">{{ fmtKL(d.kl_m3) }}</td>
              <td></td>
            </tr>
            <tr class="total-row">
              <td colspan="9">TỔNG</td>
              <td class="num">{{ fmtKL(currentPhieu.tong_kl) }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div class="info-bottom">
          <div>Ngày nhập: <b>{{ fmtDate(currentPhieu.CREATED_AT) }}</b> &nbsp;&nbsp; Biển số xe: <b>{{ currentPhieu.BIENSOXE }}</b></div>
        </div>
        <table class="sign-3col">
          <tr><td class="sign-title">Người giao hàng</td><td class="sign-title">Thủ kho</td><td class="sign-title">Giám đốc</td></tr>
          <tr><td class="sign-space"></td><td class="sign-space"></td><td class="sign-space"></td></tr>
        </table>
      </div>

      <!-- ========== XK ========== -->
      <div v-show="currentTab === 'XK'" class="phieu-form">
        <table class="head">
          <tr>
            <td class="bold" colspan="2">{{ cfg.ten || '...' }}</td>
          </tr>
          <tr><td colspan="2">Địa Chỉ: {{ cfg.dia_chi }}</td></tr>
          <tr><td colspan="2">Số chứng chỉ: <b>{{ cfg.chung_chi }}</b>. Hiệu lực: <b>{{ cfg.hieu_luc_cc }}</b></td></tr>
        </table>
        <div class="title">PHIẾU XUẤT KHO</div>
        <table class="info-2col">
          <tr>
            <td class="lbl">Tên khách hàng:</td>
            <td class="val" colspan="2">{{ WL.ten }}</td>
          </tr>
          <tr>
            <td class="lbl">Số chứng chỉ:</td>
            <td class="val" colspan="2">{{ WL.chung_chi }} — Hiệu lực: {{ WL.hieu_luc }}</td>
          </tr>
          <tr>
            <td class="lbl">Loại gỗ:</td><td class="val">Keo tai tượng (Acacia mangium)</td>
            <td class="right">Số phiếu: <b>{{ currentPhieu.SOPHIEU }}</b></td>
          </tr>
          <tr>
            <td class="lbl">Trạng thái MT:</td><td class="val">FSC 100%</td>
            <td class="right">Ngày xuất: <b>{{ fmtDate(currentPhieu.CREATED_AT) }}</b></td>
          </tr>
          <tr>
            <td class="lbl">Biển số xe:</td><td class="val" colspan="2"><b>{{ currentPhieu.BIENSOXE }}</b></td>
          </tr>
        </table>
        <table class="tbl">
          <thead>
            <tr>
              <th rowspan="2">TT</th>
              <th rowspan="2">Tên chủ rừng</th>
              <th rowspan="2">Mã lô gỗ tròn</th>
              <th rowspan="2">Mã lô gỗ xẻ</th>
              <th rowspan="2">Tên sản phẩm</th>
              <th rowspan="2">ĐVT</th>
              <th colspan="3">Quy cách (mm)</th>
              <th rowspan="2">Số lượng<br/>(thanh)</th>
              <th rowspan="2">Khối lượng<br/>(m³)</th>
              <th rowspan="2">Ghi chú</th>
            </tr>
            <tr><th>Dày</th><th>Rộng</th><th>Dài</th></tr>
          </thead>
          <tbody>
            <tr v-for="(d, di) in currentPhieu.chi_tiet" :key="'xk-'+di">
              <td>{{ di + 1 }}</td>
              <td>{{ d.chu_rung || '' }}</td>
              <td>{{ d.lo_go_tron || '' }}</td>
              <td>{{ d.lo_go_xe || '' }}</td>
              <td>Gỗ keo xẻ FSC 100%</td>
              <td>m³</td>
              <td>{{ d.dt_day }}</td>
              <td>{{ d.dt_rong }}</td>
              <td>{{ d.dt_cao }}</td>
              <td>{{ d.tong_thanh }}</td>
              <td class="num">{{ fmtKL(d.kl_m3) }}</td>
              <td></td>
            </tr>
            <tr class="total-row">
              <td colspan="10">TỔNG</td>
              <td class="num">{{ fmtKL(currentPhieu.tong_kl) }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <table class="sign-3col">
          <tr><td class="sign-title">Người lập phiếu</td><td class="sign-title">Thủ kho</td><td class="sign-title">Giám đốc</td></tr>
          <tr><td class="sign-space"></td><td class="sign-space"></td><td class="sign-space"></td></tr>
        </table>
      </div>

      <!-- ========== BKLS — đúng mẫu file go_xe.xlsx sheet BKLS ========== -->
      <div v-show="currentTab === 'BKLS'" class="phieu-form bkls">
        <!-- Header 2 cột: tên xưởng | CỘNG HÒA -->
        <table class="head head-2col">
          <tr>
            <td class="bold center w50">{{ cfg.ten || '...' }}</td>
            <td class="bold center w50">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</td>
          </tr>
          <tr>
            <td class="center">-------</td>
            <td class="center italic">Độc lập - Tự do - Hạnh phúc</td>
          </tr>
          <tr>
            <td></td>
            <td class="center">---------------</td>
          </tr>
          <tr>
            <td>Số(1): <b>{{ soBKLS }}</b></td>
            <td class="right">Tờ số(2): <b>01</b> &nbsp; Tổng số tờ: <b>01</b></td>
          </tr>
        </table>
        <div class="title">BẢNG KÊ LÂM SẢN</div>

        <!-- 1. Chủ lâm sản = Xưởng xẻ (sở hữu gỗ xẻ thành phẩm) -->
        <div class="section-title">1. Thông tin chủ lâm sản:</div>
        <p>- Tên chủ lâm sản(4): <b>{{ cfg.ten }}</b></p>
        <p>- Số GCN/MSDN/GPTL/ĐKHĐ/CMND/HC(5): <b>{{ cfg.mst }}</b></p>
        <p>- Địa chỉ(6): <b>{{ cfg.dia_chi }}</b></p>
        <p>- Số điện thoại: <b>{{ cfg.sdt || '………………' }}</b>, Địa chỉ Email: <b>{{ cfg.email || '…………………………' }}</b></p>
        <p>- Số chứng chỉ: <b>{{ cfg.chung_chi }}</b>. Hiệu lực chứng chỉ: <b>{{ cfg.hieu_luc_cc }}</b>.</p>

        <!-- 2. Tổ chức/cá nhân mua = Woodsland -->
        <div class="section-title">2. Thông tin tổ chức, cá nhân mua/nhận chuyển giao quyền sở hữu:</div>
        <p>- Tên tổ chức, cá nhân(4): <b>{{ WL.ten }}</b></p>
        <p>- Số GCN/MSDN/GPTL/ĐKHĐ/CMND/HC(5): <b>{{ WL.mst }}</b></p>
        <p>- Địa chỉ(6): <b>{{ WL.dia_chi }}</b></p>
        <p>- Số chứng chỉ: <b>{{ WL.chung_chi }}</b>. Hiệu lực chứng chỉ: <b>{{ WL.hieu_luc }}</b>.</p>

        <!-- 3. Thông tin lâm sản -->
        <div class="section-title">3. Thông tin về lâm sản:</div>
        <p>- Tên loài: <b>Gỗ keo xẻ FSC 100% Keo tai tượng (Acacia mangium)</b></p>
        <p>- Nhóm loài: Thông thường</p>
        <p>- Nguồn gốc(7): Số BKLS gốc + tên chủ rừng + lô khoảnh + địa chỉ</p>
        <table class="tbl tbl-source">
          <tr v-for="(g, gi) in nguonGocList" :key="'ng-'+gi">
            <td>Số BKLS: <b>{{ g.so_bkls || '………' }}</b></td>
            <td>Chủ rừng: <b>{{ g.chu_rung || '………' }}</b></td>
            <td>Lô <b>{{ g.lo || '…' }}</b> khoảng <b>{{ g.khoang || '…' }}</b></td>
            <td>Địa chỉ: <b>{{ g.dia_chi || '………' }}</b></td>
          </tr>
        </table>
        <p>- Mã HS (áp dụng đối với lâm sản nhập khẩu, xuất khẩu): …………………</p>
        <p>- Giá trị (nếu có): ……………………………………………………………</p>
        <p>- Khối lượng/trọng lượng: <b>{{ fmtKL(currentPhieu.tong_kl) }}</b> M³ &nbsp;&nbsp; Bằng chữ: <b>{{ tongKLChu(currentPhieu.tong_kl) }}</b>.</p>
        <p>- Số lượng: <b>{{ tongSoThanh }}</b> &nbsp; Đơn vị tính: <b>Thanh</b></p>
        <p>- Thông tin về lô khai thác(8):</p>
        <table class="tbl tbl-source">
          <tr v-for="(g, gi) in loKhaiThacList" :key="'kt-'+gi">
            <td>KĐ: <b>{{ g.kd || '………' }}</b></td>
            <td>VĐ: <b>{{ g.vd || '………' }}</b></td>
            <td></td>
            <td></td>
          </tr>
        </table>
        <p>- Thông tin khác có liên quan (nếu có): Số lô gỗ xẻ</p>
        <p v-for="(lx, li) in loGoXeList" :key="'lx-'+li" class="indent">
          <b>{{ lx }}</b>
        </p>

        <!-- 4 -->
        <div class="section-title">4. Thông tin chi tiết tại Bảng kê khai kèm theo:</div>
        <p class="italic small">(Áp dụng đối với gỗ nguyên liệu, sản phẩm gỗ: khai thác từ rừng tự nhiên trong nước, gỗ và sản phẩm gỗ nhập khẩu, gỗ và sản phẩm gỗ sau xử lý tịch thu)</p>

        <!-- 5. Vận chuyển -->
        <div class="section-title">5. Thông tin vận chuyển:</div>
        <p>Phương tiện vận chuyển, biển số xe: <b>{{ currentPhieu.BIENSOXE }}</b></p>
        <p>Thời gian vận chuyển: <b>01 ngày</b>; Từ ngày: <b>{{ fmtDate(currentPhieu.CREATED_AT) }}</b> &nbsp;&nbsp; Đến ngày: <b>{{ fmtDate(currentPhieu.CREATED_AT) }}</b></p>
        <p>Vận chuyển từ: <b>{{ cfg.ten }}</b> &nbsp;&nbsp; Đến: <b>{{ WL.ten }}</b></p>
        <p>Địa chỉ: <b>{{ cfg.dia_chi }}</b> &nbsp;&nbsp; <b>{{ WL.dia_chi }}</b></p>

        <!-- 6. Hồ sơ -->
        <div class="section-title">6. Hồ sơ kèm theo (nếu có):</div>

        <p class="italic q-mt-sm">Chúng tôi/Tôi cam kết những nội dung kê khai trong bảng kê này là đúng sự thật và chịu trách nhiệm trước pháp luật về sự trung thực của thông tin đã kê khai.</p>

        <table class="sign-2col">
          <tr>
            <td class="right italic">……, ngày … tháng …… năm 20……</td>
            <td class="right italic"><b>{{ diaDanhXuong }}, ngày {{ ngayInfo.d }} tháng {{ pad2(ngayInfo.m) }} năm {{ ngayInfo.y }}</b></td>
          </tr>
          <tr>
            <td class="sign-title">XÁC NHẬN CỦA CƠ QUAN CÓ THẨM QUYỀN (9)</td>
            <td class="sign-title">TỔ CHỨC/CÁ NHÂN LẬP BẢNG KÊ</td>
          </tr>
          <tr>
            <td class="small italic">Vào sổ số: …/…<br/>(Người có thẩm quyền ký, ghi rõ họ tên, đóng dấu)</td>
            <td class="small italic">(Ký, ghi rõ họ tên, đóng dấu đối với tổ chức)</td>
          </tr>
          <tr>
            <td class="sign-space"></td>
            <td class="sign-space"></td>
          </tr>
          <tr>
            <td></td>
            <td class="sign-name">{{ cfg.nguoi_dai_dien || '' }}</td>
          </tr>
        </table>
      </div>
    </div>

    <q-banner v-if="!phieuList.length && !loading" class="bg-blue-1 text-blue-9 q-mt-md no-print" rounded>
      <template v-slot:avatar><q-icon name="info" /></template>
      Chọn <b>tháng / năm / xưởng xẻ</b> rồi bấm <b>Tải biên bản đã lưu</b>. Nếu chưa có dữ liệu, vào <b>Ghép Lô Gỗ → Lưu biên bản</b> trước.
    </q-banner>
  </q-page>
</template>

<script>
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import xuongXeMixin from "../mixins/xuongXeMixin";
import { volumeToWordsVN } from "../utils/numberToWordsVN";

// Khách hàng Woodsland (cố định cho mẫu XK + BKLS)
const WOODSLAND_CFG = {
  ten: "Công ty cổ phần Woodsland",
  mst: "5000815668",
  dia_chi: "Cụm CN Thắng Quân, xã Yên Sơn, Tỉnh Tuyên Quang",
  chung_chi: "SA-COC-007314",
  hieu_luc: "28-12-2030",
};

export default {
  mixins: [xuongXeMixin],
  async created() {
    await this.loadXuongXe();
    this.loadNcc();
  },
  data() {
    return {
      thang: new Date().getMonth() + 1,
      nam: new Date().getFullYear(),
      thangOptions: Array.from({ length: 12 }, (_, i) => ({ label: "Tháng " + (i + 1), value: i + 1 })),
      mancc: "",
      nccList: [],
      nccOptions: [],
      loading: false,
      phieuList: [],
      selectedIdx: 0,
      currentTab: "NKTP",
      exportingWord: false,
      exportingExcel: false,
      WL: WOODSLAND_CFG,
    };
  },
  computed: {
    currentPhieu() { return this.phieuList[this.selectedIdx] || null; },
    phieuDropdown() {
      return this.phieuList.map((p, i) => ({
        label: `${i + 1}. ${p.SOPHIEU} — ${this.fmtDate(p.CREATED_AT)} — Xe ${p.BIENSOXE} (${p.chi_tiet.length} dòng)`,
        value: i,
      }));
    },
    tongChiTiet() { return this.phieuList.reduce((s, p) => s + (p.chi_tiet ? p.chi_tiet.length : 0), 0); },
    tongKL() { return this.phieuList.reduce((s, p) => s + (Number(p.tong_kl) || 0), 0); },
    /** Config xưởng xẻ đang chọn — lookup theo mancc_woodsland */
    cfg() {
      const found = (this.danhSachXuong || []).find(
        x => x.mancc_woodsland && String(x.mancc_woodsland).trim() === this.mancc
      );
      return found || {};
    },
    soBKLS() {
      if (!this.currentPhieu) return "___/___/____/BKLS";
      return `${this.currentPhieu.SOPHIEU}/${this.nam}/BKLS`;
    },
    ngayInfo() {
      const d = this.currentPhieu && this.currentPhieu.CREATED_AT
        ? new Date(this.currentPhieu.CREATED_AT) : new Date();
      return { d: d.getDate(), m: d.getMonth() + 1, y: d.getFullYear() };
    },
    /** Tổng số thanh trong toàn bộ chi tiết */
    tongSoThanh() {
      if (!this.currentPhieu) return 0;
      return (this.currentPhieu.chi_tiet || [])
        .reduce((s, d) => s + (Number(d.tong_thanh) || 0), 0);
    },
    /** Mục 3 — Nguồn gốc: group theo (lo_go_tron, chu_rung), unique */
    nguonGocList() {
      if (!this.currentPhieu) return [];
      const seen = new Set();
      const out = [];
      (this.currentPhieu.chi_tiet || []).forEach(d => {
        const key = (d.lo_go_tron || "") + "|" + (d.chu_rung || "");
        if (seen.has(key)) return;
        seen.add(key);
        const diaChi = [d.thon, d.xa, d.huyen].filter(Boolean).join(", ");
        out.push({
          so_bkls: d.so_bkls,
          chu_rung: d.chu_rung,
          lo_go_tron: d.lo_go_tron,
          lo: d.lo,
          khoang: d.khoang,
          dia_chi: diaChi,
        });
      });
      return out;
    },
    /** Mục 3 — Lô khai thác: list (KĐ, VĐ) unique theo lo_go_tron */
    loKhaiThacList() {
      if (!this.currentPhieu) return [];
      const seen = new Set();
      const out = [];
      (this.currentPhieu.chi_tiet || []).forEach(d => {
        const key = (d.kd || "") + "|" + (d.vd || "");
        if (!d.kd && !d.vd) return;
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ kd: d.kd, vd: d.vd });
      });
      return out;
    },
    /** Mục 3 — Số lô gỗ xẻ: list unique lo_go_xe */
    loGoXeList() {
      if (!this.currentPhieu) return [];
      const seen = new Set();
      (this.currentPhieu.chi_tiet || []).forEach(d => {
        if (d.lo_go_xe) seen.add(d.lo_go_xe);
      });
      return Array.from(seen);
    },
    /** Địa danh từ địa chỉ xưởng — lấy phần cuối (vd "tỉnh Phú Thọ") */
    diaDanhXuong() {
      const dc = this.cfg.dia_chi || "";
      // Tách theo dấu phẩy/gạch, lấy phần cuối có "tỉnh" hoặc fallback toàn bộ
      const parts = dc.split(/[,\-]/).map(s => s.trim()).filter(Boolean);
      if (!parts.length) return "";
      const tinh = parts.find(p => /tỉnh|TP|thành phố/i.test(p));
      return tinh || parts[parts.length - 1];
    },
  },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },

    fmtDate(dt) {
      if (!dt) return "";
      const d = new Date(dt);
      if (isNaN(d)) return String(dt);
      const pad = n => String(n).padStart(2, "0");
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    },
    fmtKL(v) {
      if (v == null || v === "") return "";
      return Number(v).toFixed(4);
    },
    pad2(n) { return String(n).padStart(2, "0"); },
    fmtNum2(v) {
      if (v == null || v === "") return "";
      return Number(v).toFixed(2);
    },
    tongKLChu(v) { return volumeToWordsVN(v); },

    /** Build danh sách NCC = các xưởng có mancc_woodsland */
    loadNcc() {
      this.nccList = (this.danhSachXuong || [])
        .filter(x => x.mancc_woodsland && String(x.mancc_woodsland).trim())
        .map(x => {
          const code = String(x.mancc_woodsland).trim();
          return { code, name: x.ten, label: code + " — " + x.ten };
        });
      this.nccOptions = this.nccList;
      if (!this.mancc && this.nccList.length) this.mancc = this.nccList[0].code;
    },
    filterNcc(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.nccOptions = this.nccList.filter(n => n.label.toLowerCase().includes(needle));
      });
    },

    async load() {
      if (!this.mancc) {
        this.$q.notify({ type: "negative", message: "Chọn xưởng xẻ trước", timeout: 4000 });
        return;
      }
      this.loading = true;
      try {
        const { data } = await axios.get(
          `http://${this.host()}:2003/api/v1/phieu-go-xe/list`,
          { params: { thang: this.thang, nam: this.nam, mancc: this.mancc } }
        );
        if (data && data.meta && data.meta.success) {
          this.phieuList = data.data.phieu || [];
          this.selectedIdx = 0;
          if (!this.phieuList.length) {
            this.$q.notify({
              type: "warning",
              message: `T${this.thang}/${this.nam} - "${this.mancc}" chưa có biên bản đã lưu. Vào Ghép Lô Gỗ → Lưu biên bản trước.`,
              timeout: 6000,
            });
          } else {
            this.$q.notify({
              type: "positive",
              message: `Đã tải ${this.phieuList.length} phiếu (${data.data.tong_chi_tiet} dòng)`,
              timeout: 3000,
            });
          }
        } else {
          this.$q.notify({
            type: "negative",
            message: (data && data.meta && data.meta.message) || "Lỗi tải dữ liệu",
            timeout: 6000,
          });
        }
      } catch (err) {
        console.error("[phieu-go-xe/list] error:", err);
        const msg = (err.response && err.response.data && err.response.data.meta && err.response.data.meta.message)
          || err.message || "Lỗi tải dữ liệu";
        this.$q.notify({ type: "negative", message: String(msg), timeout: 6000 });
      } finally {
        this.loading = false;
      }
    },

    printPage() {
      if (!this.currentPhieu) {
        this.$q.notify({ type: "warning", message: "Chưa có phiếu để in", timeout: 3000 });
        return;
      }
      window.print();
    },

    /* ===================== WORD EXPORT ===================== */

    wordEsc(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },

    wordCss() {
      return `<style>
        @page Section1 { size: 21cm 29.7cm; margin: 1cm 1.1cm 0.8cm 1.1cm; mso-page-orientation: portrait; }
        div.Section1 { page: Section1; }
        body { font-family: "Times New Roman", serif; font-size: 10pt; line-height: 1.2; }
        p { margin: 0 0 1pt 0; }
        .center { text-align: center; }
        .right { text-align: right; }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
        .small { font-size: 8pt; }
        .title { font-size: 13pt; font-weight: bold; text-align: center; margin: 3pt 0 3pt 0; text-transform: uppercase; }
        .section-title { font-weight: bold; margin-top: 3pt; margin-bottom: 1pt; }
        table.head { width: 100%; border-collapse: collapse; margin-bottom: 2pt; }
        table.head td { vertical-align: top; padding: 0 4pt; font-size: 9pt; line-height: 1.15; }
        table.info { width: 100%; border-collapse: collapse; margin: 2pt 0; }
        table.info td { padding: 1pt 3pt; vertical-align: top; font-size: 10pt; line-height: 1.2; }
        table.info td.lbl { font-weight: bold; white-space: nowrap; width: 18%; }
        table.tbl { border-collapse: collapse; width: 100%; margin: 2pt 0; }
        table.tbl th, table.tbl td { border: 1px solid #333; padding: 1pt 3pt; font-size: 9pt; text-align: center; vertical-align: middle; line-height: 1.15; }
        table.tbl th { background: #F0F0F0; font-weight: bold; }
        table.tbl td.num { text-align: right; }
        table.tbl tr.total-row td { font-weight: bold; }
        table.tbl-source { border-collapse: collapse; margin: 1pt 0 1pt 10pt; }
        table.tbl-source td { padding: 0 12pt 0 0; font-size: 9pt; text-align: left; white-space: nowrap; border: none; line-height: 1.15; }
        .indent { margin-left: 14pt; }
        table.head-2col td { width: 50%; vertical-align: top; }
        table.sign-3col { width: 100%; margin-top: 6pt; border-collapse: collapse; }
        table.sign-3col td { width: 33.3%; text-align: center; vertical-align: top; padding: 0 4pt; }
        table.sign-2col { width: 100%; margin-top: 4pt; border-collapse: collapse; }
        table.sign-2col td { width: 50%; text-align: center; vertical-align: top; padding: 0 4pt; }
        .sign-title { font-weight: bold; }
        .sign-space { height: 36pt; }
        .sign-name { font-weight: bold; font-style: italic; }
        .pgbreak { page-break-before: always; }
      </style>`;
    },

    /** Word: 1 phiếu NKTP (1 trang) */
    wordNKTP(p, cfg) {
      const e = this.wordEsc.bind(this);
      const rows = (p.chi_tiet || []).map((d, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>Gỗ keo xẻ FSC 100%</td>
          <td>${e(d.chu_rung || "")}</td>
          <td>${e(d.lo_go_tron || "")}</td>
          <td>${e(d.lo_go_xe || "")}</td>
          <td>${e(d.dt_day || "")}</td>
          <td>${e(d.dt_rong || "")}</td>
          <td>${e(d.dt_cao || "")}</td>
          <td>${e(d.tong_thanh || "")}</td>
          <td class="num">${this.fmtKL(d.kl_m3)}</td>
          <td></td>
        </tr>`).join("");
      const tong = this.fmtKL(p.tong_kl);
      return `
        <table class="head">
          <tr>
            <td class="bold">${e(cfg.ten || "")}</td>
            <td class="right small italic">BM: ${e(cfg.bm_nhap_kho || "CoC")}<br/>Ngày BH: ${e(cfg.ngay_ban_hanh || "___")} — Lần BH: ${e(cfg.lan_ban_hanh || "___")}</td>
          </tr>
          <tr><td colspan="2">Địa chỉ: ${e(cfg.dia_chi || "")}</td></tr>
          <tr><td colspan="2">Số chứng chỉ: <b>${e(cfg.chung_chi || "")}</b>. Hiệu lực: <b>${e(cfg.hieu_luc_cc || "")}</b></td></tr>
        </table>
        <p class="title">PHIẾU NHẬP KHO THÀNH PHẨM</p>
        <table class="info">
          <tr>
            <td class="lbl">Số phiếu:</td><td class="bold">${e(p.SOPHIEU)}</td>
            <td class="right">☑ P.Tươi &nbsp; ☐ P.Khô &nbsp; ☐ T/c</td>
          </tr>
          <tr>
            <td class="lbl">Tên thành phẩm:</td><td>Gỗ keo xẻ FSC 100%</td>
            <td class="right">☑ FSC 100% &nbsp; ☐ Mix &nbsp; ☐ Non FSC &nbsp; ☐ CW &nbsp; ☐ KLS</td>
          </tr>
          <tr><td class="lbl">Nhập tại kho:</td><td colspan="2">${e(cfg.ten || "")}</td></tr>
          <tr><td class="lbl">Loài gỗ:</td><td colspan="2">Keo tai tượng (Acacia mangium)</td></tr>
        </table>
        <table class="tbl">
          <thead>
            <tr>
              <th rowspan="2">STT</th><th rowspan="2">Tên TP</th><th rowspan="2">Tên chủ rừng</th>
              <th rowspan="2">Số lô gỗ tròn</th><th rowspan="2">Số lô gỗ xẻ</th>
              <th colspan="3">Quy cách (mm)</th>
              <th rowspan="2">Số thanh</th><th rowspan="2">KL (m³)</th><th rowspan="2">Ghi chú</th>
            </tr>
            <tr><th>Dày</th><th>Rộng</th><th>Dài</th></tr>
          </thead>
          <tbody>
            ${rows}
            <tr class="total-row"><td colspan="9">TỔNG</td><td class="num">${tong}</td><td></td></tr>
          </tbody>
        </table>
        <p>Ngày nhập: <b>${e(this.fmtDate(p.CREATED_AT))}</b> &nbsp;&nbsp; Biển số xe: <b>${e(p.BIENSOXE || "")}</b></p>
        <table class="sign-3col">
          <tr><td class="sign-title">Người giao hàng</td><td class="sign-title">Thủ kho</td><td class="sign-title">Giám đốc</td></tr>
          <tr><td class="sign-space"></td><td class="sign-space"></td><td class="sign-space"></td></tr>
        </table>`;
    },

    /** Word: 1 phiếu XK (1 trang) */
    wordXK(p, cfg) {
      const e = this.wordEsc.bind(this);
      const rows = (p.chi_tiet || []).map((d, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${e(d.chu_rung || "")}</td>
          <td>${e(d.lo_go_tron || "")}</td>
          <td>${e(d.lo_go_xe || "")}</td>
          <td>Gỗ keo xẻ FSC 100%</td>
          <td>m³</td>
          <td>${e(d.dt_day || "")}</td>
          <td>${e(d.dt_rong || "")}</td>
          <td>${e(d.dt_cao || "")}</td>
          <td>${e(d.tong_thanh || "")}</td>
          <td class="num">${this.fmtKL(d.kl_m3)}</td>
          <td></td>
        </tr>`).join("");
      const tong = this.fmtKL(p.tong_kl);
      return `
        <table class="head">
          <tr><td class="bold">${e(cfg.ten || "")}</td></tr>
          <tr><td>Địa chỉ: ${e(cfg.dia_chi || "")}</td></tr>
          <tr><td>Số chứng chỉ: <b>${e(cfg.chung_chi || "")}</b>. Hiệu lực: <b>${e(cfg.hieu_luc_cc || "")}</b></td></tr>
        </table>
        <p class="title">PHIẾU XUẤT KHO</p>
        <table class="info">
          <tr><td class="lbl">Tên khách hàng:</td><td colspan="2">${e(this.WL.ten)}</td></tr>
          <tr><td class="lbl">Số chứng chỉ:</td><td colspan="2">${e(this.WL.chung_chi)} — Hiệu lực: ${e(this.WL.hieu_luc)}</td></tr>
          <tr>
            <td class="lbl">Loại gỗ:</td><td>Keo tai tượng (Acacia mangium)</td>
            <td class="right">Số phiếu: <b>${e(p.SOPHIEU)}</b></td>
          </tr>
          <tr>
            <td class="lbl">Trạng thái MT:</td><td>FSC 100%</td>
            <td class="right">Ngày xuất: <b>${e(this.fmtDate(p.CREATED_AT))}</b></td>
          </tr>
          <tr><td class="lbl">Biển số xe:</td><td colspan="2"><b>${e(p.BIENSOXE || "")}</b></td></tr>
        </table>
        <table class="tbl">
          <thead>
            <tr>
              <th rowspan="2">TT</th><th rowspan="2">Tên chủ rừng</th>
              <th rowspan="2">Mã lô gỗ tròn</th><th rowspan="2">Mã lô gỗ xẻ</th>
              <th rowspan="2">Tên SP</th><th rowspan="2">ĐVT</th>
              <th colspan="3">Quy cách (mm)</th>
              <th rowspan="2">Số lượng<br/>(thanh)</th><th rowspan="2">KL (m³)</th><th rowspan="2">Ghi chú</th>
            </tr>
            <tr><th>Dày</th><th>Rộng</th><th>Dài</th></tr>
          </thead>
          <tbody>
            ${rows}
            <tr class="total-row"><td colspan="10">TỔNG</td><td class="num">${tong}</td><td></td></tr>
          </tbody>
        </table>
        <table class="sign-3col">
          <tr><td class="sign-title">Người lập phiếu</td><td class="sign-title">Thủ kho</td><td class="sign-title">Giám đốc</td></tr>
          <tr><td class="sign-space"></td><td class="sign-space"></td><td class="sign-space"></td></tr>
        </table>`;
    },

    /** Word: 1 phiếu BKLS (1 trang) — đúng mẫu file go_xe.xlsx sheet BKLS */
    wordBKLS(p, cfg) {
      const e = this.wordEsc.bind(this);
      const soBKLS = `${p.SOPHIEU}/${this.nam}/BKLS`;
      const dt = p.CREATED_AT ? new Date(p.CREATED_AT) : new Date();
      const tong = this.fmtKL(p.tong_kl);
      const tongChu = volumeToWordsVN(p.tong_kl);
      const tongThanh = (p.chi_tiet || []).reduce((s, d) => s + (Number(d.tong_thanh) || 0), 0);

      // Group lo_go_tron + chu_rung
      const seenNG = new Set();
      const nguonGoc = [];
      (p.chi_tiet || []).forEach(d => {
        const k = (d.lo_go_tron || "") + "|" + (d.chu_rung || "");
        if (seenNG.has(k)) return;
        seenNG.add(k);
        const diaChi = [d.thon, d.xa, d.huyen].filter(Boolean).join(", ");
        nguonGoc.push({ so_bkls: d.so_bkls, chu_rung: d.chu_rung, lo: d.lo, khoang: d.khoang, dia_chi: diaChi });
      });
      const seenKT = new Set();
      const loKT = [];
      (p.chi_tiet || []).forEach(d => {
        if (!d.kd && !d.vd) return;
        const k = (d.kd || "") + "|" + (d.vd || "");
        if (seenKT.has(k)) return;
        seenKT.add(k);
        loKT.push({ kd: d.kd, vd: d.vd });
      });
      const seenLX = new Set();
      const loGoXe = [];
      (p.chi_tiet || []).forEach(d => {
        if (d.lo_go_xe && !seenLX.has(d.lo_go_xe)) {
          seenLX.add(d.lo_go_xe); loGoXe.push(d.lo_go_xe);
        }
      });

      // Địa danh xưởng
      const dc = cfg.dia_chi || "";
      const parts = dc.split(/[,\-]/).map(s => s.trim()).filter(Boolean);
      const diaDanh = parts.find(s => /tỉnh|TP|thành phố/i.test(s)) || (parts[parts.length - 1] || "");
      const ngayChu = `${diaDanh}, ngày ${String(dt.getDate()).padStart(2, "0")} tháng ${String(dt.getMonth() + 1).padStart(2, "0")} năm ${dt.getFullYear()}`;

      const ngRows = nguonGoc.map(g => `
        <tr>
          <td>Số BKLS: <b>${e(g.so_bkls || "………")}</b></td>
          <td>Chủ rừng: <b>${e(g.chu_rung || "………")}</b></td>
          <td>Lô <b>${e(g.lo || "…")}</b> khoảng <b>${e(g.khoang || "…")}</b></td>
          <td>Địa chỉ: <b>${e(g.dia_chi || "………")}</b></td>
        </tr>`).join("");
      const ktRows = loKT.map(g => `
        <tr>
          <td>KĐ: <b>${e(g.kd || "………")}</b></td>
          <td>VĐ: <b>${e(g.vd || "………")}</b></td>
          <td></td><td></td>
        </tr>`).join("");
      const lxLines = loGoXe.map(lx => `<p class="indent"><b>${e(lx)}</b></p>`).join("");

      return `
        <table class="head head-2col">
          <tr>
            <td class="bold center">${e(cfg.ten || "")}</td>
            <td class="bold center">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</td>
          </tr>
          <tr>
            <td class="center">-------</td>
            <td class="italic center">Độc lập - Tự do - Hạnh phúc</td>
          </tr>
          <tr>
            <td></td>
            <td class="center">---------------</td>
          </tr>
          <tr>
            <td>Số(1): <b>${e(soBKLS)}</b></td>
            <td class="right">Tờ số(2): <b>01</b> &nbsp; Tổng số tờ: <b>01</b></td>
          </tr>
        </table>
        <p class="title">BẢNG KÊ LÂM SẢN</p>

        <p class="section-title">1. Thông tin chủ lâm sản:</p>
        <p>- Tên chủ lâm sản(4): <b>${e(cfg.ten || "")}</b></p>
        <p>- Số GCN/MSDN/GPTL/ĐKHĐ/CMND/HC(5): <b>${e(cfg.mst || "")}</b></p>
        <p>- Địa chỉ(6): <b>${e(cfg.dia_chi || "")}</b></p>
        <p>- Số điện thoại: <b>${e(cfg.sdt || "")}</b>, Địa chỉ Email: <b>${e(cfg.email || "…………………………")}</b></p>
        <p>- Số chứng chỉ: <b>${e(cfg.chung_chi || "")}</b>. Hiệu lực chứng chỉ: <b>${e(cfg.hieu_luc_cc || "")}</b>.</p>

        <p class="section-title">2. Thông tin tổ chức, cá nhân mua/nhận chuyển giao quyền sở hữu:</p>
        <p>- Tên tổ chức, cá nhân(4): <b>${e(this.WL.ten)}</b></p>
        <p>- Số GCN/MSDN/GPTL/ĐKHĐ/CMND/HC(5): <b>${e(this.WL.mst)}</b></p>
        <p>- Địa chỉ(6): <b>${e(this.WL.dia_chi)}</b></p>
        <p>- Số chứng chỉ: <b>${e(this.WL.chung_chi)}</b>. Hiệu lực chứng chỉ: <b>${e(this.WL.hieu_luc)}</b>.</p>

        <p class="section-title">3. Thông tin về lâm sản:</p>
        <p>- Tên loài: <b>Gỗ keo xẻ FSC 100% Keo tai tượng (Acacia mangium)</b></p>
        <p>- Nhóm loài: Thông thường</p>
        <p>- Nguồn gốc(7): Số BKLS gốc + tên chủ rừng + lô khoảnh + địa chỉ</p>
        <table class="tbl-source">${ngRows}</table>
        <p>- Mã HS (áp dụng đối với lâm sản nhập khẩu, xuất khẩu): …………………</p>
        <p>- Giá trị (nếu có): ……………………………………………………………</p>
        <p>- Khối lượng/trọng lượng: <b>${tong}</b> M³ &nbsp; Bằng chữ: <b>${e(tongChu)}</b>.</p>
        <p>- Số lượng: <b>${tongThanh}</b> &nbsp; Đơn vị tính: <b>Thanh</b></p>
        <p>- Thông tin về lô khai thác(8):</p>
        <table class="tbl-source">${ktRows}</table>
        <p>- Thông tin khác có liên quan (nếu có): Số lô gỗ xẻ</p>
        ${lxLines}

        <p class="section-title">4. Thông tin chi tiết tại Bảng kê khai kèm theo:</p>
        <p class="italic small">(Áp dụng đối với gỗ nguyên liệu, sản phẩm gỗ: khai thác từ rừng tự nhiên trong nước, gỗ và sản phẩm gỗ nhập khẩu, gỗ và sản phẩm gỗ sau xử lý tịch thu)</p>

        <p class="section-title">5. Thông tin vận chuyển:</p>
        <p>Phương tiện vận chuyển, biển số xe: <b>${e(p.BIENSOXE || "")}</b></p>
        <p>Thời gian vận chuyển: <b>01 ngày</b>; Từ ngày: <b>${e(this.fmtDate(p.CREATED_AT))}</b> &nbsp; Đến ngày: <b>${e(this.fmtDate(p.CREATED_AT))}</b></p>
        <p>Vận chuyển từ: <b>${e(cfg.ten || "")}</b> &nbsp; Đến: <b>${e(this.WL.ten)}</b></p>
        <p>Địa chỉ: <b>${e(cfg.dia_chi || "")}</b> &nbsp; <b>${e(this.WL.dia_chi)}</b></p>

        <p class="section-title">6. Hồ sơ kèm theo (nếu có):</p>

        <p class="italic">Chúng tôi/Tôi cam kết những nội dung kê khai trong bảng kê này là đúng sự thật và chịu trách nhiệm trước pháp luật về sự trung thực của thông tin đã kê khai.</p>

        <table class="sign-2col">
          <tr>
            <td class="right italic">……, ngày … tháng …… năm 20……</td>
            <td class="right italic"><b>${e(ngayChu)}</b></td>
          </tr>
          <tr>
            <td class="sign-title">XÁC NHẬN CỦA CƠ QUAN CÓ THẨM QUYỀN (9)</td>
            <td class="sign-title">TỔ CHỨC/CÁ NHÂN LẬP BẢNG KÊ</td>
          </tr>
          <tr>
            <td class="small italic">Vào sổ số: …/…<br/>(Người có thẩm quyền ký, ghi rõ họ tên, đóng dấu)</td>
            <td class="small italic">(Ký, ghi rõ họ tên, đóng dấu đối với tổ chức)</td>
          </tr>
          <tr>
            <td class="sign-space"></td>
            <td class="sign-space"></td>
          </tr>
          <tr>
            <td></td>
            <td class="sign-name">${e(cfg.nguoi_dai_dien || "")}</td>
          </tr>
        </table>`;
    },

    async exportAllWord() {
      if (!this.phieuList.length) {
        this.$q.notify({ type: "warning", message: "Chưa có dữ liệu để xuất", timeout: 4000 });
        return;
      }
      this.exportingWord = true;
      try {
        const cfg = this.cfg;
        const parts = [];
        this.phieuList.forEach((p, i) => {
          if (i > 0) parts.push('<br clear="all" class="pgbreak"/>');
          parts.push(this.wordNKTP(p, cfg));
          parts.push('<br clear="all" class="pgbreak"/>');
          parts.push(this.wordXK(p, cfg));
          parts.push('<br clear="all" class="pgbreak"/>');
          parts.push(this.wordBKLS(p, cfg));
        });
        const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"/>${this.wordCss()}</head><body><div class="Section1">${parts.join("")}</div></body></html>`;
        const blob = new Blob(["﻿" + html], { type: "application/msword;charset=utf-8" });
        const fname = `PhieuGoXe_${(this.mancc || "XX").replace(/[^\p{L}\p{N}]+/gu, "_")}_T${this.thang}_${this.nam}.doc`;
        saveAs(blob, fname);
        this.$q.notify({
          type: "positive",
          message: `Đã xuất ${this.phieuList.length} phiếu × 3 mẫu = ${this.phieuList.length * 3} trang`,
          timeout: 5000,
        });
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: "negative", message: "Lỗi Word: " + (err.message || err), timeout: 6000 });
      } finally {
        this.exportingWord = false;
      }
    },

    /* ===================== EXCEL EXPORT (4 sheets) ===================== */

    bThin() {
      return {
        top: { style: "thin" }, bottom: { style: "thin" },
        left: { style: "thin" }, right: { style: "thin" },
      };
    },
    setCell(ws, addr, value, opts = {}) {
      if (opts.merge) ws.mergeCells(`${addr}:${opts.merge}`);
      const cell = ws.getCell(addr);
      cell.value = value;
      const font = { name: "Times New Roman", size: opts.size || 11 };
      if (opts.bold) font.bold = true;
      if (opts.italic) font.italic = true;
      cell.font = font;
      cell.alignment = {
        horizontal: opts.center ? "center" : (opts.right ? "right" : "left"),
        vertical: "middle",
        wrapText: opts.wrap !== false,
      };
      if (opts.border) cell.border = this.bThin();
      if (opts.numFmt) cell.numFmt = opts.numFmt;
      return cell;
    },

    /** Sheet NL — Biên bản nghiệm thu xẻ tươi (BM.COC.01-b) */
    buildSheetNL(wb, cfg) {
      const ws = wb.addWorksheet("NL", {
        pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1,
          margins: { left: 0.4, right: 0.4, top: 0.4, bottom: 0.4 } },
      });
      ws.columns = [{ width: 6 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 10 },
        { width: 10 }, { width: 10 }, { width: 14 }, { width: 16 }];
      let r = 1;
      for (const p of this.phieuList) {
        r = this.buildBlockNL(ws, p, cfg, r);
        ws.getRow(r - 1).addPageBreak();
        r += 1;
      }
    },
    buildBlockNL(ws, p, cfg, start) {
      let r = start;
      this.setCell(ws, `A${r}`, "SỔ TAY COC", { merge: `D${r}`, bold: true });
      this.setCell(ws, `E${r}`, "BM.COC.01-b", { merge: `I${r}`, right: true, italic: true });
      r++;
      this.setCell(ws, `A${r}`, "BIÊN BẢN NGHIỆM THU XẺ TƯƠI (Kiêm phiếu nhập kho)",
        { merge: `I${r}`, bold: true, center: true, size: 13 });
      r += 2;
      this.setCell(ws, `A${r}`, `Đơn vị giao hàng: ${cfg.ten || ""}`, { merge: `E${r}` });
      this.setCell(ws, `F${r}`, `Số phiếu: ${p.SOPHIEU}`, { merge: `I${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, `Địa chỉ: ${cfg.dia_chi || ""}`, { merge: `E${r}` });
      this.setCell(ws, `F${r}`, `Biển số xe: ${p.BIENSOXE || ""}`, { merge: `I${r}` });
      r++;
      this.setCell(ws, `A${r}`, `Kho nhập: ${cfg.ten || ""}`, { merge: `E${r}` });
      this.setCell(ws, `F${r}`, `Ngày nhập: ${this.fmtDate(p.CREATED_AT)}`, { merge: `I${r}` });
      r += 2;

      // Header bảng
      const hdr = ws.getRow(r);
      ["STT", "Dày", "Rộng", "Dài", "Số bó", "Số thanh/bó", "Tổng thanh", "KL (m³)", "Ghi chú"]
        .forEach((t, i) => {
          const c = hdr.getCell(i + 1);
          c.value = t;
          c.font = { name: "Times New Roman", size: 10, bold: true };
          c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
          c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0E0E0" } };
          c.border = this.bThin();
        });
      r++;
      (p.chi_tiet || []).forEach((d, i) => {
        const row = ws.getRow(r);
        [i + 1, d.dt_day, d.dt_rong, d.dt_cao, d.SOBO, d.SOTHANH_BO, d.tong_thanh,
          d.kl_m3 ? Number(d.kl_m3) : 0, d.lo_go_xe || ""].forEach((v, ci) => {
            const c = row.getCell(ci + 1);
            c.value = v;
            c.font = { name: "Times New Roman", size: 10 };
            c.alignment = { horizontal: ci === 8 ? "left" : "center", vertical: "middle" };
            c.border = this.bThin();
            if (ci === 7) c.numFmt = "#,##0.0000";
          });
        r++;
      });
      // Tổng
      const totalRow = ws.getRow(r);
      this.setCell(ws, `A${r}`, "TỔNG", { merge: `G${r}`, bold: true, center: true, border: true });
      const cTotal = totalRow.getCell(8);
      cTotal.value = Number(p.tong_kl) || 0;
      cTotal.numFmt = "#,##0.0000";
      cTotal.font = { name: "Times New Roman", size: 10, bold: true };
      cTotal.border = this.bThin();
      cTotal.alignment = { horizontal: "center", vertical: "middle" };
      totalRow.getCell(9).border = this.bThin();
      r += 2;
      this.setCell(ws, `A${r}`, "Đại diện giao hàng", { merge: `C${r}`, center: true, bold: true });
      this.setCell(ws, `D${r}`, "Thủ kho", { merge: `F${r}`, center: true, bold: true });
      this.setCell(ws, `G${r}`, "QC kiểm tra", { merge: `I${r}`, center: true, bold: true });
      r += 4;
      return r + 1;
    },

    /** Sheet NKTP HKP */
    buildSheetNKTP(wb, cfg) {
      const ws = wb.addWorksheet("NKTP", {
        pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1,
          margins: { left: 0.4, right: 0.4, top: 0.4, bottom: 0.4 } },
      });
      ws.columns = [{ width: 5 }, { width: 16 }, { width: 16 }, { width: 14 }, { width: 16 },
        { width: 7 }, { width: 7 }, { width: 7 }, { width: 9 }, { width: 11 }, { width: 11 }];
      let r = 1;
      for (const p of this.phieuList) {
        r = this.buildBlockNKTP(ws, p, cfg, r);
        ws.getRow(r - 1).addPageBreak();
        r += 1;
      }
    },
    buildBlockNKTP(ws, p, cfg, start) {
      let r = start;
      this.setCell(ws, `A${r}`, cfg.ten || "", { merge: `H${r}`, bold: true });
      this.setCell(ws, `I${r}`, `BM: ${cfg.bm_nhap_kho || "CoC"}`, { merge: `K${r}`, right: true, italic: true });
      r++;
      this.setCell(ws, `A${r}`, `Địa Chỉ: ${cfg.dia_chi || ""}`, { merge: `H${r}` });
      this.setCell(ws, `I${r}`, `Ngày BH: ${cfg.ngay_ban_hanh || ""} — Lần BH: ${cfg.lan_ban_hanh || ""}`,
        { merge: `K${r}`, right: true, italic: true, size: 10 });
      r++;
      this.setCell(ws, `A${r}`, `Số chứng chỉ: ${cfg.chung_chi || ""}. Hiệu lực: ${cfg.hieu_luc_cc || ""}`,
        { merge: `K${r}` });
      r += 2;
      this.setCell(ws, `A${r}`, "PHIẾU NHẬP KHO THÀNH PHẨM",
        { merge: `K${r}`, bold: true, center: true, size: 14 });
      r += 2;
      this.setCell(ws, `A${r}`, `Số phiếu: ${p.SOPHIEU}`, { merge: `D${r}`, bold: true });
      this.setCell(ws, `E${r}`, "☑ P.Tươi   ☐ P.Khô   ☐ T/c", { merge: `K${r}`, right: true });
      r++;
      this.setCell(ws, `A${r}`, "Tên thành phẩm: Gỗ keo xẻ FSC 100%", { merge: `D${r}` });
      this.setCell(ws, `E${r}`, "☑ FSC 100%   ☐ Mix   ☐ Non FSC   ☐ CW   ☐ KLS",
        { merge: `K${r}`, right: true });
      r++;
      this.setCell(ws, `A${r}`, `Nhập tại kho: ${cfg.ten || ""}`, { merge: `K${r}` });
      r++;
      this.setCell(ws, `A${r}`, "Loài gỗ: Keo tai tượng (Acacia mangium)", { merge: `K${r}` });
      r += 2;

      // Header
      const hdrTexts = ["STT", "Tên TP", "Tên chủ rừng", "Số lô gỗ tròn", "Số lô gỗ xẻ",
        "Dày", "Rộng", "Dài", "Số thanh", "KL (m³)", "Ghi chú"];
      const hdr = ws.getRow(r);
      hdrTexts.forEach((t, i) => {
        const c = hdr.getCell(i + 1);
        c.value = t;
        c.font = { name: "Times New Roman", size: 10, bold: true };
        c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0E0E0" } };
        c.border = this.bThin();
      });
      r++;
      (p.chi_tiet || []).forEach((d, i) => {
        const row = ws.getRow(r);
        [i + 1, "Gỗ keo xẻ FSC 100%", d.chu_rung || "", d.lo_go_tron || "", d.lo_go_xe || "",
          d.dt_day, d.dt_rong, d.dt_cao, d.tong_thanh,
          d.kl_m3 ? Number(d.kl_m3) : 0, ""].forEach((v, ci) => {
            const c = row.getCell(ci + 1);
            c.value = v;
            c.font = { name: "Times New Roman", size: 10 };
            c.alignment = { horizontal: ci >= 5 && ci <= 9 ? "center" : "left", vertical: "middle", wrapText: true };
            c.border = this.bThin();
            if (ci === 9) c.numFmt = "#,##0.0000";
          });
        r++;
      });
      this.setCell(ws, `A${r}`, "TỔNG", { merge: `I${r}`, bold: true, center: true, border: true });
      const cT = ws.getRow(r).getCell(10);
      cT.value = Number(p.tong_kl) || 0;
      cT.numFmt = "#,##0.0000";
      cT.font = { name: "Times New Roman", size: 10, bold: true };
      cT.border = this.bThin();
      cT.alignment = { horizontal: "center", vertical: "middle" };
      ws.getRow(r).getCell(11).border = this.bThin();
      r += 2;
      this.setCell(ws, `A${r}`, `Ngày nhập: ${this.fmtDate(p.CREATED_AT)}   Biển số xe: ${p.BIENSOXE || ""}`,
        { merge: `K${r}` });
      r += 2;
      this.setCell(ws, `A${r}`, "Người giao hàng", { merge: `C${r}`, center: true, bold: true });
      this.setCell(ws, `D${r}`, "Thủ kho", { merge: `G${r}`, center: true, bold: true });
      this.setCell(ws, `H${r}`, "Giám đốc", { merge: `K${r}`, center: true, bold: true });
      r += 4;
      return r + 1;
    },

    /** Sheet XK — Phiếu xuất kho */
    buildSheetXK(wb, cfg) {
      const ws = wb.addWorksheet("XK", {
        pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1,
          margins: { left: 0.4, right: 0.4, top: 0.4, bottom: 0.4 } },
      });
      ws.columns = [{ width: 5 }, { width: 16 }, { width: 16 }, { width: 18 }, { width: 16 },
        { width: 5 }, { width: 7 }, { width: 7 }, { width: 7 }, { width: 9 }, { width: 11 }, { width: 11 }];
      let r = 1;
      for (const p of this.phieuList) {
        r = this.buildBlockXK(ws, p, cfg, r);
        ws.getRow(r - 1).addPageBreak();
        r += 1;
      }
    },
    buildBlockXK(ws, p, cfg, start) {
      let r = start;
      this.setCell(ws, `A${r}`, cfg.ten || "", { merge: `L${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, `Địa Chỉ: ${cfg.dia_chi || ""}`, { merge: `L${r}` });
      r++;
      this.setCell(ws, `A${r}`, `Số chứng chỉ: ${cfg.chung_chi || ""}. Hiệu lực: ${cfg.hieu_luc_cc || ""}`,
        { merge: `L${r}` });
      r += 2;
      this.setCell(ws, `A${r}`, "PHIẾU XUẤT KHO",
        { merge: `L${r}`, bold: true, center: true, size: 14 });
      r += 2;
      this.setCell(ws, `A${r}`, `Tên khách hàng: ${this.WL.ten}`, { merge: `L${r}` });
      r++;
      this.setCell(ws, `A${r}`, `Số chứng chỉ: ${this.WL.chung_chi} — Hiệu lực: ${this.WL.hieu_luc}`,
        { merge: `L${r}` });
      r++;
      this.setCell(ws, `A${r}`, "Loại gỗ: Keo tai tượng (Acacia mangium)", { merge: `H${r}` });
      this.setCell(ws, `I${r}`, `Số phiếu: ${p.SOPHIEU}`, { merge: `L${r}`, bold: true, right: true });
      r++;
      this.setCell(ws, `A${r}`, "Trạng thái MT: FSC 100%", { merge: `H${r}` });
      this.setCell(ws, `I${r}`, `Ngày xuất: ${this.fmtDate(p.CREATED_AT)}`, { merge: `L${r}`, right: true });
      r++;
      this.setCell(ws, `A${r}`, `Biển số xe: ${p.BIENSOXE || ""}`, { merge: `L${r}`, bold: true });
      r += 2;

      const hdrTexts = ["TT", "Tên chủ rừng", "Mã lô gỗ tròn", "Mã lô gỗ xẻ", "Tên sản phẩm",
        "ĐVT", "Dày", "Rộng", "Dài", "Số lượng (thanh)", "KL (m³)", "Ghi chú"];
      const hdr = ws.getRow(r);
      hdrTexts.forEach((t, i) => {
        const c = hdr.getCell(i + 1);
        c.value = t;
        c.font = { name: "Times New Roman", size: 10, bold: true };
        c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0E0E0" } };
        c.border = this.bThin();
      });
      r++;
      (p.chi_tiet || []).forEach((d, i) => {
        const row = ws.getRow(r);
        [i + 1, d.chu_rung || "", d.lo_go_tron || "", d.lo_go_xe || "", "Gỗ keo xẻ FSC 100%",
          "m³", d.dt_day, d.dt_rong, d.dt_cao, d.tong_thanh,
          d.kl_m3 ? Number(d.kl_m3) : 0, ""].forEach((v, ci) => {
            const c = row.getCell(ci + 1);
            c.value = v;
            c.font = { name: "Times New Roman", size: 10 };
            c.alignment = { horizontal: ci >= 5 && ci <= 10 ? "center" : "left", vertical: "middle", wrapText: true };
            c.border = this.bThin();
            if (ci === 10) c.numFmt = "#,##0.0000";
          });
        r++;
      });
      this.setCell(ws, `A${r}`, "TỔNG", { merge: `J${r}`, bold: true, center: true, border: true });
      const cT = ws.getRow(r).getCell(11);
      cT.value = Number(p.tong_kl) || 0;
      cT.numFmt = "#,##0.0000";
      cT.font = { name: "Times New Roman", size: 10, bold: true };
      cT.border = this.bThin();
      cT.alignment = { horizontal: "center", vertical: "middle" };
      ws.getRow(r).getCell(12).border = this.bThin();
      r += 2;
      this.setCell(ws, `A${r}`, "Người lập phiếu", { merge: `D${r}`, center: true, bold: true });
      this.setCell(ws, `E${r}`, "Thủ kho", { merge: `H${r}`, center: true, bold: true });
      this.setCell(ws, `I${r}`, "Giám đốc", { merge: `L${r}`, center: true, bold: true });
      r += 4;
      return r + 1;
    },

    /** Sheet BKLS */
    buildSheetBKLS(wb, cfg) {
      const ws = wb.addWorksheet("BKLS", {
        pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1,
          margins: { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5 } },
      });
      ws.columns = [{ width: 6 }, { width: 18 }, { width: 18 }, { width: 16 },
        { width: 18 }, { width: 9 }, { width: 11 }];
      let r = 1;
      for (const p of this.phieuList) {
        r = this.buildBlockBKLS(ws, p, cfg, r);
        ws.getRow(r - 1).addPageBreak();
        r += 1;
      }
    },
    buildBlockBKLS(ws, p, cfg, start) {
      let r = start;
      const dt = p.CREATED_AT ? new Date(p.CREATED_AT) : new Date();
      const tongThanh = (p.chi_tiet || []).reduce((s, d) => s + (Number(d.tong_thanh) || 0), 0);

      // Group nguồn gốc, lô khai thác, lô gỗ xẻ
      const seenNG = new Set(); const nguonGoc = [];
      const seenKT = new Set(); const loKT = [];
      const seenLX = new Set(); const loGoXe = [];
      (p.chi_tiet || []).forEach(d => {
        const k1 = (d.lo_go_tron || "") + "|" + (d.chu_rung || "");
        if (!seenNG.has(k1)) {
          seenNG.add(k1);
          const diaChi = [d.thon, d.xa, d.huyen].filter(Boolean).join(", ");
          nguonGoc.push({ so_bkls: d.so_bkls, chu_rung: d.chu_rung, lo: d.lo, khoang: d.khoang, dia_chi: diaChi });
        }
        if ((d.kd || d.vd)) {
          const k2 = (d.kd || "") + "|" + (d.vd || "");
          if (!seenKT.has(k2)) { seenKT.add(k2); loKT.push({ kd: d.kd, vd: d.vd }); }
        }
        if (d.lo_go_xe && !seenLX.has(d.lo_go_xe)) { seenLX.add(d.lo_go_xe); loGoXe.push(d.lo_go_xe); }
      });
      const dc = cfg.dia_chi || "";
      const parts = dc.split(/[,\-]/).map(s => s.trim()).filter(Boolean);
      const diaDanh = parts.find(s => /tỉnh|TP|thành phố/i.test(s)) || (parts[parts.length - 1] || "");

      // === Header 2 cột ===
      this.setCell(ws, `A${r}`, cfg.ten || "", { merge: `C${r}`, bold: true, center: true });
      this.setCell(ws, `D${r}`, "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", { merge: `G${r}`, bold: true, center: true });
      r++;
      this.setCell(ws, `A${r}`, "-------", { merge: `C${r}`, center: true });
      this.setCell(ws, `D${r}`, "Độc lập - Tự do - Hạnh phúc", { merge: `G${r}`, italic: true, center: true });
      r++;
      this.setCell(ws, `D${r}`, "---------------", { merge: `G${r}`, center: true });
      r++;
      this.setCell(ws, `A${r}`, `Số(1): ${p.SOPHIEU}/${this.nam}/BKLS`, { merge: `C${r}` });
      this.setCell(ws, `D${r}`, "Tờ số(2): 01    Tổng số tờ: 01", { merge: `G${r}`, right: true });
      r += 2;
      this.setCell(ws, `A${r}`, "BẢNG KÊ LÂM SẢN",
        { merge: `G${r}`, bold: true, center: true, size: 14 });
      r += 2;

      // === Mục 1 ===
      this.setCell(ws, `A${r}`, "1. Thông tin chủ lâm sản", { merge: `G${r}`, bold: true });
      r++;
      [
        `- Tên chủ lâm sản: ${cfg.ten || ""}`,
        `- Số GCN/MSDN/GPTL/ĐKHĐ/CMND/HC: ${cfg.mst || ""}`,
        `- Địa chỉ: ${cfg.dia_chi || ""}`,
        `- Số điện thoại: ${cfg.sdt || ""}, Địa chỉ Email: ${cfg.email || "…………"}`,
        `- Số chứng chỉ: ${cfg.chung_chi || ""}. Hiệu lực chứng chỉ: ${cfg.hieu_luc_cc || ""}.`,
      ].forEach(line => { this.setCell(ws, `A${r}`, line, { merge: `G${r}` }); r++; });
      r++;

      // === Mục 2 ===
      this.setCell(ws, `A${r}`, "2. Thông tin tổ chức cá nhân mua:", { merge: `G${r}`, bold: true });
      r++;
      [
        `- Tên: ${this.WL.ten}`,
        `- Số GCN/MSDN/GPTL/ĐKHĐ/CMND/HC: ${this.WL.mst}`,
        `- Địa chỉ: ${this.WL.dia_chi}`,
        `- Số chứng chỉ: ${this.WL.chung_chi}. Hiệu lực chứng chỉ: ${this.WL.hieu_luc}.`,
      ].forEach(line => { this.setCell(ws, `A${r}`, line, { merge: `G${r}` }); r++; });
      r++;

      // === Mục 3 ===
      this.setCell(ws, `A${r}`, "3. Thông tin về lâm sản:", { merge: `G${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, "- Tên loài: Gỗ keo xẻ FSC 100% Keo tai tượng (Acacia mangium)", { merge: `G${r}` });
      r++;
      this.setCell(ws, `A${r}`, "- Nhóm loài: Thông thường", { merge: `G${r}` });
      r++;
      this.setCell(ws, `A${r}`, "- Nguồn gốc(7): Số BKLS gốc + tên chủ rừng + lô khoảnh + địa chỉ", { merge: `G${r}` });
      r++;
      // Nguồn gốc — 1 dòng / 1 lô (4 cột: BKLS | Chủ rừng | Lô khoảng | Địa chỉ)
      nguonGoc.forEach(g => {
        this.setCell(ws, `A${r}`, `Số BKLS: ${g.so_bkls || "………"}`, { merge: `B${r}` });
        this.setCell(ws, `C${r}`, `Chủ rừng: ${g.chu_rung || "………"}`);
        this.setCell(ws, `D${r}`, `Lô ${g.lo || "…"} khoảng ${g.khoang || "…"}`);
        this.setCell(ws, `E${r}`, `Địa chỉ: ${g.dia_chi || "………"}`, { merge: `G${r}` });
        r++;
      });
      this.setCell(ws, `A${r}`, "- Mã HS (áp dụng đối với lâm sản nhập khẩu, xuất khẩu): …………………", { merge: `G${r}` });
      r++;
      this.setCell(ws, `A${r}`, "- Giá trị (nếu có): ……………………………………………………………", { merge: `G${r}` });
      r++;
      this.setCell(ws, `A${r}`, `- Khối lượng/trọng lượng: ${this.fmtKL(p.tong_kl)} M³  Bằng chữ: ${volumeToWordsVN(p.tong_kl)}.`,
        { merge: `G${r}` });
      r++;
      this.setCell(ws, `A${r}`, `- Số lượng: ${tongThanh}  Đơn vị tính: Thanh`, { merge: `G${r}` });
      r++;
      this.setCell(ws, `A${r}`, "- Thông tin về lô khai thác(8):", { merge: `G${r}` });
      r++;
      loKT.forEach(g => {
        this.setCell(ws, `A${r}`, "", { merge: `B${r}` });
        this.setCell(ws, `C${r}`, `KĐ: ${g.kd || "………"}`);
        this.setCell(ws, `D${r}`, `VĐ: ${g.vd || "………"}`, { merge: `G${r}` });
        r++;
      });
      this.setCell(ws, `A${r}`, "- Thông tin khác có liên quan (nếu có): Số lô gỗ xẻ", { merge: `G${r}` });
      r++;
      loGoXe.forEach(lx => {
        this.setCell(ws, `B${r}`, lx, { merge: `G${r}`, bold: true });
        r++;
      });
      r++;

      // === Mục 4 ===
      this.setCell(ws, `A${r}`, "4. Thông tin chi tiết tại Bảng kê khai kèm theo:", { merge: `G${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`,
        "(Áp dụng đối với gỗ nguyên liệu, sản phẩm gỗ: khai thác từ rừng tự nhiên trong nước, gỗ và sản phẩm gỗ nhập khẩu, gỗ và sản phẩm gỗ sau xử lý tịch thu)",
        { merge: `G${r}`, italic: true, size: 10 });
      r++;

      // === Mục 5 ===
      this.setCell(ws, `A${r}`, "5. Thông tin vận chuyển", { merge: `G${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, `Phương tiện vận chuyển, biển số xe: ${p.BIENSOXE || ""}`, { merge: `G${r}` });
      r++;
      this.setCell(ws, `A${r}`,
        `Thời gian vận chuyển: 01 ngày;  Từ ngày: ${this.fmtDate(p.CREATED_AT)}  Đến ngày: ${this.fmtDate(p.CREATED_AT)}`,
        { merge: `G${r}` });
      r++;
      this.setCell(ws, `A${r}`, `Vận chuyển từ: ${cfg.ten || ""}  Đến: ${this.WL.ten}`, { merge: `G${r}` });
      r++;
      this.setCell(ws, `A${r}`, `Địa chỉ: ${cfg.dia_chi || ""}   ${this.WL.dia_chi}`, { merge: `G${r}` });
      r++;

      // === Mục 6 ===
      this.setCell(ws, `A${r}`, "6. Hồ sơ kèm theo (nếu có):", { merge: `G${r}`, bold: true });
      r += 2;

      this.setCell(ws, `A${r}`,
        "Chúng tôi/Tôi cam kết những nội dung kê khai trong bảng kê này là đúng sự thật và chịu trách nhiệm trước pháp luật về sự trung thực của thông tin đã kê khai.",
        { merge: `G${r}`, italic: true });
      r += 2;

      // Date + ký
      this.setCell(ws, `A${r}`, "……, ngày … tháng …… năm 20……", { merge: `C${r}`, right: true, italic: true });
      this.setCell(ws, `D${r}`,
        `${diaDanh}, ngày ${String(dt.getDate()).padStart(2, "0")} tháng ${String(dt.getMonth() + 1).padStart(2, "0")} năm ${dt.getFullYear()}`,
        { merge: `G${r}`, right: true, italic: true, bold: true });
      r++;
      this.setCell(ws, `A${r}`, "XÁC NHẬN CỦA CƠ QUAN CÓ THẨM QUYỀN (9)", { merge: `C${r}`, center: true, bold: true });
      this.setCell(ws, `D${r}`, "TỔ CHỨC/CÁ NHÂN LẬP BẢNG KÊ", { merge: `G${r}`, center: true, bold: true });
      r++;
      this.setCell(ws, `A${r}`, "Vào sổ số: …/…  (Người có thẩm quyền ký, ghi rõ họ tên, đóng dấu)",
        { merge: `C${r}`, center: true, italic: true, size: 10 });
      this.setCell(ws, `D${r}`, "(Ký, ghi rõ họ tên, đóng dấu đối với tổ chức)",
        { merge: `G${r}`, center: true, italic: true, size: 10 });
      r += 4;
      this.setCell(ws, `D${r}`, cfg.nguoi_dai_dien || "", { merge: `G${r}`, center: true, italic: true, bold: true });
      r += 2;
      return r + 1;
    },

    async exportAllExcel() {
      if (!this.phieuList.length) {
        this.$q.notify({ type: "warning", message: "Chưa có dữ liệu để xuất", timeout: 4000 });
        return;
      }
      this.exportingExcel = true;
      try {
        const cfg = this.cfg;
        const wb = new ExcelJS.Workbook();
        this.buildSheetNL(wb, cfg);
        this.buildSheetNKTP(wb, cfg);
        this.buildSheetXK(wb, cfg);
        this.buildSheetBKLS(wb, cfg);

        const buf = await wb.xlsx.writeBuffer();
        const fname = `PhieuGoXe_${(this.mancc || "XX").replace(/[^\p{L}\p{N}]+/gu, "_")}_T${this.thang}_${this.nam}.xlsx`;
        saveAs(
          new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
          fname
        );
        this.$q.notify({
          type: "positive",
          message: `Đã xuất Excel 4 sheet (NL, NKTP, XK, BKLS) cho ${this.phieuList.length} phiếu`,
          timeout: 5000,
        });
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: "negative", message: "Lỗi Excel: " + (err.message || err), timeout: 6000 });
      } finally {
        this.exportingExcel = false;
      }
    },
  },
};
</script>

<style scoped>
/* ===== Preview phiếu trên web ===== */
.phieu-form {
  font-family: "Times New Roman", serif;
  font-size: 12px;
  line-height: 1.45;
  max-width: 900px;
  margin: 0 auto;
  border: 1px solid #ccc;
  padding: 18px 24px;
  background: #fff;
  color: #000;
}
.phieu-form .head { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
.phieu-form .head td { vertical-align: top; padding: 2px 4px; font-size: 11px; }
.phieu-form .title {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  margin: 8px 0;
}
.phieu-form .info-2col { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
.phieu-form .info-2col td { padding: 3px 4px; vertical-align: top; }
.phieu-form .info-2col td.lbl { font-weight: bold; white-space: nowrap; width: 18%; }
.phieu-form .info-2col td.val { width: 32%; }
.phieu-form .info-bottom { margin: 6px 0; font-size: 12px; }
.phieu-form .tbl {
  width: 100%;
  border-collapse: collapse;
  margin: 6px 0;
}
.phieu-form .tbl th, .phieu-form .tbl td {
  border: 1px solid #333;
  padding: 3px 5px;
  text-align: center;
  font-size: 11px;
  vertical-align: middle;
}
.phieu-form .tbl th { background: #f0f0f0; font-weight: bold; }
.phieu-form .tbl td.num { text-align: right; }
.phieu-form .tbl tr.total-row td { font-weight: bold; background: #fafafa; }
.phieu-form .sign-3col,
.phieu-form .sign-2col { width: 100%; margin-top: 16px; border-collapse: collapse; }
.phieu-form .sign-3col td { width: 33.3%; text-align: center; vertical-align: top; padding: 0 4px; }
.phieu-form .sign-2col td { width: 50%; text-align: center; vertical-align: top; padding: 0 4px; }
.phieu-form .sign-title { font-weight: bold; }
.phieu-form .sign-space { height: 55px; }
.phieu-form .sign-name { font-weight: bold; font-style: italic; padding-top: 4px; }
.phieu-form .bold { font-weight: bold; }
.phieu-form .italic { font-style: italic; }
.phieu-form .center { text-align: center; }
.phieu-form .right { text-align: right; }
.phieu-form .small { font-size: 10px; }
.phieu-form .section-title { font-weight: bold; margin-top: 8px; margin-bottom: 2px; }
.phieu-form.bkls { font-size: 12px; line-height: 1.45; }
.phieu-form.bkls p { margin: 0 0 3px 0; }
.phieu-form.bkls .indent { margin-left: 18px; }
.phieu-form.bkls .tbl-source {
  width: auto;
  border-collapse: collapse;
  margin: 4px 0 4px 12px;
}
.phieu-form.bkls .tbl-source td {
  border: none;
  padding: 1px 12px 1px 0;
  text-align: left;
  font-size: 11px;
  white-space: nowrap;
}
.phieu-form .head-2col td { width: 50%; }
.w50 { width: 50%; }

/* ===== Print ===== */
@media print {
  .no-print { display: none !important; }
  .q-page { padding: 0 !important; }
  .print-area { margin: 0; }
  .phieu-form {
    border: none;
    max-width: 100%;
    padding: 0;
    margin: 0;
  }
  @page { size: A4 portrait; margin: 12mm; }
}
</style>
