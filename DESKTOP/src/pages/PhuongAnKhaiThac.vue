<template>
  <q-page padding>
    <div class="text-h5 q-mb-md no-print">Đơn đề nghị & Phương án khai thác</div>

    <!-- Toolbar -->
    <div class="row q-col-gutter-md items-end q-mb-md no-print">
      <div class="col-auto">
        <q-select v-model="thang" :options="thangOptions" emit-value map-options label="Tháng" filled dense style="width:140px" />
      </div>
      <div class="col-auto">
        <q-select v-model="nam" :options="namOptions" emit-value map-options label="Năm" filled dense style="width:120px" />
      </div>
      <div class="col-auto">
        <q-select v-model="xuongXe" :options="xuongSelectOptions" emit-value map-options label="Xưởng xẻ" filled dense style="min-width:300px" @input="applyXuong" />
      </div>
      <div class="col-auto">
        <q-select v-model="selectedLo" :options="loOptions" option-label="_label" label="Chọn chủ rừng" filled dense style="min-width:400px" @input="onSelectLo" />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="search" label="Tải dữ liệu" @click="load" :loading="loading" />
      </div>
      <div class="col-auto">
        <q-btn-toggle
          v-model="viewMode"
          :options="[
            {label:'Đơn', value:'don'},
            {label:'Phương án', value:'pa'},
            {label:'Biểu TH', value:'bieu'},
            {label:'PL 2 IKEA', value:'phuluc'},
            {label:'Tất cả', value:'all'},
          ]"
          color="grey-4" text-color="black" toggle-color="primary"
        />
      </div>
      <div class="col-auto">
        <q-btn color="secondary" icon="print" :label="printLabel"
          @click="printPage" :disable="!selectedLo" />
      </div>
      <div class="col-auto">
        <q-btn color="green-7" icon="file_download" label="Xuất Excel (2 sheet/hộ)"
          @click="exportExcel" :disable="!loList.length" :loading="exporting" />
      </div>
      <div class="col-auto">
        <q-btn color="blue-7" icon="description" label="Xuất Word (2 file: dọc + ngang)"
          @click="exportWord" :disable="!loList.length" :loading="exporting" />
      </div>
    </div>

    <!-- ============ 1. ĐƠN ĐỀ NGHỊ PHÊ DUYỆT PHƯƠNG ÁN ============ -->
    <div v-if="lo && (viewMode === 'don' || viewMode === 'all')" class="print-area">
      <div class="bm-form">
        <div class="bm-header">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="bm-header bold">Độc lập - Tự do - Hạnh phúc</div>
        <div class="bm-separator">──────────</div>

        <div class="bm-title">ĐƠN ĐỀ NGHỊ PHÊ DUYỆT PHƯƠNG ÁN</div>
        <div class="bm-subtitle">Khai thác gỗ Keo tai tượng FSC 100% từ rừng trồng sản xuất</div>

        <div class="bm-text q-mt-md">
          <b>Kính gửi:</b> Ban đại diện chứng chỉ rừng FSC<sup>®</sup> {{ nhomCCDisplay }}
        </div>

        <div class="bm-section">1. Thông tin chủ rừng:</div>
        <div class="bm-text">a) Tên chủ rừng: <b>{{ lo.ten_ho }}</b></div>
        <div class="bm-text">- Thuộc nhóm chứng chỉ rừng <b>{{ nhomCCDisplay }}</b></div>
        <div class="bm-text">- Số chứng nhận FM/COC: <b>{{ lo.chung_chi || '…………' }}</b> và hiện không bị treo chứng chỉ</div>
        <div class="bm-text">b) Số CCCD/CMND: <b>{{ lo.cccd || '………………' }}</b> cấp ngày ……/……/……… do ……………… cấp.</div>
        <div class="bm-text">c) Địa chỉ chủ rừng: <b>{{ diaChiBenB }}</b></div>

        <div class="bm-section">2. Nội dung đề nghị phê duyệt:</div>
        <div class="bm-text">- Phương án khai thác gỗ Keo tai tượng (Acacia mangium) FSC 100% rừng trồng sản xuất</div>
        <div class="bm-text">- Diện tích: <b>{{ fmtNum(tongDienTich) }}</b> ha</div>
        <div class="bm-text">- Trồng năm: <b>{{ namTrong || '………' }}</b></div>
        <div class="bm-text" v-for="(lot, li) in (lo.lo_list || [])" :key="'l'+li">
          - Tại lô <b>{{ lot.lo || '…' }}</b>, &nbsp;&nbsp;&nbsp;&nbsp;Khoảnh <b>{{ lot.khoanh || '…' }}</b>, &nbsp;&nbsp;&nbsp;&nbsp;Tiểu khu ……
        </div>
        <div class="bm-text">- Với khối lượng lâm sản: Khoảng <b>{{ fmtNum(lo.tong_kl_bang_ke) }}</b> m³ trong đó:</div>
        <div class="bm-text">- Sản lượng gỗ tròn vanh: Khoảng ……… m³;</div>
        <div class="bm-text">- Sản lượng gỗ nhỏ, củi, cành: Khoảng ……… m³.</div>

        <div class="bm-section">3. Tài liệu gửi kèm:</div>
        <div class="bm-text">- Bản chính Phương án khai thác gỗ Keo tai tượng FSC 100% rừng trồng sản xuất.</div>
        <div class="bm-text">- Chứng minh thư nhân dân / căn cước công dân.</div>
        <div class="bm-text">- Xác nhận không tranh chấp của UBND xã <b>{{ tenXaHienTai }}</b>.</div>

        <div class="bm-date q-mt-md"><i>{{ tenXaHienTai }}, ngày …… tháng …… năm {{ namIn }}</i></div>

        <div class="sign-area q-mt-md">
          <div class="sign-col-right">
            <div class="sign-title">CHỦ RỪNG</div>
            <div class="sign-sub">(Ký, ghi rõ họ tên)</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ (lo.ten_ho || '').toUpperCase() }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ 2. PHƯƠNG ÁN KHAI THÁC ============ -->
    <div v-if="lo && (viewMode === 'pa' || viewMode === 'all')"
         class="print-area"
         :class="{ 'pa-break': viewMode === 'all' }">
      <div class="bm-form">
        <div class="bm-header">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="bm-header bold">Độc lập - Tự do - Hạnh phúc</div>
        <div class="bm-separator">──────────</div>

        <div class="bm-title">PHƯƠNG ÁN KHAI THÁC</div>
        <div class="bm-subtitle">Khai thác gỗ Keo tai tượng FSC 100% từ rừng trồng sản xuất</div>

        <div class="bm-section q-mt-md">I. THÔNG TIN CHUNG</div>
        <div class="bm-text">1. Tên chủ rừng (2): <b>{{ lo.ten_ho }}</b></div>
        <div class="bm-text">2. CCCD/HC (3): <b>{{ lo.cccd || '………………' }}</b> cấp ngày ……/……/……… do ……………… cấp.</div>
        <div class="bm-text">3. Địa chỉ chủ rừng (4): <b>{{ diaChiBenB }}</b></div>
        <div class="bm-text">4. Số điện thoại: ………………………………</div>
        <div class="bm-text">5. Thông tin về mã số vùng trồng, hoặc chứng chỉ quản lý rừng bền vững (nếu có) (5):</div>
        <div class="bm-text indent"><b>{{ lo.chung_chi || '…………' }}</b> và hiện không bị treo chứng chỉ</div>

        <div class="bm-section q-mt-sm">II. NỘI DUNG PHƯƠNG ÁN</div>
        <div class="bm-text">1. Căn cứ xây dựng phương án (6): Thông tư số 26/2025/TT-BNNMT ngày 24/6/2025 của Bộ Nông nghiệp và Môi trường về Quy định về quản lý lâm sản; xử lý lâm sản, thủy sản là tài sản được xác lập quyền sở hữu toàn dân, tại điều 6 khoản 1 điểm d và khoản 7 quy định xây dựng phương án khai thác.</div>

        <div class="bm-text">2. Đối tượng khai thác (loại rừng, rừng trồng, rừng tự nhiên) (7):</div>
        <div class="bm-text indent">Keo tai tượng (Acacia mangium), trồng năm <b>{{ namTrong || '………' }}</b>.</div>

        <div class="bm-text">3. Địa danh, diện tích khai thác (8):</div>
        <div class="bm-text indent" v-for="(lot, li) in (lo.lo_list || [])" :key="'pal'+li">
          Diện tích <b>{{ fmtNum(lot.dien_tich) }}</b> ha,&nbsp;&nbsp;&nbsp;&nbsp;
          Lô <b>{{ lot.lo || '…' }}</b>;&nbsp;&nbsp;&nbsp;&nbsp;
          Khoảnh <b>{{ lot.khoanh || '…' }}</b>;&nbsp;&nbsp;&nbsp;&nbsp;
          Tiểu khu ……
        </div>
        <div class="bm-text indent">{{ diaChiBenB }}</div>
        <div class="bm-text indent" v-if="hasToaDo">
          Tọa độ:&nbsp;&nbsp;&nbsp;&nbsp;KĐ: <b>{{ kdHienThi }}</b>&nbsp;&nbsp;&nbsp;&nbsp;
          VĐ: <b>{{ vdHienThi }}</b>
        </div>

        <div class="bm-text">4. Phương thức khai thác (9): Khai thác trắng</div>
        <div class="bm-text">5. Sản lượng dự kiến khai thác (10): Gỗ tròn vanh ……… m³; &nbsp;&nbsp;&nbsp;&nbsp;Gỗ nhỏ, củi, cành: ……… m³.</div>
        <div class="bm-text">6. Giải pháp phục hồi rừng sau khai thác (11): Trồng lại rừng.</div>
        <div class="bm-text">7. Thời gian dự kiến khai thác:</div>
        <div class="bm-text indent">Từ ngày …… tháng …… năm {{ namIn }} đến ngày …… tháng …… năm {{ namIn }}.</div>

        <div class="bm-date q-mt-md"><i>{{ tenXaHienTai }}, ngày …… tháng …… năm {{ namIn }}.</i></div>

        <div class="sign-area q-mt-sm">
          <div class="sign-col-right">
            <div class="sign-title">CHỦ RỪNG</div>
            <div class="sign-sub">(Ký, ghi rõ họ tên)</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ (lo.ten_ho || '').toUpperCase() }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ 3. BIỂU TỔNG HỢP DỰ KIẾN TRỮ, SẢN LƯỢNG ============ -->
    <div v-if="lo && (viewMode === 'bieu' || viewMode === 'all')"
         class="print-area"
         :class="{ 'pa-break': viewMode === 'all' }">
      <div class="bm-form bm-form-wide">
        <div class="bm-title">BIỂU TỔNG HỢP DỰ KIẾN TRỮ, SẢN LƯỢNG KHAI THÁC GỖ RỪNG TRỒNG SẢN XUẤT</div>
        <div class="bm-subtitle">THEO MÔ HÌNH QLRBV &amp; CHỨNG CHỈ RỪNG FSC<sup>®</sup></div>
        <div class="bm-text center q-mt-sm">Tại nhóm Chứng chỉ rừng <b>{{ nhomCCDisplay }}</b></div>
        <div class="bm-text center">Mã số chứng chỉ rừng FSC: <b>{{ lo.chung_chi || '…………' }}</b> và hiện không bị treo chứng chỉ</div>

        <table class="bm-table q-mt-sm">
          <thead>
            <tr>
              <th rowspan="2">TT</th>
              <th rowspan="2">Họ và tên chủ hộ</th>
              <th rowspan="2">Địa danh</th>
              <th rowspan="2">Lô</th>
              <th rowspan="2">Khoảnh</th>
              <th rowspan="2">Tiểu khu</th>
              <th rowspan="2">Diện tích thiết kế khai thác</th>
              <th colspan="2">Loài cây</th>
              <th rowspan="2">Năm trồng</th>
              <th rowspan="2">Tổng số cây tính trữ lượng/lô</th>
              <th rowspan="2">Đường kính TB D1.3 (cm)</th>
              <th rowspan="2">Chiều cao TB Hvn (m)</th>
              <th rowspan="2">Tổng trữ lượng (m³)</th>
              <th colspan="2">Sản lượng/lô (m³)</th>
              <th rowspan="2">Xếp loại thực bì</th>
            </tr>
            <tr>
              <th>Tên thông thường</th>
              <th>Tên khoa học</th>
              <th>Gỗ D&gt;12cm</th>
              <th>Gỗ D&lt;12cm</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lot, li) in (lo.lo_list || [])" :key="'bi'+li">
              <td>{{ li + 1 }}</td>
              <td class="left">{{ lo.ten_ho }}</td>
              <td class="left">{{ lo.thon || lo.xa || '' }}</td>
              <td>{{ lot.lo || '' }}</td>
              <td>{{ lot.khoanh || '' }}</td>
              <td>……</td>
              <td>{{ fmtNum(lot.dien_tich) }} ha</td>
              <td>Keo tai tượng</td>
              <td><i>Acacia mangium</i></td>
              <td>{{ lot.nam_trong || '' }}</td>
              <td>……</td>
              <td>≥ 12</td>
              <td>……</td>
              <td class="num">{{ fmtNum(lot.kl_bang_ke) }}</td>
              <td class="num">……</td>
              <td class="num">……</td>
              <td>……</td>
            </tr>
            <tr class="total-row">
              <td colspan="6" class="bold">Tổng</td>
              <td class="bold">{{ fmtNum(tongDienTich) }} ha</td>
              <td colspan="3"></td>
              <td>……</td>
              <td></td>
              <td></td>
              <td class="num bold">{{ fmtNum(lo.tong_kl_bang_ke) }}</td>
              <td class="num">……</td>
              <td class="num">……</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div class="sign-area q-mt-md">
          <div class="sign-col">
            <div class="sign-title">CHỦ RỪNG</div>
            <div class="sign-sub">(Ký, ghi rõ họ tên)</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ (lo.ten_ho || '').toUpperCase() }}</div>
          </div>
          <div class="sign-col">
            <div class="bm-date"><i>{{ tenXaHienTai }}, ngày …… tháng …… năm {{ namIn }}</i></div>
            <div class="sign-title">TM. BQL nhóm chứng chỉ rừng FSC</div>
            <div class="sign-sub">Trưởng nhóm</div>
            <div class="sign-space"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ 4. PHỤ LỤC 2: IWAY MUST LÂM NGHIỆP IKEA ============ -->
    <div v-if="lo && (viewMode === 'phuluc' || viewMode === 'all')"
         class="print-area"
         :class="{ 'pa-break': viewMode === 'all' }">
      <div class="bm-form">
        <div class="bm-title">Phụ lục 2: Biểu mẫu Thông báo các yêu cầu IWAY Must Lâm nghiệp của IKEA đối với nguyên liệu được áp dụng.</div>

        <div class="bm-text q-mt-md"><b>Nhà cung cấp/Bên bán:</b> {{ lo.ten_ho }}</div>
        <div class="bm-text indent"><i>(Thuộc nhóm chứng chỉ rừng {{ nhomCCDisplay }}. Số chứng nhận FM/COC: {{ lo.chung_chi || '…………' }} và hiện không bị treo chứng chỉ)</i></div>

        <div class="bm-text"><b>Đại diện nhóm chứng chỉ:</b> Công ty TNHH Chế biến lâm sản Nam Phát</div>

        <div class="bm-text"><b>Xác nhận với Bên mua</b> {{ xuongTen || '………' }}</div>
        <div class="bm-text indent"><i>(Địa chỉ: {{ xuongDiaChi || '………' }})</i></div>
        <div class="bm-text">rằng nguyên liệu lâm nghiệp thô được giao gồm các chủng loại sau và có xuất xứ từ các khu vực khai thác được liệt kê dưới đây:</div>

        <table class="bm-table q-mt-sm">
          <thead>
            <tr>
              <th rowspan="2">Loại nguyên liệu</th>
              <th rowspan="2">Tên thương mại của chủng loại</th>
              <th rowspan="2">Chủng loại Latin</th>
              <th colspan="3">Khu vực khai thác</th>
            </tr>
            <tr>
              <th>Quốc gia</th>
              <th>Tỉnh / Huyện</th>
              <th>Xã / lô / khoảnh</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lot, li) in (lo.lo_list || [])" :key="'pl'+li">
              <td>Gỗ tròn</td>
              <td>Keo tai tượng</td>
              <td><i>Acacia mangium</i></td>
              <td>Việt Nam</td>
              <td>{{ tinhHuyenHienTai }}</td>
              <td class="left">
                Xã: {{ lo.xa || '……' }}<br/>
                Lô: {{ lot.lo || '……' }}<br/>
                Khoảnh: {{ lot.khoanh || '……' }}<br/>
                Tiểu khu: ……
              </td>
            </tr>
          </tbody>
        </table>

        <div class="bm-text q-mt-sm">Nhà cung cấp/Bên bán xác nhận rằng toàn bộ nguyên liệu được áp dụng đáp ứng các điều kiện sau:</div>
        <div class="bm-text">- Tình trạng pháp lý và địa điểm khai thác chính xác có thể được xác nhận bằng chứng từ. Các chứng từ phải được cung cấp bởi Bên bán trong vòng 48 giờ theo yêu cầu của Bên mua.</div>
        <div class="bm-text">- Gỗ đặc, tre dùng trong công nghiệp, vật liệu kết hợp, gỗ dán, gỗ ghép keo, nguyên liệu giấy chứa sợi gỗ, và vật liệu kết hợp gỗ - nhựa đáp ứng các yêu cầu sau:</div>
        <div class="bm-text indent">+ Không từ các hoạt động lâm nghiệp có liên quan tới các xung đột xã hội;</div>
        <div class="bm-text indent">+ Không từ Rừng nguyên sinh (IFL) hoặc các Khu rừng có giá trị bảo tồn cao (HCVF), trừ khi khu vực đó được chứng nhận bởi một hệ thống chứng nhận rừng được IKEA công nhận;</div>
        <div class="bm-text indent">+ Không từ rừng tự nhiên ở các vùng nhiệt đới và cận nhiệt đới được chuyển đổi sang rừng trồng hoặc đất không có mục đích sử dụng là rừng;</div>
        <div class="bm-text indent">+ Không từ rừng được chính thức công nhận và xác nhận về địa lý là có chủng loại cây và tre Biến đổi gen (GM) cho thương mại.</div>
        <div class="bm-text">- Đối với tất cả các sản phẩm cho IKEA, Bên bán chịu trách nhiệm rằng hồ sơ kế toán cho nguyên liệu phải được thiết lập và duy trì để đảm bảo rằng các sản phẩm được giao tương thích với đầu vào có liên quan. Bên bán có trách nhiệm thông báo tất cả các nhà cung cấp của mình về các điều kiện nêu trên bằng văn bản và duy trì văn bản chứng minh cho việc đó. Bên bán cũng có trách nhiệm thông báo cho Bên mua về bất kỳ thay đổi nào về chủng loại hoặc khu vực khai thác.</div>
        <div class="bm-text">- Là một phần của hệ thống thẩm định của IKEA để kiểm tra việc tuân thủ pháp chế, IKEA giữ quyền thực hiện đánh giá tại nhà cung cấp trực tiếp của IKEA và đánh giá toàn diện tại các chuỗi cung ứng được lựa chọn dựa theo đánh giá rủi ro. Bên cạnh đó, Bên bán đồng ý để IKEA đánh giá về các vấn đề nguồn gốc gỗ.</div>

        <div class="bm-text q-mt-md">
          <b>Ngày ký:</b> ……/……/{{ namIn }} &nbsp;&nbsp;&nbsp;&nbsp;
          <b>Nhà cung cấp/Bên bán:</b> {{ lo.ten_ho }}
        </div>

        <div class="sign-area q-mt-md">
          <div class="sign-col-right">
            <div class="sign-title">NHÀ CUNG CẤP / BÊN BÁN</div>
            <div class="sign-sub">(Ký, ghi rõ họ tên)</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ (lo.ten_ho || '').toUpperCase() }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!lo && !loading" class="text-center text-grey-5 q-mt-xl no-print">
      Chọn tháng → Tải dữ liệu → Chọn chủ rừng để xem 4 mẫu Đơn / PA / Biểu TH / PL 2 IKEA
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
      loList: [],
      loOptions: [],
      selectedLo: null,
      lo: null,
      xuongXe: "",
      viewMode: "all",
      xuongTen: "",
      xuongDiaChi: "",
      exporting: false,
    };
  },
  computed: {
    namIn() { return this.nam; },
    printLabel() {
      const map = { don: "In Đơn", pa: "In PA", bieu: "In Biểu TH", phuluc: "In PL 2", all: "In tất cả" };
      return map[this.viewMode] || "In";
    },
    /** Lấy phần Tỉnh / Huyện từ địa chỉ CCCD, hoặc dùng xã/huyện nếu có. */
    tinhHuyenHienTai() {
      if (!this.lo) return "";
      const dc = this.lo.dia_chi_cccd || "";
      const parts = dc.split(",").map(s => s.trim()).filter(Boolean);
      const tinh = parts.find(s => /^tỉnh\b/i.test(s)) || "";
      const huyen = parts.find(s => /^(huyện|tx|thành phố|tp)\b/i.test(s)) || "";
      const joined = [tinh, huyen].filter(Boolean).join(" / ");
      return joined || tinh || huyen || "";
    },
    diaChiBenB() {
      if (!this.lo) return "";
      return this.lo.dia_chi_cccd
        || [this.lo.thon, this.lo.xa].filter(Boolean).join(", ")
        || this.lo.xa || "";
    },
    /** Lấy tên xã hiện tại (cho dòng "{xã}, ngày..." và "UBND xã ..."). */
    tenXaHienTai() {
      if (!this.lo) return "";
      return this.lo.xa || (this.lo.dia_chi_cccd || "").split(",").map(s => s.trim()).find(s => /^(xã|phường|thị trấn)/i.test(s)) || "";
    },
    /** Nhóm chứng chỉ rừng hiển thị: ưu tiên lo.nhom_chung_chi. */
    nhomCCDisplay() {
      return (this.lo && this.lo.nhom_chung_chi) || "Nam Phát – Định Hóa";
    },
    /** Năm trồng chung của chủ rừng — dùng năm trồng của lô đầu tiên. */
    namTrong() {
      const lots = (this.lo && this.lo.lo_list) || [];
      return (lots[0] && lots[0].nam_trong) || "";
    },
    /** Tổng diện tích các lô. */
    tongDienTich() {
      const lots = (this.lo && this.lo.lo_list) || [];
      return lots.reduce((s, l) => s + (Number(l.dien_tich) || 0), 0);
    },
    /** Tọa độ — dùng tọa độ lô đầu tiên có KD/VD. */
    kdHienThi() {
      const lots = (this.lo && this.lo.lo_list) || [];
      const found = lots.find(l => l.KD);
      return found ? found.KD : "";
    },
    vdHienThi() {
      const lots = (this.lo && this.lo.lo_list) || [];
      const found = lots.find(l => l.VD);
      return found ? found.VD : "";
    },
    hasToaDo() { return !!(this.kdHienThi || this.vdHienThi); },
  },
  async created() { await this.loadXuongXe(); },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },
    fmtNum(v) { return v == null || v === "" ? "" : Number(v).toFixed(2); },
    async load() {
      if (!this.xuongXe) {
        this.$q.notify({ type: "warning", message: "Vui lòng chọn xưởng xẻ trước" });
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
          this.loList = data.data;
          this.loOptions = data.data.map(l => ({
            ...l,
            _label: l.ten_ho + " — " + l.xa + " (" + (l.lo_list || []).length + " lô, " + (l.tong_kl_go || 0).toFixed(2) + " m³)",
          }));
          if (!this.loList.length) {
            this.$q.notify({
              type: "warning",
              message: `Không có KH nào của xưởng "${this.xuongXe}" trong T${this.thang}/${this.nam}`,
            });
          }
        }
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message });
      } finally {
        this.loading = false;
      }
    },
    onSelectLo(item) { this.lo = item; },
    applyXuong() {
      const cfg = this.getXuongConfig(this.xuongXe);
      this.xuongTen = cfg.ten || "";
      this.xuongDiaChi = cfg.dia_chi || "";
    },
    /** Tách Tỉnh / Huyện từ địa chỉ CCCD của 1 chủ rừng. */
    tinhHuyenFromLo(lo) {
      const dc = (lo && lo.dia_chi_cccd) || "";
      const parts = dc.split(",").map(s => s.trim()).filter(Boolean);
      const tinh = parts.find(s => /^tỉnh\b/i.test(s)) || "";
      const huyen = parts.find(s => /^(huyện|tx|thành phố|tp)\b/i.test(s)) || "";
      return [tinh, huyen].filter(Boolean).join(" / ") || tinh || huyen || "";
    },
    /** Border thin cho 1 ô (dùng trong helpers bên dưới). */
    bThin() {
      return {
        top: { style: "thin" }, bottom: { style: "thin" },
        left: { style: "thin" }, right: { style: "thin" },
      };
    },
    /** Set 1 ô (có thể merge), trả về cell.
     * opts: { merge:'D1', bold, italic, size, center, right, wrap, border, fill }
     */
    setCell(ws, addr, value, opts = {}) {
      if (opts.merge) ws.mergeCells(`${addr}:${opts.merge}`);
      const cell = ws.getCell(addr);
      cell.value = value;
      const font = { name: "Times New Roman", size: opts.size || 14 };
      if (opts.bold) font.bold = true;
      if (opts.italic) font.italic = true;
      cell.font = font;
      cell.alignment = {
        horizontal: opts.center ? "center" : (opts.right ? "right" : "left"),
        vertical: "middle",
        wrapText: opts.wrap !== false,
      };
      if (opts.border) cell.border = this.bThin();
      if (opts.fill) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: opts.fill } };
      return cell;
    },
    /** Ước lượng row height (pt) theo độ dài text để wrap không tràn dòng.
     * Mặc định cho font 14pt + line-spacing 1.5x giống Word: lineHeight 28pt, ~80 char/line.
     */
    estRowHeight(text, charsPerLine = 80, lineHeight = 32) {
      if (!text) return lineHeight;
      const lines = Math.max(1, Math.ceil(String(text).length / charsPerLine));
      return Math.max(lineHeight, lines * lineHeight);
    },
    /** Pad blank rows để mẫu ngắn dàn đầy 1 trang A4 portrait.
     * targetHeight ≈ 760 pt = chiều cao print-area A4 portrait sau khi trừ margin 0.4 inch.
     */
    padToFillPage(ws, fromRow, currentRow, targetHeight = 760) {
      let used = 0;
      for (let r = fromRow; r < currentRow; r++) {
        used += ws.getRow(r).height || 32;
      }
      let next = currentRow;
      const padH = 32;
      while (used + padH <= targetHeight) {
        ws.getRow(next).height = padH;
        ws.getCell(`A${next}`).value = "";
        used += padH;
        next++;
      }
      return next;
    },
    /** Tạo tên sheet hợp lệ, đảm bảo unique trong wb. */
    safeSheetName(s, used) {
      const base = (s || "Sheet").replace(/[\\/?*[\]:]/g, "-").trim().slice(0, 31) || "Sheet";
      let candidate = base;
      let i = 1;
      while (used.has(candidate)) {
        const suffix = " (" + (++i) + ")";
        candidate = (base.slice(0, 31 - suffix.length) + suffix);
      }
      used.add(candidate);
      return candidate;
    },

    /** Xuất tất cả chủ rừng đã load → workbook, mỗi chủ rừng 1 sheet × 4 mẫu. */
    async exportExcel() {
      if (!this.loList.length) {
        this.$q.notify({ type: "warning", message: "Chưa có dữ liệu — vui lòng Tải dữ liệu trước" });
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
        const usedNames = new Set();

        // Page setup chung
        const pgMargins = { left: 0.4, right: 0.4, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 };
        const pgPortrait = {
          paperSize: 9, orientation: "portrait",
          fitToPage: true, fitToWidth: 1, fitToHeight: 0, margins: pgMargins,
        };
        const pgLandscape = {
          paperSize: 9, orientation: "landscape",
          fitToPage: true, fitToWidth: 1, fitToHeight: 0, margins: pgMargins,
        };
        // Cột cho sheet portrait: 10 cột A-J — font 14pt cần cột rộng hơn
        const colsPortrait = [
          { width: 10 }, { width: 28 }, { width: 18 }, { width: 18 }, { width: 18 },
          { width: 18 }, { width: 16 }, { width: 16 }, { width: 18 }, { width: 16 },
        ];
        // Cột cho sheet landscape: 17 cột A-Q — font 14pt cần cột rộng hơn
        const colsLandscape = [
          { width: 8 },  { width: 26 }, { width: 22 }, { width: 10 }, { width: 12 },
          { width: 12 }, { width: 20 }, { width: 18 }, { width: 22 }, { width: 12 },
          { width: 14 }, { width: 14 }, { width: 14 }, { width: 18 }, { width: 14 },
          { width: 14 }, { width: 18 },
        ];

        const mkSheet = (name, pageSetup, columns) => {
          const ws = wb.addWorksheet(this.safeSheetName(name, usedNames), { pageSetup });
          ws.columns = columns;
          ws.properties.defaultRowHeight = 34;
          return ws;
        };

        for (const lo of this.loList) {
          const base = lo.ten_ho || "Sheet";

          // ===== Sheet 1: Đơn + PA + PL2 (PORTRAIT), 3 trang A4, mỗi mẫu 1 trang =====
          const wsP = mkSheet(base, pgPortrait, colsPortrait);
          let r = 1;
          const r1Start = r;
          r = this.buildMau1Don(wsP, lo, r, { lastCol: "J", signCol: "F" });
          r = this.padToFillPage(wsP, r1Start, r);
          wsP.getRow(r - 1).addPageBreak();

          const r2Start = r;
          r = this.buildMau2PA(wsP, lo, r, { lastCol: "J", signCol: "F" });
          r = this.padToFillPage(wsP, r2Start, r);
          wsP.getRow(r - 1).addPageBreak();

          const r4Start = r;
          r = this.buildMau4PL2(wsP, lo, r);
          r = this.padToFillPage(wsP, r4Start, r);

          // ===== Sheet 2: Biểu tổng hợp (LANDSCAPE) =====
          this.buildMau3BieuTH(mkSheet(base + " - BieuTH", pgLandscape, colsLandscape), lo, 1);
        }

        const buf = await wb.xlsx.writeBuffer();
        const fname = `BieuMau_${this.xuongXe}_T${this.thang}_${this.nam}`.replace(/[^\p{L}\p{N}_-]+/gu, "_");
        saveAs(
          new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
          fname + ".xlsx"
        );
        this.$q.notify({
          type: "positive",
          message: `Đã xuất ${this.loList.length} chủ rừng × 2 sheet = ${this.loList.length * 2} sheet (mẫu 1+2+4 dọc, mẫu 3 ngang)`,
          timeout: 4000,
        });
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: "negative", message: "Lỗi xuất Excel: " + (err.message || err), timeout: 6000 });
      } finally {
        this.exporting = false;
      }
    },

    /** ===== Builder Mẫu 1: ĐƠN ĐỀ NGHỊ (dùng được cho cả portrait/landscape) ===== */
    buildMau1Don(ws, lo, startRow, opts = {}) {
      const LC = opts.lastCol || "Q";   // cột cuối cho merge full-width
      const SC = opts.signCol || "J";   // cột bắt đầu vùng ký bên phải
      let r = startRow;
      const fmt = v => (v == null || v === "") ? "" : Number(v).toFixed(2);
      const tenHoUpper = (lo.ten_ho || "").toUpperCase();
      const diaChi = lo.dia_chi_cccd || [lo.thon, lo.xa].filter(Boolean).join(", ");
      const tenXa = lo.xa || "";
      const chungChi = lo.chung_chi || "…………";
      const nhomCC = lo.nhom_chung_chi || "Nam Phát – Định Hóa";
      const lots = lo.lo_list || [];
      const namTrong = (lots[0] && lots[0].nam_trong) || "";
      const tongDT = lots.reduce((s, l) => s + (Number(l.dien_tich) || 0), 0);

      this.setCell(ws, `A${r}`, "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", { merge: `${LC}${r}`, bold: true, center: true });
      r++;
      this.setCell(ws, `A${r}`, "Độc lập - Tự do - Hạnh phúc", { merge: `${LC}${r}`, bold: true, italic: true, center: true });
      r++;
      this.setCell(ws, `A${r}`, "──────────", { merge: `${LC}${r}`, center: true });
      r++;
      r++;
      this.setCell(ws, `A${r}`, "ĐƠN ĐỀ NGHỊ PHÊ DUYỆT PHƯƠNG ÁN", { merge: `${LC}${r}`, bold: true, center: true, size: 18 });
      ws.getRow(r).height = 36;
      r++;
      this.setCell(ws, `A${r}`, "Khai thác gỗ Keo tai tượng FSC 100% từ rừng trồng sản xuất", { merge: `${LC}${r}`, italic: true, center: true, size: 14 });
      r++;
      r++;

      this.setCell(ws, `A${r}`, `Kính gửi: Ban đại diện chứng chỉ rừng FSC® ${nhomCC}`, { merge: `${LC}${r}`, bold: true });
      r++;
      r++;

      this.setCell(ws, `A${r}`, "1. Thông tin chủ rừng:", { merge: `${LC}${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, `a) Tên chủ rừng: ${lo.ten_ho || ""}`, { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, `- Thuộc nhóm chứng chỉ rừng ${nhomCC}`, { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, `- Số chứng nhận FM/COC: ${chungChi} và hiện không bị treo chứng chỉ`, { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, `b) Số CCCD/CMND: ${lo.cccd || "………………"} cấp ngày ……/……/……… do ……………… cấp.`, { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, `c) Địa chỉ chủ rừng: ${diaChi}`, { merge: `${LC}${r}` });
      r++;
      r++;

      this.setCell(ws, `A${r}`, "2. Nội dung đề nghị phê duyệt:", { merge: `${LC}${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, "- Phương án khai thác gỗ Keo tai tượng (Acacia mangium) FSC 100% rừng trồng sản xuất", { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, `- Diện tích: ${fmt(tongDT)} ha`, { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, `- Trồng năm: ${namTrong || "………"}`, { merge: `${LC}${r}` });
      r++;
      for (const lot of lots) {
        this.setCell(ws, `A${r}`, `- Tại lô ${lot.lo || "…"}, Khoảnh ${lot.khoanh || "…"}, Tiểu khu ……`, { merge: `${LC}${r}` });
        r++;
      }
      this.setCell(ws, `A${r}`, `- Với khối lượng lâm sản: Khoảng ${fmt(lo.tong_kl_bang_ke)} m³ trong đó:`, { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, "- Sản lượng gỗ tròn vanh: Khoảng ……… m³;", { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, "- Sản lượng gỗ nhỏ, củi, cành: Khoảng ……… m³.", { merge: `${LC}${r}` });
      r++;
      r++;

      this.setCell(ws, `A${r}`, "3. Tài liệu gửi kèm:", { merge: `${LC}${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, "- Bản chính Phương án khai thác gỗ Keo tai tượng FSC 100% rừng trồng sản xuất.", { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, "- Chứng minh thư nhân dân/căn cước công dân.", { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, `- Xác nhận không tranh chấp của UBND xã ${tenXa}.`, { merge: `${LC}${r}` });
      r++;
      r++;

      // Vùng ký bên phải (SC:LC)
      this.setCell(ws, `${SC}${r}`, `${tenXa}, ngày …… tháng …… năm ${this.nam}`, { merge: `${LC}${r}`, italic: true, center: true });
      r++;
      this.setCell(ws, `${SC}${r}`, "CHỦ RỪNG", { merge: `${LC}${r}`, bold: true, center: true });
      r++;
      this.setCell(ws, `${SC}${r}`, "(Ký, ghi rõ họ tên)", { merge: `${LC}${r}`, italic: true, center: true });
      r++;
      ws.getRow(r).height = 70;
      r++;
      this.setCell(ws, `${SC}${r}`, tenHoUpper, { merge: `${LC}${r}`, bold: true, center: true });
      r++;
      return r;
    },

    /** ===== Builder Mẫu 2: PHƯƠNG ÁN KHAI THÁC ===== */
    buildMau2PA(ws, lo, startRow, opts = {}) {
      const LC = opts.lastCol || "Q";
      const SC = opts.signCol || "J";
      let r = startRow;
      const fmt = v => (v == null || v === "") ? "" : Number(v).toFixed(2);
      const tenHoUpper = (lo.ten_ho || "").toUpperCase();
      const diaChi = lo.dia_chi_cccd || [lo.thon, lo.xa].filter(Boolean).join(", ");
      const tenXa = lo.xa || "";
      const chungChi = lo.chung_chi || "…………";
      const lots = lo.lo_list || [];
      const namTrong = (lots[0] && lots[0].nam_trong) || "";
      const kdLot = lots.find(l => l.KD || l.VD) || {};

      this.setCell(ws, `A${r}`, "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", { merge: `${LC}${r}`, bold: true, center: true });
      r++;
      this.setCell(ws, `A${r}`, "Độc lập - Tự do - Hạnh phúc", { merge: `${LC}${r}`, bold: true, italic: true, center: true });
      r++;
      this.setCell(ws, `A${r}`, "──────────", { merge: `${LC}${r}`, center: true });
      r++;
      r++;
      this.setCell(ws, `A${r}`, "PHƯƠNG ÁN KHAI THÁC", { merge: `${LC}${r}`, bold: true, center: true, size: 18 });
      ws.getRow(r).height = 36;
      r++;
      this.setCell(ws, `A${r}`, "Khai thác gỗ Keo tai tượng FSC 100% từ rừng trồng sản xuất", { merge: `${LC}${r}`, italic: true, center: true, size: 14 });
      r++;
      r++;

      this.setCell(ws, `A${r}`, "I. THÔNG TIN CHUNG", { merge: `${LC}${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, `1. Tên chủ rừng (2): ${lo.ten_ho || ""}`, { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, `2. CCCD/HC (3): ${lo.cccd || "………………"} cấp ngày ……/……/……… do ……………… cấp.`, { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, `3. Địa chỉ chủ rừng (4): ${diaChi}`, { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, "4. Số điện thoại: ………………………………", { merge: `${LC}${r}` });
      r++;
      {
        const t = `5. Thông tin về mã số vùng trồng hoặc chứng chỉ QLRBV (5): ${chungChi} và hiện không bị treo chứng chỉ`;
        this.setCell(ws, `A${r}`, t, { merge: `${LC}${r}`, wrap: true });
        ws.getRow(r).height = this.estRowHeight(t, 75, 32);
      }
      r++;
      r++;

      this.setCell(ws, `A${r}`, "II. NỘI DUNG PHƯƠNG ÁN", { merge: `${LC}${r}`, bold: true });
      r++;
      {
        const t = "1. Căn cứ xây dựng phương án (6): Thông tư số 26/2025/TT-BNNMT ngày 24/6/2025 của Bộ Nông nghiệp và Môi trường về Quy định về quản lý lâm sản; xử lý lâm sản, thủy sản là tài sản được xác lập quyền sở hữu toàn dân, tại điều 6 khoản 1 điểm d và khoản 7 quy định xây dựng phương án khai thác.";
        this.setCell(ws, `A${r}`, t, { merge: `${LC}${r}`, wrap: true });
        ws.getRow(r).height = this.estRowHeight(t, 75, 32);
      }
      r++;
      this.setCell(ws, `A${r}`, `2. Đối tượng khai thác (7): Keo tai tượng (Acacia mangium), trồng năm ${namTrong || "………"}.`, { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, "3. Địa danh, diện tích khai thác (8):", { merge: `${LC}${r}` });
      r++;
      for (const lot of lots) {
        this.setCell(ws, `A${r}`, `   Diện tích ${fmt(lot.dien_tich)} ha, Lô ${lot.lo || "…"}; Khoảnh ${lot.khoanh || "…"}; Tiểu khu ……`, { merge: `${LC}${r}` });
        r++;
      }
      this.setCell(ws, `A${r}`, `   ${diaChi}`, { merge: `${LC}${r}` });
      r++;
      if (kdLot.KD || kdLot.VD) {
        this.setCell(ws, `A${r}`, `   Tọa độ: KĐ ${kdLot.KD || ""}, VĐ ${kdLot.VD || ""}`, { merge: `${LC}${r}` });
        r++;
      }
      this.setCell(ws, `A${r}`, "4. Phương thức khai thác (9): Khai thác trắng", { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, "5. Sản lượng dự kiến khai thác (10): Gỗ tròn vanh ……… m³; Gỗ nhỏ, củi, cành: ……… m³.", { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, "6. Giải pháp phục hồi rừng sau khai thác (11): Trồng lại rừng.", { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, `7. Thời gian dự kiến khai thác: Từ ngày … tháng … năm ${this.nam} đến ngày … tháng … năm ${this.nam}.`, { merge: `${LC}${r}` });
      r++;
      r++;

      this.setCell(ws, `${SC}${r}`, `${tenXa}, ngày …… tháng …… năm ${this.nam}.`, { merge: `${LC}${r}`, italic: true, center: true });
      r++;
      this.setCell(ws, `${SC}${r}`, "CHỦ RỪNG", { merge: `${LC}${r}`, bold: true, center: true });
      r++;
      this.setCell(ws, `${SC}${r}`, "(Ký, ghi rõ họ tên)", { merge: `${LC}${r}`, italic: true, center: true });
      r++;
      ws.getRow(r).height = 70;
      r++;
      this.setCell(ws, `${SC}${r}`, tenHoUpper, { merge: `${LC}${r}`, bold: true, center: true });
      r++;
      return r;
    },

    /** ===== Builder Mẫu 3: BIỂU TỔNG HỢP (bảng 17 cột có border) ===== */
    buildMau3BieuTH(ws, lo, startRow) {
      let r = startRow;
      const fmt = v => (v == null || v === "") ? "" : Number(v).toFixed(2);
      const tenHoUpper = (lo.ten_ho || "").toUpperCase();
      const nhomCC = lo.nhom_chung_chi || "Nam Phát – Định Hóa";
      const chungChi = lo.chung_chi || "…………";
      const lots = lo.lo_list || [];
      const tongDT = lots.reduce((s, l) => s + (Number(l.dien_tich) || 0), 0);

      this.setCell(ws, `A${r}`, "BIỂU TỔNG HỢP DỰ KIẾN TRỮ, SẢN LƯỢNG KHAI THÁC GỖ RỪNG TRỒNG SẢN XUẤT", { merge: `Q${r}`, bold: true, center: true, size: 16, wrap: true });
      ws.getRow(r).height = 36;
      r++;
      this.setCell(ws, `A${r}`, "THEO MÔ HÌNH QLRBV & CHỨNG CHỈ RỪNG FSC®", { merge: `Q${r}`, bold: true, center: true, size: 14 });
      r++;
      r++;
      this.setCell(ws, `A${r}`, `Tại nhóm Chứng chỉ rừng ${nhomCC}`, { merge: `Q${r}`, center: true });
      r++;
      this.setCell(ws, `A${r}`, `Mã số chứng chỉ rừng FSC: ${chungChi} và hiện không bị treo chứng chỉ`, { merge: `Q${r}`, center: true, italic: true });
      r++;
      r++;

      // Bảng — 2 dòng header, fill cam nhạt
      const hR1 = r;
      const hR2 = r + 1;
      const FILL = "FFFFD7AB";
      // Cột đơn (rowspan 2)
      this.setCell(ws, `A${hR1}`, "TT", { merge: `A${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `B${hR1}`, "Họ và tên chủ hộ", { merge: `B${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `C${hR1}`, "Địa danh", { merge: `C${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `D${hR1}`, "Lô", { merge: `D${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `E${hR1}`, "Khoảnh", { merge: `E${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `F${hR1}`, "Tiểu khu", { merge: `F${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `G${hR1}`, "Diện tích thiết kế khai thác", { merge: `G${hR2}`, bold: true, center: true, border: true, fill: FILL });
      // Cột gộp "Loài cây" (H-I) ở hR1
      this.setCell(ws, `H${hR1}`, "Loài cây", { merge: `I${hR1}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `J${hR1}`, "Năm trồng", { merge: `J${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `K${hR1}`, "Tổng số cây tính trữ lượng/lô", { merge: `K${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `L${hR1}`, "Đường kính TB D1.3 (cm)", { merge: `L${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `M${hR1}`, "Chiều cao TB Hvn (m)", { merge: `M${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `N${hR1}`, "Tổng trữ lượng (m³)", { merge: `N${hR2}`, bold: true, center: true, border: true, fill: FILL });
      // Cột gộp "Sản lượng/lô" (O-P) ở hR1
      this.setCell(ws, `O${hR1}`, "Sản lượng/lô (m³)", { merge: `P${hR1}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `Q${hR1}`, "Xếp loại thực bì", { merge: `Q${hR2}`, bold: true, center: true, border: true, fill: FILL });
      // Hàng phụ ở hR2 cho 4 cột gộp
      this.setCell(ws, `H${hR2}`, "Tên thông thường", { bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `I${hR2}`, "Tên khoa học", { bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `O${hR2}`, "Gỗ D>12cm", { bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `P${hR2}`, "Gỗ D<12cm", { bold: true, center: true, border: true, fill: FILL });
      ws.getRow(hR1).height = 56;
      ws.getRow(hR2).height = 50;
      r = hR2 + 1;

      // Data rows
      const cols = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q"];
      let stt = 0;
      for (const lot of lots) {
        stt++;
        const values = [
          stt, lo.ten_ho || "", lo.thon || lo.xa || "",
          lot.lo || "", lot.khoanh || "", "……",
          `${fmt(lot.dien_tich)} ha`,
          "Keo tai tượng", "Acacia mangium",
          lot.nam_trong || "", "……", "≥ 12", "……",
          fmt(lot.kl_bang_ke), "……", "……", "……",
        ];
        values.forEach((v, i) => {
          const center = ![1, 2].includes(i);
          const italic = i === 8;
          this.setCell(ws, `${cols[i]}${r}`, v, { center, italic, border: true });
        });
        r++;
      }

      // Tổng row — merge A:F
      this.setCell(ws, `A${r}`, "Tổng", { merge: `F${r}`, bold: true, center: true, border: true });
      this.setCell(ws, `G${r}`, `${fmt(tongDT)} ha`, { bold: true, center: true, border: true });
      this.setCell(ws, `H${r}`, "", { border: true });
      this.setCell(ws, `I${r}`, "", { border: true });
      this.setCell(ws, `J${r}`, "", { border: true });
      this.setCell(ws, `K${r}`, "……", { center: true, border: true });
      this.setCell(ws, `L${r}`, "", { border: true });
      this.setCell(ws, `M${r}`, "", { border: true });
      this.setCell(ws, `N${r}`, fmt(lo.tong_kl_bang_ke), { bold: true, center: true, border: true });
      this.setCell(ws, `O${r}`, "……", { center: true, border: true });
      this.setCell(ws, `P${r}`, "……", { center: true, border: true });
      this.setCell(ws, `Q${r}`, "", { border: true });
      r++;
      r++;

      // Khu vực ký — 2 cột: trái = chủ rừng, phải = BQL
      this.setCell(ws, `A${r}`, "", { merge: `H${r}` });
      this.setCell(ws, `I${r}`, `${lo.xa || ""}, ngày …… tháng …… năm ${this.nam}`, { merge: `Q${r}`, italic: true, center: true });
      r++;
      this.setCell(ws, `A${r}`, "CHỦ RỪNG", { merge: `H${r}`, bold: true, center: true });
      this.setCell(ws, `I${r}`, "TM. BQL nhóm chứng chỉ rừng FSC", { merge: `Q${r}`, bold: true, center: true });
      r++;
      this.setCell(ws, `A${r}`, "(Ký, ghi rõ họ tên)", { merge: `H${r}`, italic: true, center: true });
      this.setCell(ws, `I${r}`, "Trưởng nhóm", { merge: `Q${r}`, italic: true, center: true });
      r++;
      ws.getRow(r).height = 70;
      r++;
      this.setCell(ws, `A${r}`, tenHoUpper, { merge: `H${r}`, bold: true, center: true });
      r++;
      return r;
    },

    /** ===== Builder Mẫu 4: PHỤ LỤC 2 IKEA (portrait 10 cột A-J) ===== */
    buildMau4PL2(ws, lo, startRow) {
      const LC = "J";       // sheet portrait dùng A:J
      const SC = "F";       // vùng ký bên phải
      let r = startRow;
      const tenHoUpper = (lo.ten_ho || "").toUpperCase();
      const nhomCC = lo.nhom_chung_chi || "Nam Phát – Định Hóa";
      const chungChi = lo.chung_chi || "…………";
      const lots = lo.lo_list || [];
      const tinhHuyen = this.tinhHuyenFromLo(lo);
      const FILL = "FFFFD7AB";

      this.setCell(ws, `A${r}`, "Phụ lục 2: Biểu mẫu Thông báo các yêu cầu IWAY Must Lâm nghiệp của IKEA đối với nguyên liệu được áp dụng.", { merge: `${LC}${r}`, bold: true, center: true, size: 16, wrap: true });
      ws.getRow(r).height = 60;
      r++;
      r++;
      this.setCell(ws, `A${r}`, `Nhà cung cấp/Bên bán: ${lo.ten_ho || ""}`, { merge: `${LC}${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, `(Thuộc nhóm chứng chỉ rừng ${nhomCC}. Số chứng nhận FM/COC: ${chungChi} và hiện không bị treo chứng chỉ)`, { merge: `${LC}${r}`, italic: true });
      r++;
      this.setCell(ws, `A${r}`, "Đại diện nhóm chứng chỉ: Công ty TNHH Chế biến lâm sản Nam Phát", { merge: `${LC}${r}` });
      r++;
      this.setCell(ws, `A${r}`, `Xác nhận với Bên mua: ${this.xuongTen || "………"}`, { merge: `${LC}${r}`, bold: true });
      r++;
      this.setCell(ws, `A${r}`, `(Địa chỉ: ${this.xuongDiaChi || "………"})`, { merge: `${LC}${r}`, italic: true });
      r++;
      this.setCell(ws, `A${r}`, "rằng nguyên liệu lâm nghiệp thô được giao gồm các chủng loại sau và có xuất xứ từ các khu vực khai thác được liệt kê dưới đây:", { merge: `${LC}${r}`, wrap: true });
      r++;
      r++;

      // Bảng 10 cột A-J:
      // A-B = Loại NL, C-D = Tên TM, E = Latin, F = Quốc gia, G-H = Tỉnh/Huyện, I-J = Xã/Lô/Khoảnh
      const hR1 = r;
      const hR2 = r + 1;
      this.setCell(ws, `A${hR1}`, "Loại nguyên liệu", { merge: `B${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `C${hR1}`, "Tên thương mại", { merge: `D${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `E${hR1}`, "Chủng loại Latin", { merge: `E${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `F${hR1}`, "Khu vực khai thác", { merge: `J${hR1}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `F${hR2}`, "Quốc gia", { bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `G${hR2}`, "Tỉnh / Huyện", { merge: `H${hR2}`, bold: true, center: true, border: true, fill: FILL });
      this.setCell(ws, `I${hR2}`, "Xã / lô / khoảnh", { merge: `J${hR2}`, bold: true, center: true, border: true, fill: FILL });
      ws.getRow(hR1).height = 40;
      ws.getRow(hR2).height = 36;
      r = hR2 + 1;

      for (const lot of lots) {
        this.setCell(ws, `A${r}`, "Gỗ tròn", { merge: `B${r}`, center: true, border: true });
        this.setCell(ws, `C${r}`, "Keo tai tượng", { merge: `D${r}`, center: true, border: true });
        this.setCell(ws, `E${r}`, "Acacia mangium", { center: true, italic: true, border: true });
        this.setCell(ws, `F${r}`, "Việt Nam", { center: true, border: true });
        this.setCell(ws, `G${r}`, tinhHuyen, { merge: `H${r}`, center: true, border: true, wrap: true });
        this.setCell(ws, `I${r}`, `Xã: ${lo.xa || ""} / Lô: ${lot.lo || ""} / Khoảnh: ${lot.khoanh || ""} / Tiểu khu: ……`, { merge: `J${r}`, center: true, border: true, wrap: true });
        ws.getRow(r).height = 64;
        r++;
      }
      r++;

      // Boilerplate — chiều cao tự tính theo độ dài text
      const lines = [
        ["Nhà cung cấp/Bên bán xác nhận rằng toàn bộ nguyên liệu được áp dụng đáp ứng các điều kiện sau:", true],
        ["- Tình trạng pháp lý và địa điểm khai thác chính xác có thể được xác nhận bằng chứng từ. Các chứng từ phải được cung cấp bởi Bên bán trong vòng 48 giờ theo yêu cầu của Bên mua.", false],
        ["- Gỗ đặc, tre dùng trong công nghiệp, vật liệu kết hợp, gỗ dán, gỗ ghép keo, nguyên liệu giấy chứa sợi gỗ, và vật liệu kết hợp gỗ - nhựa đáp ứng các yêu cầu sau:", false],
        ["   + Không từ các hoạt động lâm nghiệp có liên quan tới các xung đột xã hội;", false],
        ["   + Không từ Rừng nguyên sinh (IFL) hoặc các Khu rừng có giá trị bảo tồn cao (HCVF), trừ khi khu vực đó được chứng nhận bởi một hệ thống chứng nhận rừng được IKEA công nhận;", false],
        ["   + Không từ rừng tự nhiên ở các vùng nhiệt đới và cận nhiệt đới được chuyển đổi sang rừng trồng hoặc đất không có mục đích sử dụng là rừng;", false],
        ["   + Không từ rừng được chính thức công nhận và xác nhận về địa lý là có chủng loại cây và tre Biến đổi gen (GM) cho thương mại.", false],
        ["- Đối với tất cả các sản phẩm cho IKEA, Bên bán chịu trách nhiệm rằng hồ sơ kế toán cho nguyên liệu phải được thiết lập và duy trì để đảm bảo rằng các sản phẩm được giao tương thích với đầu vào có liên quan. Bên bán có trách nhiệm thông báo tất cả các nhà cung cấp của mình về các điều kiện nêu trên bằng văn bản và duy trì văn bản chứng minh cho việc đó. Bên bán cũng có trách nhiệm thông báo cho Bên mua về bất kỳ thay đổi nào về chủng loại hoặc khu vực khai thác.", false],
        ["- Là một phần của hệ thống thẩm định của IKEA để kiểm tra việc tuân thủ pháp chế, IKEA giữ quyền thực hiện đánh giá tại nhà cung cấp trực tiếp của IKEA và đánh giá toàn diện tại các chuỗi cung ứng được lựa chọn dựa theo đánh giá rủi ro. Bên cạnh đó, Bên bán đồng ý để IKEA đánh giá về các vấn đề nguồn gốc gỗ.", false],
      ];
      for (const [text, bold] of lines) {
        this.setCell(ws, `A${r}`, text, { merge: `${LC}${r}`, bold, wrap: true });
        ws.getRow(r).height = this.estRowHeight(text, 75, 32);
        r++;
      }
      r++;
      this.setCell(ws, `A${r}`, `Ngày ký: ……/……/${this.nam}     Nhà cung cấp/Bên bán: ${lo.ten_ho || ""}`, { merge: `${LC}${r}`, bold: true });
      r++;
      r++;

      this.setCell(ws, `${SC}${r}`, "NHÀ CUNG CẤP / BÊN BÁN", { merge: `${LC}${r}`, bold: true, center: true });
      r++;
      this.setCell(ws, `${SC}${r}`, "(Ký, ghi rõ họ tên)", { merge: `${LC}${r}`, italic: true, center: true });
      r++;
      ws.getRow(r).height = 70;
      r++;
      this.setCell(ws, `${SC}${r}`, tenHoUpper, { merge: `${LC}${r}`, bold: true, center: true });
      r++;
      return r;
    },

    printPage() { window.print(); },

    /* ===================== XUẤT WORD (.doc) — 1 file tất cả chủ rừng ===================== */

    /** Escape ký tự HTML để tránh hỏng cấu trúc khi nội dung chứa &, <, > */
    esc(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },

    /** CSS chung cho file Word — orientation = "portrait" hoặc "landscape".
     * Cỡ chữ 13pt, line-height 1.3 — compact để mỗi mẫu vừa 1 trang A4.
     */
    wordCss(orientation = "portrait") {
      const isLand = orientation === "landscape";
      const pageSize = isLand ? "29.7cm 21cm" : "21cm 29.7cm";
      return `<style>
        @page Section1 { size: ${pageSize}; margin: 1cm 1.2cm 1cm 1.2cm; mso-page-orientation: ${orientation}; }
        div.Section1 { page: Section1; }
        body { font-family: "Times New Roman", serif; font-size: 13pt; line-height: 1.3; }
        p { margin: 0 0 3pt 0; }
        .title { font-size: 15pt; font-weight: bold; text-align: center; margin: 6pt 0 2pt 0; }
        .subtitle { font-size: 13pt; font-style: italic; text-align: center; margin-bottom: 6pt; }
        .center { text-align: center; }
        .right { text-align: right; }
        .indent { text-indent: 1.5em; }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
        .section { font-weight: bold; margin: 4pt 0 1pt 0; }
        table.tbl { border-collapse: collapse; width: 100%; margin: 4pt 0; }
        table.tbl th, table.tbl td { border: 1px solid #333; padding: 3pt 5pt; vertical-align: middle; font-size: 11pt; }
        table.tbl th { background: #FFD7AB; font-weight: bold; text-align: center; }
        table.tbl td.num { text-align: right; }
        table.tbl td.center { text-align: center; }
        .sign-2col { width: 100%; margin-top: 8pt; }
        .sign-2col td { vertical-align: top; width: 50%; text-align: center; }
        .sign-name { font-weight: bold; margin-top: 42pt; }
        .pgbreak { page-break-before: always; }
      </style>`;
    },

    /** Build HTML cho 1 chủ rừng. mode = "portrait" (M1+M2+M4) hoặc "landscape" (M3). */
    wordOneLo(lo, idx, mode = "portrait") {
      const e = this.esc.bind(this);
      const fmt = v => (v == null || v === "") ? "" : Number(v).toFixed(2);
      const tenHo = lo.ten_ho || "";
      const tenHoUpper = tenHo.toUpperCase();
      const diaChi = lo.dia_chi_cccd || [lo.thon, lo.xa].filter(Boolean).join(", ");
      const tenXa = lo.xa || "";
      const chungChi = lo.chung_chi || "…………";
      const nhomCC = lo.nhom_chung_chi || "Nam Phát – Định Hóa";
      const lots = lo.lo_list || [];
      const namTrong = (lots[0] && lots[0].nam_trong) || "";
      const tongDT = lots.reduce((s, l) => s + (Number(l.dien_tich) || 0), 0);
      const kdLot = lots.find(l => l.KD || l.VD) || {};
      const tinhHuyen = this.tinhHuyenFromLo(lo);
      const nam = this.nam;
      const xuongTen = this.xuongTen || "………";
      const xuongDiaChi = this.xuongDiaChi || "………";

      // ===== Mẫu 1: ĐƠN ĐỀ NGHỊ =====
      let m1 = `
        <p class="center bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
        <p class="center bold italic">Độc lập - Tự do - Hạnh phúc</p>
        <p class="center">──────────</p>
        <p class="title">ĐƠN ĐỀ NGHỊ PHÊ DUYỆT PHƯƠNG ÁN</p>
        <p class="subtitle">Khai thác gỗ Keo tai tượng FSC 100% từ rừng trồng sản xuất</p>
        <p class="bold">Kính gửi: Ban đại diện chứng chỉ rừng FSC® ${e(nhomCC)}</p>
        <p class="section">1. Thông tin chủ rừng:</p>
        <p>a) Tên chủ rừng: <b>${e(tenHo)}</b></p>
        <p>- Thuộc nhóm chứng chỉ rừng <b>${e(nhomCC)}</b></p>
        <p>- Số chứng nhận FM/COC: <b>${e(chungChi)}</b> và hiện không bị treo chứng chỉ</p>
        <p>b) Số CCCD/CMND: <b>${e(lo.cccd || "………………")}</b> cấp ngày ……/……/……… do ……………… cấp.</p>
        <p>c) Địa chỉ chủ rừng: <b>${e(diaChi)}</b></p>
        <p class="section">2. Nội dung đề nghị phê duyệt:</p>
        <p>- Phương án khai thác gỗ Keo tai tượng (Acacia mangium) FSC 100% rừng trồng sản xuất</p>
        <p>- Diện tích: <b>${fmt(tongDT)}</b> ha</p>
        <p>- Trồng năm: <b>${e(namTrong || "………")}</b></p>
        ${lots.map(lot => `<p>- Tại lô <b>${e(lot.lo || "…")}</b>, Khoảnh <b>${e(lot.khoanh || "…")}</b>, Tiểu khu ……</p>`).join("")}
        <p>- Với khối lượng lâm sản: Khoảng <b>${fmt(lo.tong_kl_bang_ke)}</b> m³ trong đó:</p>
        <p>- Sản lượng gỗ tròn vanh: Khoảng ……… m³;</p>
        <p>- Sản lượng gỗ nhỏ, củi, cành: Khoảng ……… m³.</p>
        <p class="section">3. Tài liệu gửi kèm:</p>
        <p>- Bản chính Phương án khai thác gỗ Keo tai tượng FSC 100% rừng trồng sản xuất.</p>
        <p>- Chứng minh thư nhân dân/căn cước công dân.</p>
        <p>- Xác nhận không tranh chấp của UBND xã ${e(tenXa)}.</p>
        <table class="sign-2col"><tr>
          <td></td>
          <td>
            <p class="italic">${e(tenXa)}, ngày …… tháng …… năm ${nam}</p>
            <p class="bold">CHỦ RỪNG</p>
            <p class="italic">(Ký, ghi rõ họ tên)</p>
            <p class="sign-name">${e(tenHoUpper)}</p>
          </td>
        </tr></table>`;

      // ===== Mẫu 2: PHƯƠNG ÁN KHAI THÁC =====
      const toaDoLine = (kdLot.KD || kdLot.VD)
        ? `<p class="indent">Tọa độ: KĐ <b>${e(kdLot.KD || "")}</b>, VĐ <b>${e(kdLot.VD || "")}</b></p>`
        : "";
      let m2 = `
        <p class="center bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
        <p class="center bold italic">Độc lập - Tự do - Hạnh phúc</p>
        <p class="center">──────────</p>
        <p class="title">PHƯƠNG ÁN KHAI THÁC</p>
        <p class="subtitle">Khai thác gỗ Keo tai tượng FSC 100% từ rừng trồng sản xuất</p>
        <p class="section">I. THÔNG TIN CHUNG</p>
        <p>1. Tên chủ rừng (2): <b>${e(tenHo)}</b></p>
        <p>2. CCCD/HC (3): <b>${e(lo.cccd || "………………")}</b> cấp ngày ……/……/……… do ……………… cấp.</p>
        <p>3. Địa chỉ chủ rừng (4): <b>${e(diaChi)}</b></p>
        <p>4. Số điện thoại: ………………………………</p>
        <p>5. Thông tin về mã số vùng trồng hoặc chứng chỉ QLRBV (5): <b>${e(chungChi)}</b> và hiện không bị treo chứng chỉ</p>
        <p class="section">II. NỘI DUNG PHƯƠNG ÁN</p>
        <p>1. Căn cứ xây dựng phương án (6): Thông tư số 26/2025/TT-BNNMT ngày 24/6/2025 của Bộ Nông nghiệp và Môi trường về Quy định về quản lý lâm sản; xử lý lâm sản, thủy sản là tài sản được xác lập quyền sở hữu toàn dân, tại điều 6 khoản 1 điểm d và khoản 7 quy định xây dựng phương án khai thác.</p>
        <p>2. Đối tượng khai thác (7): Keo tai tượng (Acacia mangium), trồng năm <b>${e(namTrong || "………")}</b>.</p>
        <p>3. Địa danh, diện tích khai thác (8):</p>
        ${lots.map(lot => `<p class="indent">Diện tích <b>${fmt(lot.dien_tich)}</b> ha, Lô <b>${e(lot.lo || "…")}</b>; Khoảnh <b>${e(lot.khoanh || "…")}</b>; Tiểu khu ……</p>`).join("")}
        <p class="indent">${e(diaChi)}</p>
        ${toaDoLine}
        <p>4. Phương thức khai thác (9): Khai thác trắng</p>
        <p>5. Sản lượng dự kiến khai thác (10): Gỗ tròn vanh ……… m³; Gỗ nhỏ, củi, cành: ……… m³.</p>
        <p>6. Giải pháp phục hồi rừng sau khai thác (11): Trồng lại rừng.</p>
        <p>7. Thời gian dự kiến khai thác: Từ ngày … tháng … năm ${nam} đến ngày … tháng … năm ${nam}.</p>
        <table class="sign-2col"><tr>
          <td></td>
          <td>
            <p class="italic">${e(tenXa)}, ngày …… tháng …… năm ${nam}.</p>
            <p class="bold">CHỦ RỪNG</p>
            <p class="italic">(Ký, ghi rõ họ tên)</p>
            <p class="sign-name">${e(tenHoUpper)}</p>
          </td>
        </tr></table>`;

      // ===== Mẫu 3: BIỂU TỔNG HỢP =====
      let dataRows = "";
      let stt = 0;
      for (const lot of lots) {
        stt++;
        dataRows += `<tr>
          <td class="center">${stt}</td>
          <td>${e(tenHo)}</td>
          <td>${e(lo.thon || lo.xa || "")}</td>
          <td class="center">${e(lot.lo || "")}</td>
          <td class="center">${e(lot.khoanh || "")}</td>
          <td class="center">……</td>
          <td class="center">${fmt(lot.dien_tich)} ha</td>
          <td class="center">Keo tai tượng</td>
          <td class="center italic">Acacia mangium</td>
          <td class="center">${e(lot.nam_trong || "")}</td>
          <td class="center">……</td>
          <td class="center">≥ 12</td>
          <td class="center">……</td>
          <td class="num">${fmt(lot.kl_bang_ke)}</td>
          <td class="center">……</td>
          <td class="center">……</td>
          <td class="center">……</td>
        </tr>`;
      }
      let m3 = `
        <p class="title">BIỂU TỔNG HỢP DỰ KIẾN TRỮ, SẢN LƯỢNG KHAI THÁC GỖ RỪNG TRỒNG SẢN XUẤT</p>
        <p class="subtitle">THEO MÔ HÌNH QLRBV &amp; CHỨNG CHỈ RỪNG FSC®</p>
        <p class="center">Tại nhóm Chứng chỉ rừng <b>${e(nhomCC)}</b></p>
        <p class="center italic">Mã số chứng chỉ rừng FSC: ${e(chungChi)} và hiện không bị treo chứng chỉ</p>
        <table class="tbl">
          <tr>
            <th rowspan="2">TT</th>
            <th rowspan="2">Họ và tên chủ hộ</th>
            <th rowspan="2">Địa danh</th>
            <th rowspan="2">Lô</th>
            <th rowspan="2">Khoảnh</th>
            <th rowspan="2">Tiểu khu</th>
            <th rowspan="2">Diện tích thiết kế khai thác</th>
            <th colspan="2">Loài cây</th>
            <th rowspan="2">Năm trồng</th>
            <th rowspan="2">Tổng số cây tính trữ lượng/lô</th>
            <th rowspan="2">Đường kính TB D1.3 (cm)</th>
            <th rowspan="2">Chiều cao TB Hvn (m)</th>
            <th rowspan="2">Tổng trữ lượng (m³)</th>
            <th colspan="2">Sản lượng/lô (m³)</th>
            <th rowspan="2">Xếp loại thực bì</th>
          </tr>
          <tr>
            <th>Tên thông thường</th>
            <th>Tên khoa học</th>
            <th>Gỗ D&gt;12cm</th>
            <th>Gỗ D&lt;12cm</th>
          </tr>
          ${dataRows}
          <tr>
            <td colspan="6" class="center bold">Tổng</td>
            <td class="center bold">${fmt(tongDT)} ha</td>
            <td></td><td></td><td></td>
            <td class="center">……</td>
            <td></td><td></td>
            <td class="num bold">${fmt(lo.tong_kl_bang_ke)}</td>
            <td class="center">……</td><td class="center">……</td>
            <td></td>
          </tr>
        </table>
        <table class="sign-2col"><tr>
          <td>
            <p class="bold">CHỦ RỪNG</p>
            <p class="italic">(Ký, ghi rõ họ tên)</p>
            <p class="sign-name">${e(tenHoUpper)}</p>
          </td>
          <td>
            <p class="italic">${e(tenXa)}, ngày …… tháng …… năm ${nam}</p>
            <p class="bold">TM. BQL nhóm chứng chỉ rừng FSC</p>
            <p class="italic">Trưởng nhóm</p>
          </td>
        </tr></table>`;

      // ===== Mẫu 4: PHỤ LỤC 2 IKEA =====
      let pl2Rows = "";
      for (const lot of lots) {
        pl2Rows += `<tr>
          <td class="center">Gỗ tròn</td>
          <td class="center">Keo tai tượng</td>
          <td class="center italic">Acacia mangium</td>
          <td class="center">Việt Nam</td>
          <td class="center">${e(tinhHuyen)}</td>
          <td>Xã: ${e(lo.xa || "")} / Lô: ${e(lot.lo || "")} / Khoảnh: ${e(lot.khoanh || "")} / Tiểu khu: ……</td>
        </tr>`;
      }
      let m4 = `
        <p class="title">Phụ lục 2: Biểu mẫu Thông báo các yêu cầu IWAY Must Lâm nghiệp của IKEA đối với nguyên liệu được áp dụng.</p>
        <p><b>Nhà cung cấp/Bên bán:</b> ${e(tenHo)}</p>
        <p class="italic">(Thuộc nhóm chứng chỉ rừng ${e(nhomCC)}. Số chứng nhận FM/COC: ${e(chungChi)} và hiện không bị treo chứng chỉ)</p>
        <p><b>Đại diện nhóm chứng chỉ:</b> Công ty TNHH Chế biến lâm sản Nam Phát</p>
        <p><b>Xác nhận với Bên mua:</b> ${e(xuongTen)}</p>
        <p class="italic">(Địa chỉ: ${e(xuongDiaChi)})</p>
        <p>rằng nguyên liệu lâm nghiệp thô được giao gồm các chủng loại sau và có xuất xứ từ các khu vực khai thác được liệt kê dưới đây:</p>
        <table class="tbl">
          <tr>
            <th rowspan="2">Loại nguyên liệu</th>
            <th rowspan="2">Tên thương mại của chủng loại</th>
            <th rowspan="2">Chủng loại Latin</th>
            <th colspan="3">Khu vực khai thác</th>
          </tr>
          <tr>
            <th>Quốc gia</th>
            <th>Tỉnh / Huyện</th>
            <th>Xã / lô / khoảnh</th>
          </tr>
          ${pl2Rows}
        </table>
        <p class="bold">Nhà cung cấp/Bên bán xác nhận rằng toàn bộ nguyên liệu được áp dụng đáp ứng các điều kiện sau:</p>
        <p>- Tình trạng pháp lý và địa điểm khai thác chính xác có thể được xác nhận bằng chứng từ. Các chứng từ phải được cung cấp bởi Bên bán trong vòng 48 giờ theo yêu cầu của Bên mua.</p>
        <p>- Gỗ đặc, tre dùng trong công nghiệp, vật liệu kết hợp, gỗ dán, gỗ ghép keo, nguyên liệu giấy chứa sợi gỗ, và vật liệu kết hợp gỗ - nhựa đáp ứng các yêu cầu sau:</p>
        <p class="indent">+ Không từ các hoạt động lâm nghiệp có liên quan tới các xung đột xã hội;</p>
        <p class="indent">+ Không từ Rừng nguyên sinh (IFL) hoặc các Khu rừng có giá trị bảo tồn cao (HCVF), trừ khi khu vực đó được chứng nhận bởi một hệ thống chứng nhận rừng được IKEA công nhận;</p>
        <p class="indent">+ Không từ rừng tự nhiên ở các vùng nhiệt đới và cận nhiệt đới được chuyển đổi sang rừng trồng hoặc đất không có mục đích sử dụng là rừng;</p>
        <p class="indent">+ Không từ rừng được chính thức công nhận và xác nhận về địa lý là có chủng loại cây và tre Biến đổi gen (GM) cho thương mại.</p>
        <p>- Đối với tất cả các sản phẩm cho IKEA, Bên bán chịu trách nhiệm rằng hồ sơ kế toán cho nguyên liệu phải được thiết lập và duy trì để đảm bảo rằng các sản phẩm được giao tương thích với đầu vào có liên quan. Bên bán có trách nhiệm thông báo tất cả các nhà cung cấp của mình về các điều kiện nêu trên bằng văn bản và duy trì văn bản chứng minh cho việc đó. Bên bán cũng có trách nhiệm thông báo cho Bên mua về bất kỳ thay đổi nào về chủng loại hoặc khu vực khai thác.</p>
        <p>- Là một phần của hệ thống thẩm định của IKEA để kiểm tra việc tuân thủ pháp chế, IKEA giữ quyền thực hiện đánh giá tại nhà cung cấp trực tiếp của IKEA và đánh giá toàn diện tại các chuỗi cung ứng được lựa chọn dựa theo đánh giá rủi ro. Bên cạnh đó, Bên bán đồng ý để IKEA đánh giá về các vấn đề nguồn gốc gỗ.</p>
        <p><b>Ngày ký:</b> ……/……/${nam} &nbsp;&nbsp;&nbsp;&nbsp; <b>Nhà cung cấp/Bên bán:</b> ${e(tenHo)}</p>
        <table class="sign-2col"><tr>
          <td></td>
          <td>
            <p class="bold">NHÀ CUNG CẤP / BÊN BÁN</p>
            <p class="italic">(Ký, ghi rõ họ tên)</p>
            <p class="sign-name">${e(tenHoUpper)}</p>
          </td>
        </tr></table>`;

      // Tách 2 file: portrait (M1/M2/M4) hoặc landscape (M3 duy nhất).
      const firstBreak = idx === 0 ? "" : '<br clear="all" class="pgbreak"/>';
      if (mode === "landscape") {
        return `${firstBreak}${m3}`;
      }
      // Portrait: M1 → page break → M2 → page break → M4
      return `${firstBreak}${m1}<br clear="all" class="pgbreak"/>${m2}<br clear="all" class="pgbreak"/>${m4}`;
    },

    /** Xuất tất cả chủ rừng đã load → 1 file Word duy nhất (.doc), mixed orientation. */
    exportWord() {
      if (!this.loList.length) {
        this.$q.notify({ type: "warning", message: "Chưa có dữ liệu — vui lòng Tải dữ liệu trước" });
        return;
      }
      if (!this.xuongXe) {
        this.$q.notify({ type: "warning", message: "Vui lòng chọn xưởng xẻ" });
        return;
      }
      this.applyXuong();
      this.exporting = true;

      try {
        const fnameBase = `BieuMau_${this.xuongXe}_T${this.thang}_${this.nam}`.replace(/[^\p{L}\p{N}_-]+/gu, "_");

        // ===== File 1: PORTRAIT (Mẫu 1, 2, 4) =====
        const bodyP = this.loList.map((lo, i) => this.wordOneLo(lo, i, "portrait")).join("");
        const htmlP = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"/>${this.wordCss("portrait")}</head><body><div class="Section1">${bodyP}</div></body></html>`;
        const blobP = new Blob(["﻿" + htmlP], { type: "application/msword;charset=utf-8" });
        saveAs(blobP, fnameBase + "_Don_PA_PL2_DOC.doc");

        // ===== File 2: LANDSCAPE (Mẫu 3 — Biểu tổng hợp) =====
        const bodyL = this.loList.map((lo, i) => this.wordOneLo(lo, i, "landscape")).join("");
        const htmlL = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"/>${this.wordCss("landscape")}</head><body><div class="Section1">${bodyL}</div></body></html>`;
        const blobL = new Blob(["﻿" + htmlL], { type: "application/msword;charset=utf-8" });
        saveAs(blobL, fnameBase + "_BieuTH_NGANG.doc");

        this.$q.notify({
          type: "positive",
          message: `Đã xuất 2 file Word: ${this.loList.length} chủ rừng (DỌC: M1+M2+M4, NGANG: M3)`,
          timeout: 5000,
        });
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: "negative", message: "Lỗi xuất Word: " + (err.message || err), timeout: 6000 });
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
  padding: 24px 32px;
  font-size: 13px;
  font-family: "Times New Roman", serif;
  line-height: 1.7;
  max-width: 800px;
}
.bm-header { text-align: center; font-size: 13px; }
.bm-separator { text-align: center; margin-bottom: 12px; }
.bm-title { text-align: center; font-weight: bold; font-size: 16px; margin-top: 14px; }
.bm-subtitle { text-align: center; font-style: italic; margin-bottom: 14px; }
.bm-section { font-weight: bold; margin-top: 10px; margin-bottom: 4px; }
.bm-text { margin-left: 8px; }
.bm-text.indent { text-indent: 2em; }
.bm-text.center { text-align: center; }
.bm-date { text-align: right; }
.bold { font-weight: bold; }
.bm-form-wide { max-width: 1100px; }
.bm-table {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
  font-size: 11px;
}
.bm-table th, .bm-table td {
  border: 1px solid #333;
  padding: 4px 6px;
  text-align: center;
  vertical-align: middle;
}
.bm-table th { background: #f0f0f0; font-weight: bold; }
.bm-table .num { text-align: right; }
.bm-table .left { text-align: left; }
.bm-table .total-row td { background: #fafafa; }
.sign-area { display: flex; justify-content: space-between; }
.sign-col { text-align: center; width: 45%; }
.sign-col-right { text-align: center; width: 40%; margin-left: auto; }
.sign-title { font-weight: bold; }
.sign-sub { font-style: italic; font-size: 11px; }
.sign-space { height: 70px; }
.sign-name { font-weight: bold; }

@media print {
  .no-print { display: none !important; }
  .bm-form { border: 1px solid #000; }
  .pa-break { page-break-before: always; break-before: page; }
  @page { size: portrait A4; margin: 10mm; }
}
</style>
