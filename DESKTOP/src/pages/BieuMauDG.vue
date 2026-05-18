<template>
  <q-page padding>
    <div class="text-h5 q-mb-md no-print">Biểu mẫu đánh giá NCC (Nguồn gốc gỗ)</div>

    <!-- Toolbar -->
    <div class="row q-col-gutter-md items-end q-mb-md no-print">
      <div class="col-auto">
        <q-select v-model="thang" :options="thangOptions" emit-value map-options label="Tháng" filled dense style="width:140px" />
      </div>
      <div class="col-auto">
        <q-select v-model="nam" :options="namOptions" emit-value map-options label="Năm" filled dense style="width:120px" />
      </div>
      <div class="col-auto">
        <q-select v-model="xuongXe" :options="xuongSelectOptions" emit-value map-options label="Xưởng xẻ" filled dense style="min-width:280px" @input="applyXuong" />
      </div>
      <div class="col-auto">
        <q-select v-model="selectedLo" :options="loOptions" option-label="_label" label="Chọn chủ rừng" filled dense style="min-width:380px" @input="onSelectLo" />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="search" label="Tải" @click="load" :loading="loading" />
      </div>
      <div class="col-auto">
        <q-input v-model="ngayDG" type="date" label="Ngày đánh giá" filled dense style="width:170px" />
      </div>
      <div class="col-auto">
        <q-btn-toggle
          v-model="viewMode"
          :options="[
            { label: 'DM giấy tờ', value: 'dm' },
            { label: 'BM-01', value: 'bm01' },
            { label: 'BM-03', value: 'bm03' },
            { label: 'BM-05', value: 'bm05' },
            { label: 'Tất cả', value: 'all' },
          ]"
          color="grey-4" text-color="black" toggle-color="primary" dense
        />
      </div>
      <div class="col-auto">
        <q-btn color="secondary" icon="print" label="In" @click="printPage" :disable="!lo" />
      </div>
      <div class="col-auto">
        <q-btn color="green-7" icon="file_download" label="Xuất Excel (1 sheet/hộ)"
          @click="exportExcel" :disable="!loList.length" :loading="exporting" />
      </div>
      <div class="col-auto">
        <q-btn color="blue-7" icon="description" label="Xuất Word (1 file)"
          @click="exportWord" :disable="!loList.length" :loading="exporting" />
      </div>
    </div>

    <!-- ===== Mẫu 1: DM giấy tờ NGG ===== -->
    <div v-if="lo && (viewMode === 'dm' || viewMode === 'all')" class="print-area">
      <div class="bm-form">
        <div class="bm-header-row">
          <div class="left">
            <div class="company">{{ xuongTen }}</div>
            <div class="addr italic">{{ xuongDiaChi }}</div>
          </div>
          <div class="right">
            <div>{{ bmCode('DM') }}</div>
            <div class="italic">BH ngày {{ ngayBanHanh }}</div>
            <div class="italic">BH lần {{ lanBanHanh }}</div>
          </div>
        </div>

        <div class="bm-title">DANH MỤC GIẤY TỜ NGUỒN GỐC GỖ</div>
        <div class="bm-date italic">Ngày {{ ngayDGFmt.ngay }} tháng {{ ngayDGFmt.thang }} năm {{ ngayDGFmt.nam }}</div>

        <div class="bm-info q-mt-md">
          <div><b>Tên nhà cung cấp gỗ:</b> {{ lo.ten_ho }}</div>
          <div><b>Địa chỉ:</b> {{ diaChi }}</div>
          <div><b>Điện thoại:</b> ……………………………………… <b>Fax:</b> ………………………</div>
          <div><b>Số chứng nhận chứng chỉ:</b> {{ lo.chung_chi || '…………' }}</div>
        </div>

        <div class="bm-info q-mt-sm">
          <div><b>Loại nguyên liệu:</b></div>
          <div class="check-row"><span class="chk on">✓</span> Gỗ keo tròn - keo tai tượng (Acacia mangium) &nbsp;&nbsp; <span class="chk on">✓</span> FSC 100%</div>
          <div class="check-row"><span class="chk">○</span> Gỗ keo xẻ &nbsp;&nbsp; <span class="chk">○</span> Non-FSC</div>
          <div class="check-row"><span class="chk">○</span> Chi tiết đã sơ chế</div>
        </div>

        <div class="bm-section q-mt-sm">1. Kiểm tra các hồ sơ gồm:</div>
        <table class="bm-table">
          <thead>
            <tr><th style="width:40px">STT</th><th>Hạng mục kiểm tra</th><th style="width:70px">Có</th><th style="width:70px">Không</th><th style="width:140px">Ghi chú</th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in dmItems" :key="'dm'+i">
              <td class="center">{{ i + 1 }}</td>
              <td>{{ item.label }}</td>
              <td class="center">{{ item.co ? '✓' : '' }}</td>
              <td class="center">{{ item.co ? '' : '✓' }}</td>
              <td>{{ item.ghi_chu || '' }}</td>
            </tr>
          </tbody>
        </table>

        <div class="bm-section q-mt-sm">2. Kết luận:</div>
        <div class="bm-text indent"><span class="chk on">✓</span> Đạt</div>
        <div class="bm-text indent"><span class="chk">○</span> NCC bổ sung chứng từ</div>
        <div class="bm-text indent"><span class="chk">○</span> Không đạt</div>

        <div class="sign-area q-mt-md">
          <div class="sign-col">
            <div class="sign-title">Nhân viên đánh giá</div>
            <div class="sign-space"></div>
            <div class="sign-name">………………………</div>
          </div>
          <div class="sign-col">
            <div class="sign-title">{{ xuongTen }}</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ xuongNguoiDD || '………………………' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Mẫu 2: BM-01 Biên bản làm việc với NCC ===== -->
    <div v-if="lo && (viewMode === 'bm01' || viewMode === 'all')" class="print-area" :class="{ 'pa-break': viewMode === 'all' }">
      <div class="bm-form">
        <div class="bm-header-row">
          <div class="left">
            <div class="company">{{ xuongTen }}</div>
            <div class="addr italic">{{ xuongDiaChi }}</div>
          </div>
          <div class="right">
            <div>{{ bmCode('BM01') }}</div>
            <div class="italic">BH ngày {{ ngayBanHanh }}</div>
            <div class="italic">BH lần {{ lanBanHanh }}</div>
          </div>
        </div>

        <div class="bm-title">BIÊN BẢN LÀM VIỆC NHÀ CUNG CẤP</div>

        <div class="bm-info q-mt-md">
          <div><b>1. Tên nhà cung cấp gỗ:</b> {{ lo.ten_ho }}</div>
          <div><b>2. Địa chỉ:</b> {{ diaChi }}</div>
          <div><b>3. Điện thoại:</b> ……………………………… <b>Fax:</b> ………………………</div>
        </div>

        <table class="bm-table q-mt-sm">
          <thead>
            <tr><th style="width:40px">TT</th><th>Nội dung làm việc</th><th>Đánh giá / Nhận xét</th></tr>
          </thead>
          <tbody>
            <tr>
              <td class="center">1</td>
              <td>
                <div>Các nội dung làm việc với nhà cung cấp:</div>
                <div class="q-mt-xs">- Hộ gia đình thuộc nhóm chứng chỉ rừng: <b>{{ lo.nhom_chung_chi || 'Nam Phát – Định Hóa' }}</b></div>
                <div>- Số chứng nhận chứng chỉ: <b>{{ lo.chung_chi || '…………' }}</b></div>
                <div>- CCCD: <b>{{ lo.cccd || '………………' }}</b></div>
              </td>
              <td>Sau khi trao đổi và kiểm tra thông tin, nhà cung cấp đáp ứng các điều kiện về nguồn gốc gỗ hợp pháp, có chứng chỉ FSC còn hiệu lực.</td>
            </tr>
            <tr>
              <td class="center">2</td>
              <td>
                <div><b>Khu vực khai thác:</b> {{ diaChi }}</div>
                <div v-for="(lot, li) in (lo.lo_list || [])" :key="'bm01l'+li" class="q-mt-xs">
                  - Diện tích: <b>{{ fmtNum(lot.dien_tich) }} ha</b>; &nbsp;
                  Khoảnh: <b>{{ lot.khoanh || '…' }}</b>; &nbsp;
                  Lô: <b>{{ lot.lo || '…' }}</b>; &nbsp;
                  Năm trồng: <b>{{ lot.nam_trong || '…' }}</b>
                </div>
                <div class="q-mt-xs">- Đất sử dụng lâu dài, trồng gỗ keo tai tượng (Acacia mangium).</div>
              </td>
              <td>Kết luận: Đây là nguồn nhập đủ điều kiện. Đề nghị triển khai ký hợp đồng & nhập gỗ.</td>
            </tr>
          </tbody>
        </table>

        <div class="bm-date q-mt-md italic">Ngày {{ ngayDGFmt.ngay }} tháng {{ ngayDGFmt.thang }} năm {{ ngayDGFmt.nam }}</div>

        <div class="sign-area q-mt-sm">
          <div class="sign-col">
            <div class="sign-title">Đại diện nhà cung cấp</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ lo.ten_ho }}</div>
          </div>
          <div class="sign-col">
            <div class="sign-title">{{ xuongTen }}</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ xuongNguoiDD || '………………………' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Mẫu 3: BM-03 Phiếu đánh giá giấy tờ nguồn gốc gỗ ===== -->
    <div v-if="lo && (viewMode === 'bm03' || viewMode === 'all')" class="print-area" :class="{ 'pa-break': viewMode === 'all' }">
      <div class="bm-form">
        <div class="bm-header-row">
          <div class="left">
            <div class="company">{{ xuongTen }}</div>
            <div class="addr italic">{{ xuongDiaChi }}</div>
          </div>
          <div class="right">
            <div>{{ bmCode('BM03') }}</div>
            <div class="italic">BH ngày {{ ngayBanHanh }}</div>
            <div class="italic">BH lần {{ lanBanHanh }}</div>
          </div>
        </div>

        <div class="bm-title">PHIẾU ĐÁNH GIÁ GIẤY TỜ NGUỒN GỐC GỖ</div>
        <div class="bm-date center italic">Ngày {{ ngayDGFmt.ngay }} tháng {{ ngayDGFmt.thang }} năm {{ ngayDGFmt.nam }} (trước ngày ký hợp đồng)</div>

        <div class="bm-info q-mt-md">
          <div><b>Tên nhà cung cấp gỗ:</b> {{ lo.ten_ho }}</div>
          <div><b>Địa chỉ:</b> {{ diaChi }}</div>
          <div><b>Điện thoại:</b> ………………………………</div>
          <div><b>Số chứng nhận chứng chỉ:</b> {{ lo.chung_chi || '…………' }}</div>
        </div>

        <div class="bm-info q-mt-sm">
          <div><b>Loại nguyên liệu:</b></div>
          <div class="check-row"><span class="chk on">✓</span> Gỗ keo tròn - keo tai tượng (Acacia mangium) &nbsp;&nbsp; <span class="chk on">✓</span> FSC 100%</div>
          <div class="check-row"><span class="chk">○</span> Gỗ keo xẻ &nbsp;&nbsp; <span class="chk">○</span> Non-FSC</div>
          <div class="check-row"><span class="chk">○</span> Chi tiết</div>
        </div>

        <div class="bm-section q-mt-sm">1. Kiểm tra các hồ sơ gồm:</div>
        <table class="bm-table">
          <thead>
            <tr><th style="width:40px">STT</th><th>Hạng mục kiểm tra</th><th style="width:60px">Có</th><th style="width:60px">Không</th><th style="width:130px">Theo quy định</th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in bm03Items" :key="'bm03'+i">
              <td class="center">{{ i + 1 }}</td>
              <td>{{ item.label }}</td>
              <td class="center">{{ item.co ? '✓' : '' }}</td>
              <td class="center">{{ item.co ? '' : '✓' }}</td>
              <td class="center">{{ item.quy_dinh || '' }}</td>
            </tr>
          </tbody>
        </table>

        <div class="bm-section q-mt-sm">2. Kết luận:</div>
        <div class="bm-text indent"><span class="chk">○</span> Nguồn chấp nhận được (loại A) — đáp ứng hết hồ sơ tối thiểu.</div>
        <div class="bm-text indent"><span class="chk on">✓</span> NCC bổ sung chứng từ trước khi mua (loại B) — đáp ứng phần lớn hồ sơ tối thiểu, còn thiếu một số.</div>
        <div class="bm-text indent"><span class="chk">○</span> Không thể mua (loại C) — thiếu một trong các hồ sơ tối thiểu.</div>

        <div class="sign-area q-mt-md">
          <div class="sign-col">
            <div class="sign-title">Nhân viên đánh giá</div>
            <div class="sign-space"></div>
            <div class="sign-name">………………………</div>
          </div>
          <div class="sign-col">
            <div class="sign-title">{{ xuongTen }}</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ xuongNguoiDD || '………………………' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Mẫu 4: BM-05 Phiếu đánh giá vùng rủi ro nguồn gốc gỗ ===== -->
    <div v-if="lo && (viewMode === 'bm05' || viewMode === 'all')" class="print-area" :class="{ 'pa-break': viewMode === 'all' }">
      <div class="bm-form">
        <div class="bm-header-row">
          <div class="left">
            <div class="company">{{ xuongTen }}</div>
            <div class="addr italic">{{ xuongDiaChi }}</div>
          </div>
          <div class="right">
            <div>{{ bmCode('BM05') }}</div>
            <div class="italic">BH ngày {{ ngayBanHanh }}</div>
            <div class="italic">BH lần {{ lanBanHanh }}</div>
          </div>
        </div>

        <div class="bm-title">PHIẾU ĐÁNH GIÁ VÙNG RỦI RO NGUỒN GỐC GỖ</div>
        <div class="bm-date center italic">Ngày {{ ngayDGFmt.ngay }} tháng {{ ngayDGFmt.thang }} năm {{ ngayDGFmt.nam }} (trước ngày ký hợp đồng)</div>

        <div class="bm-info q-mt-md">
          <div><b>Tên nhà cung cấp gỗ:</b> {{ lo.ten_ho }}</div>
          <div><b>Địa chỉ:</b> {{ diaChi }}</div>
          <div><b>Điện thoại:</b> ………………………………</div>
          <div><b>Số chứng nhận chứng chỉ:</b> {{ lo.chung_chi || '…………' }}</div>
        </div>

        <div class="bm-info q-mt-sm">
          <div><b>Loại nguyên liệu:</b></div>
          <div class="check-row"><span class="chk on">✓</span> Gỗ keo tròn - keo tai tượng (Acacia mangium) &nbsp;&nbsp; <span class="chk on">✓</span> FSC 100%</div>
          <div class="check-row"><span class="chk">○</span> Gỗ keo xẻ &nbsp;&nbsp; <span class="chk">○</span> Non-FSC</div>
        </div>

        <div class="bm-section q-mt-sm">1. Kiểm tra hồ sơ nguồn gốc gỗ</div>
        <div class="bm-text indent"><b>Khu vực khai thác:</b> {{ diaChi }}</div>

        <table class="bm-table q-mt-sm">
          <thead>
            <tr><th style="width:40px">STT</th><th>Hạng mục kiểm tra</th><th style="width:60px">Cao</th><th style="width:60px">Thấp</th><th style="width:200px">Công cụ kiểm tra</th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in bm05Items" :key="'bm05'+i">
              <td class="center">{{ i + 1 }}</td>
              <td>{{ item.label }}</td>
              <td class="center">{{ item.cao ? '✓' : '' }}</td>
              <td class="center">{{ item.cao ? '' : '✓' }}</td>
              <td>{{ item.cong_cu || '' }}</td>
            </tr>
          </tbody>
        </table>

        <div class="bm-section q-mt-sm">2. Kết luận:</div>
        <table class="bm-table" style="max-width:400px">
          <thead><tr><th></th><th style="width:80px">Cao</th><th style="width:80px">Thấp</th></tr></thead>
          <tbody>
            <tr><td>Gỗ mua có rủi ro</td><td class="center"></td><td class="center">✓</td></tr>
          </tbody>
        </table>

        <div class="sign-area q-mt-md">
          <div class="sign-col">
            <div class="sign-title">Nhân viên đánh giá</div>
            <div class="sign-space"></div>
            <div class="sign-name">………………………</div>
          </div>
          <div class="sign-col">
            <div class="sign-title">{{ xuongTen }}</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ xuongNguoiDD || '………………………' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!lo && !loading" class="text-center text-grey-5 q-mt-xl no-print">
      Chọn Tháng / Năm / Xưởng → Tải → Chọn chủ rừng để xem 4 biểu mẫu đánh giá NCC
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import xuongXeMixin from "../mixins/xuongXeMixin";

export default {
  mixins: [xuongXeMixin],
  data() {
    return {
      thang: 1,
      nam: new Date().getFullYear(),
      thangOptions: Array.from({ length: 12 }, (_, i) => ({ label: "Tháng " + (i + 1), value: i + 1 })),
      namOptions: (() => {
        const cur = new Date().getFullYear();
        return Array.from({ length: 6 }, (_, i) => {
          const y = cur - 2 + i;
          return { label: String(y), value: y };
        });
      })(),
      loading: false,
      exporting: false,
      loList: [],
      loOptions: [],
      selectedLo: null,
      lo: null,
      xuongXe: "",
      viewMode: "all",
      xuongTen: "",
      xuongDiaChi: "",
      xuongNguoiDD: "",
      xuongBmPrefix: "QT11/HD-02",   // prefix mã form, lookup từ xưởng nếu có
      ngayBanHanh: "10.2.2022",
      lanBanHanh: "02",
      ngayDG: this.todayIso(),
      // 4 biểu mẫu — checklist mẫu
      dmItems: [
        { label: "BM-NL01: Biên bản làm việc với NCC", co: true },
        { label: "BM-NL-02: Đánh giá năng lực NCC", co: false },
        { label: "BM-NL-03: Đánh giá giấy tờ nguồn gốc NCC", co: true },
        { label: "BM-NL-05: Phiếu đánh giá vùng rủi ro nguồn gốc gỗ", co: true },
        { label: "Chứng chỉ FSC-CoC của NCC — Bản sao", co: true },
        { label: "Giấy phép khai thác của chủ rừng", co: true },
        { label: "Hồ sơ thiết kế khai thác (Chủ rừng là tổ chức)", co: true },
        { label: "Bảng kê lâm sản khai thác", co: true },
        { label: "Chứng minh quyền sử dụng đất", co: true },
        { label: "Chứng minh thư hoặc sổ hộ khẩu (chủ rừng là cá nhân)", co: true },
        { label: "PL 02", co: true },
        { label: "Biên bản kiểm tra của kiểm lâm — Bản sao", co: false },
        { label: "Hóa đơn tài chính — Bản sao (nếu có)", co: false },
        { label: "Phiếu thu / biên lai nộp thuế phí khai thác", co: false },
        { label: "Bảng kê thu mua hàng hóa không có hóa đơn", co: true },
        { label: "Giấy biên nhận tiền / Chứng từ thanh toán", co: true },
        { label: "Bảng kê Lâm sản", co: true },
        { label: "Các hợp đồng mua bán gỗ của các bên trong chuỗi", co: true },
      ],
      bm03Items: [
        { label: "Bản sao chứng chỉ FSC-CoC của NCC còn hiệu lực", co: true, quy_dinh: "Tối thiểu" },
        { label: "Tuân thủ các yêu cầu luật pháp quốc gia về khai thác", co: true, quy_dinh: "Tối thiểu" },
        { label: "Nguồn gốc từ các hoạt động lâm nghiệp xung đột", co: false, quy_dinh: "Tối thiểu" },
        { label: "Nguồn gốc gỗ từ các khu rừng có giá trị bảo tồn cao (HCV)", co: false, quy_dinh: "Tối thiểu" },
        { label: "Nguồn gốc từ các khu rừng được chuyển đổi sang rừng trồng / mục đích khác", co: false, quy_dinh: "Tối thiểu" },
        { label: "Nguồn gốc từ các khu rừng trồng cây biến đổi gen", co: false, quy_dinh: "Tối thiểu" },
        { label: "Bản sao giấy phép khai thác của chủ rừng", co: true, quy_dinh: "Tối thiểu" },
        { label: "Bản sao biên bản kiểm tra của kiểm lâm", co: false, quy_dinh: "" },
        { label: "Bản sao các hợp đồng mua bán gỗ của các bên", co: true, quy_dinh: "" },
        { label: "Bản sao tờ khai hải quan (nếu là gỗ nhập khẩu)", co: false, quy_dinh: "Tối thiểu" },
        { label: "Giấy phép vận chuyển (áp dụng cho gỗ nhập khẩu)", co: false, quy_dinh: "" },
        { label: "Bản sao Bill of Lading (nếu là gỗ nhập khẩu)", co: false, quy_dinh: "Tối thiểu" },
        { label: "Bản sao Chứng nhận xuất xứ (C/O)", co: false, quy_dinh: "Tối thiểu" },
      ],
      bm05Items: [
        { label: "Nguồn gốc từ các khu rừng khai thác trái phép", cao: false, cong_cu: "Giấy phép khai thác" },
        { label: "Nguồn gốc từ các khu rừng nguyên sinh / HCV", cao: false, cong_cu: "" },
        { label: "Nguồn gốc từ các hoạt động lâm nghiệp xung đột", cao: false, cong_cu: "" },
        { label: "Nguồn gốc từ các khu rừng được chuyển đổi sang mục đích khác", cao: false, cong_cu: "Giấy xác nhận đất không tranh chấp" },
        { label: "Nguồn gốc từ các khu rừng trồng cây biến đổi gen", cao: false, cong_cu: "" },
        { label: "Không có các nguồn cung bị áp dụng biện pháp trừng phạt thương mại", cao: false, cong_cu: "" },
      ],
    };
  },
  computed: {
    diaChi() {
      if (!this.lo) return "";
      return this.lo.dia_chi_cccd || [this.lo.thon, this.lo.xa].filter(Boolean).join(", ");
    },
    ngayDGFmt() {
      if (!this.ngayDG) return { ngay: "…", thang: "…", nam: this.nam };
      const parts = this.ngayDG.split("-");
      return { ngay: parseInt(parts[2]), thang: parseInt(parts[1]), nam: parseInt(parts[0]) };
    },
  },
  async created() { await this.loadXuongXe(); },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },
    fmtNum(v) { return v == null ? "0.00" : Number(v).toFixed(2); },
    todayIso() {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    },
    bmCode(loai) {
      const prefix = this.xuongBmPrefix || "QT11/HD-02";
      const suffix = { DM: "BM-00", BM01: "BM-01", BM03: "BM-04", BM05: "BM-05" }[loai] || "BM";
      return `${prefix}/${suffix}`;
    },
    applyXuong() {
      const cfg = this.getXuongConfig(this.xuongXe);
      this.xuongTen = cfg.ten || "";
      this.xuongDiaChi = cfg.dia_chi || "";
      this.xuongNguoiDD = cfg.nguoi_dai_dien || "";
      this.ngayBanHanh = cfg.ngay_ban_hanh || "10.2.2022";
      this.lanBanHanh = cfg.lan_ban_hanh || "02";
    },
    async load() {
      if (!this.xuongXe) {
        this.$q.notify({ type: "warning", message: "Vui lòng chọn xưởng xẻ" });
        return;
      }
      this.loading = true;
      this.selectedLo = null;
      this.lo = null;
      try {
        const { data } = await axios.get(`http://${this.host()}:2003/api/v1/hop-dong/danh-sach`, {
          params: { thang: this.thang, nam: this.nam, xuong_xe: this.xuongXe },
        });
        if (data && data.meta && data.meta.success) {
          this.loList = data.data || [];
          this.loOptions = this.loList.map(l => ({
            ...l,
            _label: `${l.ten_ho} — ${l.xa} (${(l.lo_list || []).length} lô)`,
          }));
          if (!this.loList.length) {
            this.$q.notify({ type: "warning", message: `Không có KH T${this.thang}/${this.nam}` });
          }
        }
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message });
      } finally {
        this.loading = false;
      }
    },
    onSelectLo(item) {
      this.lo = item;
      // Ngày đánh giá = ngay_hop_dong - 1 ngày (nếu KH có)
      if (item && item.ngay_hop_dong) {
        const d = this.parseDateString(item.ngay_hop_dong);
        if (d) {
          d.setDate(d.getDate() - 1);
          this.ngayDG = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        }
      }
    },
    /** Parse "dd/mm/yyyy", "yyyy-mm-dd", "dd-mm-yyyy", "dd.mm.yyyy" hoặc JS Date → Date. */
    parseDateString(raw) {
      if (!raw) return null;
      if (raw instanceof Date) return isNaN(raw.getTime()) ? null : raw;
      const s = String(raw).trim();
      if (!s) return null;
      let m = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
      if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
      m = s.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
      if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    },
    printPage() { window.print(); },

    /* ===================== XUẤT WORD (.doc) — 1 file, mỗi mẫu 1 trang ===================== */

    wordEsc(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },

    wordCss() {
      return `<style>
        @page Section1 { size: 21cm 29.7cm; margin: 1cm 1.2cm 1cm 1.2cm; mso-page-orientation: portrait; }
        div.Section1 { page: Section1; }
        body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.3; }
        p { margin: 0 0 3pt 0; }
        .header-row { display: table; width: 100%; }
        .header-row > div { display: table-cell; vertical-align: top; }
        .h-left { text-align: left; }
        .h-right { text-align: right; font-size: 10pt; font-style: italic; }
        .h-left b { font-weight: bold; }
        .title { font-size: 15pt; font-weight: bold; text-align: center; margin: 8pt 0 4pt 0; }
        .subtitle { font-size: 11pt; font-style: italic; text-align: center; margin-bottom: 6pt; }
        .center { text-align: center; }
        .right { text-align: right; }
        .italic { font-style: italic; }
        .bold { font-weight: bold; }
        .indent { padding-left: 1em; }
        .section { font-weight: bold; margin: 4pt 0 2pt 0; }
        table.tbl { border-collapse: collapse; width: 100%; margin: 4pt 0; }
        table.tbl th, table.tbl td { border: 1px solid #333; padding: 3pt 5pt; vertical-align: top; font-size: 11pt; }
        table.tbl th { background: #F0F0F0; font-weight: bold; text-align: center; }
        table.tbl td.c { text-align: center; }
        .chk { font-weight: bold; }
        .chk-on { color: #1976d2; font-weight: bold; }
        .sign-2col { width: 100%; margin-top: 16pt; }
        .sign-2col td { vertical-align: top; width: 50%; text-align: center; }
        .sign-name { font-weight: bold; margin-top: 40pt; }
        .pgbreak { page-break-before: always; }
        .check-line { padding-left: 1.5em; }
        /* Compact mode cho BM-01 & BM-03 — vừa 1 trang A4 */
        .compact { font-size: 11pt; line-height: 1.15; }
        .compact p { margin: 0 0 1pt 0; }
        .compact .section { margin: 3pt 0 1pt 0; }
        .compact .title { font-size: 13pt; margin: 4pt 0 2pt 0; }
        .compact .subtitle { font-size: 10pt; margin-bottom: 3pt; }
        .compact table.tbl { margin: 2pt 0; }
        .compact table.tbl th, .compact table.tbl td { padding: 2pt 4pt; font-size: 10pt; }
        .compact .check-line { padding-left: 1em; }
        .compact .indent { padding-left: 0.8em; }
        .compact .header-row > div { font-size: 11pt; }
        .compact .h-right { font-size: 9pt; }
        .compact table.sign-2col { margin-top: 8pt; }
        .compact .sign-name { margin-top: 24pt; }
      </style>`;
    },

    /** Block header chung: tên xưởng + form code + BH ngày + BH lần. */
    wordHeader(formCode) {
      const e = this.wordEsc.bind(this);
      return `
        <div class="header-row">
          <div class="h-left">
            <div class="bold">${e(this.xuongTen)}</div>
            <div class="italic" style="font-size:10pt">${e(this.xuongDiaChi)}</div>
          </div>
          <div class="h-right">
            <div class="bold">${e(formCode)}</div>
            <div>BH ngày ${e(this.ngayBanHanh)}</div>
            <div>BH lần ${e(this.lanBanHanh)}</div>
          </div>
        </div>`;
    },

    /** Block thông tin NCC + loại nguyên liệu. */
    wordInfoNCC(lo) {
      const e = this.wordEsc.bind(this);
      const dc = lo.dia_chi_cccd || [lo.thon, lo.xa].filter(Boolean).join(", ");
      return `
        <p><b>Tên nhà cung cấp gỗ:</b> ${e(lo.ten_ho)}</p>
        <p><b>Địa chỉ:</b> ${e(dc)}</p>
        <p><b>Điện thoại:</b> ………………………………… <b>Fax:</b> ………………………</p>
        <p><b>Số chứng nhận chứng chỉ:</b> ${e(lo.chung_chi || "…………")}</p>
        <p class="bold">Loại nguyên liệu:</p>
        <p class="check-line"><span class="chk-on">✓</span> Gỗ keo tròn - keo tai tượng (Acacia mangium) &nbsp;&nbsp; <span class="chk-on">✓</span> FSC 100%</p>
        <p class="check-line"><span class="chk">○</span> Gỗ keo xẻ &nbsp;&nbsp; <span class="chk">○</span> Non-FSC</p>`;
    },

    /** Block ký 2 cột. */
    wordSign(leftTitle, leftName, rightTitle, rightName) {
      const e = this.wordEsc.bind(this);
      return `
        <table class="sign-2col"><tr>
          <td>
            <p class="bold">${e(leftTitle)}</p>
            <p class="sign-name">${e(leftName)}</p>
          </td>
          <td>
            <p class="bold">${e(rightTitle)}</p>
            <p class="sign-name">${e(rightName)}</p>
          </td>
        </tr></table>`;
    },

    /** Mẫu 1: Danh mục giấy tờ NGG */
    wordDM(lo, ngayDt) {
      const e = this.wordEsc.bind(this);
      const rows = this.dmItems.map((it, i) => `
        <tr>
          <td class="c">${i + 1}</td>
          <td>${e(it.label)}</td>
          <td class="c">${it.co ? "✓" : ""}</td>
          <td class="c">${it.co ? "" : "✓"}</td>
          <td>${e(it.ghi_chu || "")}</td>
        </tr>`).join("");
      return `
        ${this.wordHeader(this.bmCode("DM"))}
        <p class="title">DANH MỤC GIẤY TỜ NGUỒN GỐC GỖ</p>
        <p class="subtitle">Ngày ${ngayDt.getDate()} tháng ${ngayDt.getMonth() + 1} năm ${ngayDt.getFullYear()}</p>
        ${this.wordInfoNCC(lo)}
        <p class="section">1. Kiểm tra các hồ sơ gồm:</p>
        <table class="tbl">
          <tr><th style="width:8%">STT</th><th>Hạng mục kiểm tra</th><th style="width:7%">Có</th><th style="width:8%">Không</th><th style="width:18%">Ghi chú</th></tr>
          ${rows}
        </table>
        <p class="section">2. Kết luận:</p>
        <p class="indent"><span class="chk-on">✓</span> Đạt</p>
        <p class="indent"><span class="chk">○</span> NCC bổ sung chứng từ</p>
        <p class="indent"><span class="chk">○</span> Không đạt</p>
        ${this.wordSign("Nhân viên đánh giá", "………………………", this.xuongTen, this.xuongNguoiDD || "………………………")}`;
    },

    /** Mẫu 2: BM-01 Biên bản làm việc NCC */
    wordBM01(lo, ngayDt) {
      const e = this.wordEsc.bind(this);
      const dc = lo.dia_chi_cccd || [lo.thon, lo.xa].filter(Boolean).join(", ");
      const lots = lo.lo_list || [];
      const loRows = lots.map(l =>
        `- Diện tích: <b>${(Number(l.dien_tich) || 0).toFixed(2)} ha</b>; Khoảnh: <b>${e(l.khoanh || "…")}</b>; Lô: <b>${e(l.lo || "…")}</b>; Năm trồng: <b>${e(l.nam_trong || "…")}</b>`
      ).join("<br/>");
      return `<div class="compact">
        ${this.wordHeader(this.bmCode("BM01"))}
        <p class="title">BIÊN BẢN LÀM VIỆC NHÀ CUNG CẤP</p>
        <p><b>1. Tên nhà cung cấp gỗ:</b> ${e(lo.ten_ho)}</p>
        <p><b>2. Địa chỉ:</b> ${e(dc)}</p>
        <p><b>3. Điện thoại:</b> ……………………………… <b>Fax:</b> ………………………</p>
        <table class="tbl">
          <tr><th style="width:6%">TT</th><th>Nội dung làm việc</th><th>Đánh giá / Nhận xét</th></tr>
          <tr>
            <td class="c">1</td>
            <td>
              Các nội dung làm việc với nhà cung cấp:<br/>
              - Hộ gia đình thuộc nhóm chứng chỉ rừng: <b>${e(lo.nhom_chung_chi || "Nam Phát – Định Hóa")}</b><br/>
              - Số chứng nhận chứng chỉ: <b>${e(lo.chung_chi || "…………")}</b><br/>
              - CCCD: <b>${e(lo.cccd || "………………")}</b>
            </td>
            <td>Sau khi trao đổi và kiểm tra thông tin, nhà cung cấp đáp ứng các điều kiện về nguồn gốc gỗ hợp pháp, có chứng chỉ FSC còn hiệu lực.</td>
          </tr>
          <tr>
            <td class="c">2</td>
            <td>
              <b>Khu vực khai thác:</b> ${e(dc)}<br/>
              ${loRows}<br/>
              - Đất sử dụng lâu dài, trồng gỗ keo tai tượng (Acacia mangium).
            </td>
            <td>Kết luận: Đây là nguồn nhập đủ điều kiện. Đề nghị triển khai ký hợp đồng &amp; nhập gỗ.</td>
          </tr>
        </table>
        <p class="italic right">Ngày ${ngayDt.getDate()} tháng ${ngayDt.getMonth() + 1} năm ${ngayDt.getFullYear()}</p>
        ${this.wordSign("Đại diện nhà cung cấp", lo.ten_ho || "", this.xuongTen, this.xuongNguoiDD || "………………………")}
      </div>`;
    },

    /** Mẫu 3: BM-03 Phiếu đánh giá giấy tờ */
    wordBM03(lo, ngayDt) {
      const e = this.wordEsc.bind(this);
      const rows = this.bm03Items.map((it, i) => `
        <tr>
          <td class="c">${i + 1}</td>
          <td>${e(it.label)}</td>
          <td class="c">${it.co ? "✓" : ""}</td>
          <td class="c">${it.co ? "" : "✓"}</td>
          <td class="c">${e(it.quy_dinh || "")}</td>
        </tr>`).join("");
      return `<div class="compact">
        ${this.wordHeader(this.bmCode("BM03"))}
        <p class="title">PHIẾU ĐÁNH GIÁ GIẤY TỜ NGUỒN GỐC GỖ</p>
        <p class="subtitle">Ngày ${ngayDt.getDate()} tháng ${ngayDt.getMonth() + 1} năm ${ngayDt.getFullYear()} (trước ngày ký hợp đồng)</p>
        ${this.wordInfoNCC(lo)}
        <p class="section">1. Kiểm tra các hồ sơ gồm:</p>
        <table class="tbl">
          <tr><th style="width:7%">STT</th><th>Hạng mục kiểm tra</th><th style="width:7%">Có</th><th style="width:8%">Không</th><th style="width:18%">Theo quy định</th></tr>
          ${rows}
        </table>
        <p class="section">2. Kết luận:</p>
        <p class="indent"><span class="chk">○</span> Nguồn chấp nhận được (loại A) — đáp ứng hết hồ sơ tối thiểu.</p>
        <p class="indent"><span class="chk-on">✓</span> NCC bổ sung chứng từ trước khi mua (loại B) — đáp ứng phần lớn hồ sơ tối thiểu, còn thiếu một số.</p>
        <p class="indent"><span class="chk">○</span> Không thể mua (loại C) — thiếu một trong các hồ sơ tối thiểu.</p>
        ${this.wordSign("Nhân viên đánh giá", "………………………", this.xuongTen, this.xuongNguoiDD || "………………………")}
      </div>`;
    },

    /** Mẫu 4: BM-05 Phiếu đánh giá vùng rủi ro */
    wordBM05(lo, ngayDt) {
      const e = this.wordEsc.bind(this);
      const dc = lo.dia_chi_cccd || [lo.thon, lo.xa].filter(Boolean).join(", ");
      const rows = this.bm05Items.map((it, i) => `
        <tr>
          <td class="c">${i + 1}</td>
          <td>${e(it.label)}</td>
          <td class="c">${it.cao ? "✓" : ""}</td>
          <td class="c">${it.cao ? "" : "✓"}</td>
          <td>${e(it.cong_cu || "")}</td>
        </tr>`).join("");
      return `
        ${this.wordHeader(this.bmCode("BM05"))}
        <p class="title">PHIẾU ĐÁNH GIÁ VÙNG RỦI RO NGUỒN GỐC GỖ</p>
        <p class="subtitle">Ngày ${ngayDt.getDate()} tháng ${ngayDt.getMonth() + 1} năm ${ngayDt.getFullYear()} (trước ngày ký hợp đồng)</p>
        ${this.wordInfoNCC(lo)}
        <p class="section">1. Kiểm tra hồ sơ nguồn gốc gỗ</p>
        <p class="indent"><b>Khu vực khai thác:</b> ${e(dc)}</p>
        <table class="tbl">
          <tr><th style="width:7%">STT</th><th>Hạng mục kiểm tra</th><th style="width:8%">Cao</th><th style="width:8%">Thấp</th><th style="width:25%">Công cụ kiểm tra</th></tr>
          ${rows}
        </table>
        <p class="section">2. Kết luận:</p>
        <table class="tbl" style="width:55%">
          <tr><th></th><th style="width:18%">Cao</th><th style="width:18%">Thấp</th></tr>
          <tr><td>Gỗ mua có rủi ro</td><td class="c">○</td><td class="c chk-on">✓</td></tr>
        </table>
        ${this.wordSign("Nhân viên đánh giá", "………………………", this.xuongTen, this.xuongNguoiDD || "………………………")}`;
    },

    /** Xuất 1 file Word: tất cả chủ rừng × 4 mẫu, mỗi mẫu 1 trang A4 portrait. */
    exportWord() {
      if (!this.loList.length) {
        this.$q.notify({ type: "warning", message: "Chưa có dữ liệu — bấm Tải trước" });
        return;
      }
      if (!this.xuongXe) {
        this.$q.notify({ type: "warning", message: "Vui lòng chọn xưởng xẻ" });
        return;
      }
      this.applyXuong();
      this.exporting = true;
      try {
        const parts = [];
        let first = true;
        for (const lo of this.loList) {
          const dt = this.ngayDGForLo(lo);
          const pbFirst = first ? "" : '<br clear="all" class="pgbreak"/>';
          parts.push(pbFirst + this.wordDM(lo, dt));
          parts.push('<br clear="all" class="pgbreak"/>' + this.wordBM01(lo, dt));
          parts.push('<br clear="all" class="pgbreak"/>' + this.wordBM03(lo, dt));
          parts.push('<br clear="all" class="pgbreak"/>' + this.wordBM05(lo, dt));
          first = false;
        }
        const body = parts.join("");
        const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"/>${this.wordCss()}</head><body><div class="Section1">${body}</div></body></html>`;
        const blob = new Blob(["﻿" + html], { type: "application/msword;charset=utf-8" });
        const fname = `BieuMau_DG_${this.xuongXe}_T${this.thang}_${this.nam}`.replace(/[^\p{L}\p{N}_-]+/gu, "_");
        saveAs(blob, fname + ".doc");
        this.$q.notify({
          type: "positive",
          message: `Đã xuất ${this.loList.length} chủ rừng × 4 mẫu = ${this.loList.length * 4} trang vào 1 file Word`,
          timeout: 5000,
        });
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: "negative", message: "Lỗi xuất Word: " + (err.message || err), timeout: 6000 });
      } finally {
        this.exporting = false;
      }
    },

    /* ===================== XUẤT EXCEL ===================== */
    bThin() {
      return { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    },
    setCell(ws, addr, value, opts = {}) {
      if (opts.merge) ws.mergeCells(`${addr}:${opts.merge}`);
      const cell = ws.getCell(addr);
      cell.value = value;
      cell.font = { name: "Times New Roman", size: opts.size || 11, bold: !!opts.bold, italic: !!opts.italic };
      cell.alignment = {
        horizontal: opts.center ? "center" : (opts.right ? "right" : "left"),
        vertical: "middle",
        wrapText: opts.wrap !== false,
      };
      if (opts.border) cell.border = this.bThin();
      if (opts.fill) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: opts.fill } };
      return cell;
    },
    safeSheetName(s, used) {
      const base = (s || "Sheet").replace(/[\\/?*[\]:]/g, "-").trim().slice(0, 31) || "Sheet";
      let candidate = base, i = 1;
      while (used.has(candidate)) {
        const suffix = " (" + (++i) + ")";
        candidate = base.slice(0, 31 - suffix.length) + suffix;
      }
      used.add(candidate);
      return candidate;
    },

    /** Ngày đánh giá cho 1 hộ (ngay_hop_dong - 1 ngày, fallback hôm nay). */
    ngayDGForLo(lo) {
      if (lo && lo.ngay_hop_dong) {
        const d = this.parseDateString(lo.ngay_hop_dong);
        if (d) { d.setDate(d.getDate() - 1); return d; }
      }
      return new Date();
    },

    /** Build header chung (3 rows): tên xưởng + form code + BH ngày + BH lần */
    buildHeader(ws, r, formCode) {
      this.setCell(ws, `A${r}`, this.xuongTen, { merge: `F${r}`, bold: true });
      this.setCell(ws, `G${r}`, formCode, { merge: `J${r}`, right: true, bold: true });
      this.setCell(ws, `A${r + 1}`, this.xuongDiaChi, { merge: `F${r + 1}`, italic: true, size: 10 });
      this.setCell(ws, `G${r + 1}`, `BH ngày ${this.ngayBanHanh}`, { merge: `J${r + 1}`, italic: true, size: 10, right: true });
      this.setCell(ws, `G${r + 2}`, `BH lần ${this.lanBanHanh}`, { merge: `J${r + 2}`, italic: true, size: 10, right: true });
      return r + 3;
    },

    /** Build phần ký 2 cột */
    buildSign(ws, r, leftTitle, leftName, rightTitle, rightName) {
      this.setCell(ws, `A${r}`, leftTitle, { merge: `E${r}`, bold: true, center: true });
      this.setCell(ws, `F${r}`, rightTitle, { merge: `J${r}`, bold: true, center: true });
      r += 4;  // khoảng trống ký
      this.setCell(ws, `A${r}`, leftName, { merge: `E${r}`, bold: true, center: true });
      this.setCell(ws, `F${r}`, rightName, { merge: `J${r}`, bold: true, center: true });
      return r + 2;
    },

    /** Build info NCC (key-value 4 dòng) */
    buildInfoNCC(ws, r, lo) {
      const dc = lo.dia_chi_cccd || [lo.thon, lo.xa].filter(Boolean).join(", ");
      const rows = [
        ["Tên nhà cung cấp gỗ:", lo.ten_ho || ""],
        ["Địa chỉ:", dc],
        ["Điện thoại:", "………………………………… Fax: ………………………"],
        ["Số chứng nhận chứng chỉ:", lo.chung_chi || "…………"],
      ];
      for (const [label, val] of rows) {
        this.setCell(ws, `A${r}`, label, { merge: `C${r}`, bold: true });
        this.setCell(ws, `D${r}`, val, { merge: `J${r}` });
        r++;
      }
      // Loại nguyên liệu
      this.setCell(ws, `A${r}`, "Loại nguyên liệu:", { merge: `J${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, "", { merge: `A${r}` });
      this.setCell(ws, `B${r}`, "Gỗ keo tròn - keo tai tượng (Acacia mangium)", { merge: `F${r}` });
      this.setCell(ws, `G${r}`, "✓", { center: true, bold: true });
      this.setCell(ws, `H${r}`, "FSC 100%", { merge: `I${r}` });
      this.setCell(ws, `J${r}`, "✓", { center: true, bold: true });
      r++;
      this.setCell(ws, `B${r}`, "Gỗ keo xẻ", { merge: `F${r}` });
      this.setCell(ws, `G${r}`, "○", { center: true });
      this.setCell(ws, `H${r}`, "Non-FSC", { merge: `I${r}` });
      this.setCell(ws, `J${r}`, "○", { center: true });
      r++;
      return r;
    },

    /** Build Mẫu 1: DANH MỤC GIẤY TỜ NGUỒN GỐC GỖ */
    buildDM(ws, lo, startRow) {
      let r = this.buildHeader(ws, startRow, this.bmCode("DM"));
      this.setCell(ws, `A${r}`, "DANH MỤC GIẤY TỜ NGUỒN GỐC GỖ", { merge: `J${r}`, bold: true, center: true, size: 14 });
      ws.getRow(r).height = 24;
      r++;
      const dt = this.ngayDGForLo(lo);
      this.setCell(ws, `A${r}`, `Ngày ${dt.getDate()} tháng ${dt.getMonth() + 1} năm ${dt.getFullYear()}`, { merge: `J${r}`, italic: true, center: true });
      r += 2;
      r = this.buildInfoNCC(ws, r, lo);
      r++;
      this.setCell(ws, `A${r}`, "1. Kiểm tra các hồ sơ gồm:", { merge: `J${r}`, bold: true });
      r++;
      // Header table
      const FILL = "FFF0F0F0";
      this.setCell(ws, `A${r}`, "STT", { merge: `A${r}`, center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `B${r}`, "Hạng mục kiểm tra", { merge: `F${r}`, center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `G${r}`, "Có", { center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `H${r}`, "Không", { center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `I${r}`, "Ghi chú", { merge: `J${r}`, center: true, bold: true, border: true, fill: FILL });
      r++;
      this.dmItems.forEach((item, idx) => {
        this.setCell(ws, `A${r}`, idx + 1, { center: true, border: true });
        this.setCell(ws, `B${r}`, item.label, { merge: `F${r}`, border: true });
        this.setCell(ws, `G${r}`, item.co ? "✓" : "", { center: true, border: true });
        this.setCell(ws, `H${r}`, item.co ? "" : "✓", { center: true, border: true });
        this.setCell(ws, `I${r}`, item.ghi_chu || "", { merge: `J${r}`, border: true });
        r++;
      });
      r++;
      this.setCell(ws, `A${r}`, "2. Kết luận:", { merge: `J${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, "✓ Đạt", { merge: `J${r}` });
      r++;
      this.setCell(ws, `A${r}`, "○ NCC bổ sung chứng từ", { merge: `J${r}` });
      r++;
      this.setCell(ws, `A${r}`, "○ Không đạt", { merge: `J${r}` });
      r += 2;
      r = this.buildSign(ws, r, "Nhân viên đánh giá", "………………………", this.xuongTen, this.xuongNguoiDD || "………………………");
      return r;
    },

    /** Build Mẫu 2: BIÊN BẢN LÀM VIỆC NCC */
    buildBM01(ws, lo, startRow) {
      let r = this.buildHeader(ws, startRow, this.bmCode("BM01"));
      this.setCell(ws, `A${r}`, "BIÊN BẢN LÀM VIỆC NHÀ CUNG CẤP", { merge: `J${r}`, bold: true, center: true, size: 14 });
      ws.getRow(r).height = 24;
      r += 2;
      const dc = lo.dia_chi_cccd || [lo.thon, lo.xa].filter(Boolean).join(", ");
      this.setCell(ws, `A${r}`, "1. Tên nhà cung cấp gỗ:", { merge: `C${r}`, bold: true });
      this.setCell(ws, `D${r}`, lo.ten_ho || "", { merge: `J${r}` });
      r++;
      this.setCell(ws, `A${r}`, "2. Địa chỉ:", { merge: `C${r}`, bold: true });
      this.setCell(ws, `D${r}`, dc, { merge: `J${r}` });
      r++;
      this.setCell(ws, `A${r}`, "3. Điện thoại:", { merge: `C${r}`, bold: true });
      this.setCell(ws, `D${r}`, "……………………………… Fax: ………………………", { merge: `J${r}` });
      r += 2;
      // Bảng nội dung làm việc
      const FILL = "FFF0F0F0";
      this.setCell(ws, `A${r}`, "TT", { center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `B${r}`, "Nội dung làm việc", { merge: `F${r}`, center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `G${r}`, "Đánh giá / Nhận xét", { merge: `J${r}`, center: true, bold: true, border: true, fill: FILL });
      r++;
      // Row 1
      this.setCell(ws, `A${r}`, 1, { center: true, border: true });
      const noiDung1 = `Các nội dung làm việc với nhà cung cấp:\n- Hộ gia đình thuộc nhóm chứng chỉ rừng: ${lo.nhom_chung_chi || "Nam Phát – Định Hóa"}\n- Số chứng nhận chứng chỉ: ${lo.chung_chi || "…………"}\n- CCCD: ${lo.cccd || "………………"}`;
      this.setCell(ws, `B${r}`, noiDung1, { merge: `F${r}`, border: true, wrap: true });
      this.setCell(ws, `G${r}`, "Sau khi trao đổi và kiểm tra thông tin, nhà cung cấp đáp ứng các điều kiện về nguồn gốc gỗ hợp pháp, có chứng chỉ FSC còn hiệu lực.",
        { merge: `J${r}`, border: true, wrap: true });
      ws.getRow(r).height = 80;
      r++;
      // Row 2
      this.setCell(ws, `A${r}`, 2, { center: true, border: true });
      const lots = lo.lo_list || [];
      const loText = lots.map(l =>
        `- Diện tích: ${(Number(l.dien_tich) || 0).toFixed(2)} ha; Khoảnh: ${l.khoanh || "…"}; Lô: ${l.lo || "…"}; Năm trồng: ${l.nam_trong || "…"}`
      ).join("\n");
      const noiDung2 = `Khu vực khai thác: ${dc}\n${loText}\n- Đất sử dụng lâu dài, trồng gỗ keo tai tượng (Acacia mangium).`;
      this.setCell(ws, `B${r}`, noiDung2, { merge: `F${r}`, border: true, wrap: true });
      this.setCell(ws, `G${r}`, "Kết luận: Đây là nguồn nhập đủ điều kiện. Đề nghị triển khai ký hợp đồng & nhập gỗ.",
        { merge: `J${r}`, border: true, wrap: true });
      ws.getRow(r).height = Math.max(80, lots.length * 18 + 40);
      r += 2;
      const dt = this.ngayDGForLo(lo);
      this.setCell(ws, `A${r}`, `Ngày ${dt.getDate()} tháng ${dt.getMonth() + 1} năm ${dt.getFullYear()}`, { merge: `J${r}`, italic: true, right: true });
      r += 2;
      r = this.buildSign(ws, r, "Đại diện nhà cung cấp", lo.ten_ho || "", this.xuongTen, this.xuongNguoiDD || "………………………");
      return r;
    },

    /** Build Mẫu 3: PHIẾU ĐÁNH GIÁ GIẤY TỜ NGUỒN GỐC GỖ */
    buildBM03(ws, lo, startRow) {
      let r = this.buildHeader(ws, startRow, this.bmCode("BM03"));
      this.setCell(ws, `A${r}`, "PHIẾU ĐÁNH GIÁ GIẤY TỜ NGUỒN GỐC GỖ", { merge: `J${r}`, bold: true, center: true, size: 14 });
      ws.getRow(r).height = 24;
      r++;
      const dt = this.ngayDGForLo(lo);
      this.setCell(ws, `A${r}`, `Ngày ${dt.getDate()} tháng ${dt.getMonth() + 1} năm ${dt.getFullYear()} (trước ngày ký hợp đồng)`,
        { merge: `J${r}`, italic: true, center: true });
      r += 2;
      r = this.buildInfoNCC(ws, r, lo);
      r++;
      this.setCell(ws, `A${r}`, "1. Kiểm tra các hồ sơ gồm:", { merge: `J${r}`, bold: true });
      r++;
      const FILL = "FFF0F0F0";
      this.setCell(ws, `A${r}`, "STT", { center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `B${r}`, "Hạng mục kiểm tra", { merge: `F${r}`, center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `G${r}`, "Có", { center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `H${r}`, "Không", { center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `I${r}`, "Theo quy định", { merge: `J${r}`, center: true, bold: true, border: true, fill: FILL });
      r++;
      this.bm03Items.forEach((item, idx) => {
        this.setCell(ws, `A${r}`, idx + 1, { center: true, border: true });
        this.setCell(ws, `B${r}`, item.label, { merge: `F${r}`, border: true });
        this.setCell(ws, `G${r}`, item.co ? "✓" : "", { center: true, border: true });
        this.setCell(ws, `H${r}`, item.co ? "" : "✓", { center: true, border: true });
        this.setCell(ws, `I${r}`, item.quy_dinh || "", { merge: `J${r}`, center: true, border: true });
        r++;
      });
      r++;
      this.setCell(ws, `A${r}`, "2. Kết luận:", { merge: `J${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, "○ Nguồn chấp nhận được (loại A) — đáp ứng hết hồ sơ tối thiểu.", { merge: `J${r}` });
      r++;
      this.setCell(ws, `A${r}`, "✓ NCC bổ sung chứng từ trước khi mua (loại B) — đáp ứng phần lớn hồ sơ tối thiểu, còn thiếu một số.", { merge: `J${r}`, wrap: true });
      r++;
      this.setCell(ws, `A${r}`, "○ Không thể mua (loại C) — thiếu một trong các hồ sơ tối thiểu.", { merge: `J${r}` });
      r += 2;
      r = this.buildSign(ws, r, "Nhân viên đánh giá", "………………………", this.xuongTen, this.xuongNguoiDD || "………………………");
      return r;
    },

    /** Build Mẫu 4: PHIẾU ĐÁNH GIÁ VÙNG RỦI RO */
    buildBM05(ws, lo, startRow) {
      let r = this.buildHeader(ws, startRow, this.bmCode("BM05"));
      this.setCell(ws, `A${r}`, "PHIẾU ĐÁNH GIÁ VÙNG RỦI RO NGUỒN GỐC GỖ", { merge: `J${r}`, bold: true, center: true, size: 14 });
      ws.getRow(r).height = 24;
      r++;
      const dt = this.ngayDGForLo(lo);
      this.setCell(ws, `A${r}`, `Ngày ${dt.getDate()} tháng ${dt.getMonth() + 1} năm ${dt.getFullYear()} (trước ngày ký hợp đồng)`,
        { merge: `J${r}`, italic: true, center: true });
      r += 2;
      r = this.buildInfoNCC(ws, r, lo);
      r++;
      this.setCell(ws, `A${r}`, "1. Kiểm tra hồ sơ nguồn gốc gỗ", { merge: `J${r}`, bold: true });
      r++;
      const dc = lo.dia_chi_cccd || [lo.thon, lo.xa].filter(Boolean).join(", ");
      this.setCell(ws, `A${r}`, `Khu vực khai thác: ${dc}`, { merge: `J${r}` });
      r++;
      const FILL = "FFF0F0F0";
      this.setCell(ws, `A${r}`, "STT", { center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `B${r}`, "Hạng mục kiểm tra", { merge: `F${r}`, center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `G${r}`, "Cao", { center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `H${r}`, "Thấp", { center: true, bold: true, border: true, fill: FILL });
      this.setCell(ws, `I${r}`, "Công cụ kiểm tra", { merge: `J${r}`, center: true, bold: true, border: true, fill: FILL });
      r++;
      this.bm05Items.forEach((item, idx) => {
        this.setCell(ws, `A${r}`, idx + 1, { center: true, border: true });
        this.setCell(ws, `B${r}`, item.label, { merge: `F${r}`, border: true });
        this.setCell(ws, `G${r}`, item.cao ? "✓" : "", { center: true, border: true });
        this.setCell(ws, `H${r}`, item.cao ? "" : "✓", { center: true, border: true });
        this.setCell(ws, `I${r}`, item.cong_cu || "", { merge: `J${r}`, border: true });
        r++;
      });
      r++;
      this.setCell(ws, `A${r}`, "2. Kết luận:", { merge: `J${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, "Gỗ mua có rủi ro:", { merge: `F${r}`, bold: true });
      this.setCell(ws, `G${r}`, "Cao: ○", { center: true });
      this.setCell(ws, `H${r}`, "Thấp: ✓", { merge: `J${r}`, center: true, bold: true });
      r += 2;
      r = this.buildSign(ws, r, "Nhân viên đánh giá", "………………………", this.xuongTen, this.xuongNguoiDD || "………………………");
      return r;
    },

    /** Xuất 1 file Excel, mỗi chủ rừng = 1 sheet × 4 mẫu (page break giữa các mẫu). */
    async exportExcel() {
      if (!this.loList.length) {
        this.$q.notify({ type: "warning", message: "Chưa có dữ liệu — bấm Tải trước" });
        return;
      }
      if (!this.xuongXe) {
        this.$q.notify({ type: "warning", message: "Vui lòng chọn xưởng xẻ" });
        return;
      }
      this.applyXuong();
      this.exporting = true;
      try {
        const wb = new ExcelJS.Workbook();
        const used = new Set();
        const pgSetup = {
          paperSize: 9, orientation: "portrait",
          fitToPage: true, fitToWidth: 1, fitToHeight: 0,
          margins: { left: 0.4, right: 0.4, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 },
        };
        const cols = [
          { width: 6 },  { width: 14 }, { width: 14 }, { width: 12 }, { width: 12 },
          { width: 14 }, { width: 8 },  { width: 8 },  { width: 12 }, { width: 12 },
        ];

        for (const lo of this.loList) {
          const ws = wb.addWorksheet(this.safeSheetName(lo.ten_ho, used), { pageSetup: pgSetup });
          ws.columns = cols;
          ws.properties.defaultRowHeight = 17;
          let r = 1;
          r = this.buildDM(ws, lo, r);
          ws.getRow(r - 1).addPageBreak();
          r = this.buildBM01(ws, lo, r);
          ws.getRow(r - 1).addPageBreak();
          r = this.buildBM03(ws, lo, r);
          ws.getRow(r - 1).addPageBreak();
          r = this.buildBM05(ws, lo, r);
        }

        const buf = await wb.xlsx.writeBuffer();
        const fname = `BieuMau_DG_${this.xuongXe}_T${this.thang}_${this.nam}`.replace(/[^\p{L}\p{N}_-]+/gu, "_");
        saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
          fname + ".xlsx");
        this.$q.notify({
          type: "positive",
          message: `Đã xuất ${this.loList.length} chủ rừng × 4 mẫu`,
          timeout: 4000,
        });
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: "negative", message: "Lỗi xuất Excel: " + (err.message || err), timeout: 6000 });
      } finally {
        this.exporting = false;
      }
    },
  },
};
</script>

<style scoped>
.bm-form {
  border: 1px solid #333;
  padding: 20px 28px;
  font-size: 13px;
  font-family: "Times New Roman", serif;
  line-height: 1.5;
  max-width: 900px;
  margin-bottom: 20px;
}
.bm-header-row { display: flex; justify-content: space-between; }
.bm-header-row .company { font-weight: bold; }
.bm-header-row .addr { font-size: 11px; }
.bm-header-row .right { text-align: right; font-size: 11px; }
.bm-title { text-align: center; font-weight: bold; font-size: 16px; margin: 14px 0 6px; }
.bm-date { text-align: center; font-size: 12px; margin-bottom: 6px; }
.bm-date.italic { font-style: italic; }
.bm-section { font-weight: bold; margin-top: 10px; margin-bottom: 4px; }
.bm-info > div { margin: 2px 0; }
.bm-text { margin-left: 8px; }
.bm-text.indent { text-indent: 1em; }
.italic { font-style: italic; }
.center { text-align: center; }
.check-row { margin-left: 16px; }
.chk { display: inline-block; width: 16px; text-align: center; font-weight: bold; color: #666; }
.chk.on { color: #1976d2; }
.bm-table { width: 100%; border-collapse: collapse; margin: 4px 0; font-size: 12px; }
.bm-table th, .bm-table td { border: 1px solid #333; padding: 4px 6px; vertical-align: top; }
.bm-table th { background: #f0f0f0; font-weight: bold; text-align: center; }
.sign-area { display: flex; justify-content: space-around; }
.sign-col { text-align: center; width: 45%; }
.sign-title { font-weight: bold; }
.sign-space { height: 60px; }
.sign-name { font-weight: bold; }

@media print {
  .no-print { display: none !important; }
  .bm-form { border: 1px solid #000; page-break-after: always; }
  .pa-break { page-break-before: always; }
  @page { size: portrait A4; margin: 10mm; }
}
</style>
