<template>
  <q-page padding>
    <div class="text-h5 q-mb-md no-print">Hợp đồng mẫu &amp; Phụ lục hợp đồng</div>

    <!-- Filter -->
    <div class="row q-col-gutter-md items-end q-mb-md no-print">
      <div class="col-auto">
        <q-select v-model="thang" :options="thangOptions" emit-value map-options label="Tháng" filled dense style="width:140px" />
      </div>
      <div class="col-auto">
        <q-select v-model="nam" :options="namOptions" emit-value map-options label="Năm" filled dense style="width:120px" />
      </div>
      <div class="col-auto">
        <q-select v-model="xuongXe" :options="xuongSelectOptions" emit-value map-options label="Xưởng xẻ (Bên A)" filled dense style="min-width:300px" @input="applyXuong" />
      </div>
      <div class="col-auto">
        <q-select v-model="selectedLo" :options="loOptions" option-label="_label" label="Chọn chủ rừng (Bên B)" filled dense style="min-width:400px" @input="onSelectLo" />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="search" label="Tải dữ liệu" @click="load" :loading="loading" />
      </div>
      <div class="col-auto">
        <q-btn-toggle
          v-model="viewMode"
          :options="[
            {label:'Hợp đồng', value:'hd'},
            {label:'Phụ lục HĐ', value:'plhd'},
            {label:'Cả hai', value:'all'},
          ]"
          color="grey-4" text-color="black" toggle-color="primary"
        />
      </div>
      <div class="col-auto">
        <q-btn color="secondary" icon="print"
          :label="viewMode === 'hd' ? 'In Hợp đồng' : (viewMode === 'plhd' ? 'In PLHĐ' : 'In cả 2')"
          @click="printPage" :disable="!selectedLo" />
      </div>
    </div>

    <!-- ============ HỢP ĐỒNG NGUYÊN TẮC MUA BÁN GỖ TRÒN ============ -->
    <div v-if="lo && (viewMode === 'hd' || viewMode === 'all')" class="print-area">
      <div class="hd-form">
        <div class="hd-header">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="hd-header bold">Độc lập - Tự do - Hạnh phúc</div>
        <div class="hd-separator">──────────</div>

        <div class="hd-title">HỢP ĐỒNG NGUYÊN TẮC MUA BÁN GỖ TRÒN</div>
        <div class="hd-center">Số: {{ soHopDong }}</div>

        <div class="hd-text">- Căn cứ Bộ luật Dân sự số 91/2015/QH13 được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam thông qua ngày 24/11/2015 và các văn bản hướng dẫn thi hành;</div>
        <div class="hd-text">- Căn cứ Luật Doanh nghiệp số 68/2014/QH13 được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam thông qua ngày 26/11/2014 và các văn bản hướng dẫn thi hành;</div>
        <div class="hd-text">- Căn cứ Luật Thương mại số 36/2005/QH11 được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam thông qua ngày 14/06/2005 và các văn bản hướng dẫn thi hành;</div>
        <div class="hd-text">- Căn cứ Luật Lâm nghiệp số 16/2017/QH14 được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam thông qua ngày 15/11/2017 và các văn bản hướng dẫn thi hành;</div>
        <div class="hd-text">- Căn cứ vào điều lệ của {{ xuongTen }};</div>
        <div class="hd-text">- Căn cứ nhu cầu và khả năng của hai bên.</div>

        <div class="hd-text indent q-mt-sm">
          Hôm nay, ngày <b>{{ ngayHD.ngay }}</b> tháng <b>{{ ngayHD.thang }}</b> năm <b>{{ ngayHD.nam }}</b>, tại trụ sở {{ xuongTen }} - Địa chỉ: {{ xuongDiaChi }}, chúng tôi gồm:
        </div>

        <!-- Bên A -->
        <div class="hd-section">I. BÊN MUA (Sau đây được gọi tắt là Bên A)</div>
        <div class="hd-text bold">{{ xuongTen }}</div>
        <div class="hd-text">Mã số doanh nghiệp: <b>{{ xuongMST }}</b></div>
        <div class="hd-text">Trụ sở: {{ xuongDiaChi }}</div>
        <div class="hd-text">Mã chứng chỉ: <b>{{ xuongCCRaw }}</b> &nbsp;&nbsp;&nbsp;&nbsp; Hiệu lực: <b>{{ xuongHieuLuc }}</b></div>
        <div class="hd-text">Người đại diện: {{ xuongNguoiDD }}</div>
        <div class="hd-text" v-if="xuongUQNguoi">
          Người đại diện thu mua gỗ keo tròn FSC100% theo ủy quyền: <b>{{ xuongUQNguoi }}</b>
        </div>

        <!-- Bên B -->
        <div class="hd-section">II. BÊN BÁN (Sau đây được gọi tắt là Bên B)</div>
        <div class="hd-text">Ông/Bà: <b>{{ tenHoUpper }}</b></div>
        <div class="hd-text">CCCD số: <b>{{ lo.cccd || '..............................' }}</b></div>
        <div class="hd-text">Địa chỉ: {{ lo.dia_chi_cccd || diaChiBenB }}</div>
        <div class="hd-text">Mã chứng chỉ rừng: <b>{{ lo.chung_chi || '...............' }}</b></div>
        <div class="hd-text" v-if="lo.nhom_chung_chi">Thuộc nhóm chứng chỉ rừng FSC: <b>{{ lo.nhom_chung_chi }}</b></div>

        <div class="hd-text q-mt-sm">
          Hai bên cùng trao đổi và thống nhất ký kết Hợp đồng nguyên tắc mua bán gỗ tròn keo tai tượng (Acacia mangium) rừng trồng có chứng chỉ FSC 100% với các nội dung sau:
        </div>

        <div class="hd-section">Điều 1: Đối tượng của Hợp đồng</div>
        <div class="hd-text">Bên B đồng ý bán gỗ tròn keo tai tượng (Acacia mangium) có chứng chỉ FSC 100% (do Bên B tự trồng) cho Bên A và Bên A đồng ý nhận mua gỗ tròn từ Bên B. Số lượng, chất lượng và tiêu chuẩn gỗ tròn sẽ được thực hiện theo thỏa thuận tại Phụ lục đính kèm Hợp đồng này.</div>

        <div class="hd-section">Điều 2: Giá trị Hợp đồng và phương thức thanh toán</div>
        <div class="hd-text bold">2.1. Giá trị Hợp đồng</div>
        <div class="hd-text">Giá trị Hợp đồng này sẽ được các bên thống nhất thỏa thuận tại Phụ lục đính kèm Hợp đồng này.</div>
        <div class="hd-text bold">2.2. Phương thức thanh toán</div>
        <div class="hd-text">+ Bên A nhận đủ số lượng gỗ theo thỏa thuận tại Phụ lục Hợp đồng;</div>
        <div class="hd-text">+ Bên B bàn giao cho Bên A toàn bộ hồ sơ về nguồn gốc gỗ, bao gồm: Bản gốc Bảng kê lâm sản; Bản gốc Giấy phép/Quyết định khai thác; Bản sao Chứng nhận FSC-FM/COC/CW còn hiệu lực, phạm vi chứng nhận; Bản sao hồ sơ thiết kế khai thác; Bản sao Giấy chứng nhận quyền sử dụng đất hoặc Giấy xác nhận thuê đất, không có tranh chấp về quyền sử dụng đất của chính quyền địa phương.</div>
        <div class="hd-text">- Đồng tiền thanh toán: Việt Nam đồng.</div>
        <div class="hd-text">- Hình thức thanh toán: Tiền mặt / chuyển khoản.</div>

        <div class="hd-section">Điều 3: Địa điểm và phương thức giao nhận</div>
        <div class="hd-text bold">3.1. Địa điểm giao nhận</div>
        <div class="hd-text">Địa điểm giao nhận gỗ: Tại bãi 1 địa chỉ do Bên B chỉ định.</div>
        <div class="hd-text bold">3.2. Phương thức giao nhận</div>
        <div class="hd-text">- Bên B có trách nhiệm bàn giao toàn bộ số lượng gỗ theo kế hoạch đã thống nhất với Bên A. Trường hợp Bên B tiến hành giao gỗ không đúng kế hoạch đã thống nhất thì Bên A có quyền từ chối nhận bàn giao.</div>
        <div class="hd-text">- Bên A có trách nhiệm thanh toán toàn bộ chi phí vận chuyển cùng toàn bộ rủi ro đối với gỗ trong suốt quá trình vận chuyển gỗ keo tròn FSC 100% từ bãi 1 đến xưởng của Bên A.</div>
        <div class="hd-text">- Thời điểm giao nhận và người phụ trách giao nhận sẽ được Bên B thông báo tới Bên A.</div>
        <div class="hd-text">- Khi nhận bàn giao gỗ tại bãi 1 của Bên B, Bên A có quyền kiểm tra về kích thước, số lượng, chất lượng gỗ. Trường hợp gỗ không đủ số lượng, không đảm bảo chất lượng, kích thước, không đúng trạng thái môi trường của gỗ hoặc có lẫn gỗ không đúng yêu cầu như thỏa thuận tại Hợp đồng này và Phụ lục kèm theo thì Bên A trả lại Bên B.</div>
        <div class="hd-text">- Việc giao nhận gỗ keo tròn FSC 100% đạt yêu cầu sẽ được lập thành Biên bản, có chữ ký xác nhận của Bên B và đại diện Bên A.</div>

        <div class="hd-section">Điều 4: Quyền và nghĩa vụ của Bên A</div>
        <div class="hd-text bold">4.1. Quyền của Bên A</div>
        <div class="hd-text">- Yêu cầu Bên B giao hàng đúng số lượng, chất lượng, kích thước và thời gian theo quy định tại Hợp đồng này;</div>
        <div class="hd-text">- Yêu cầu Bên B cung cấp mọi chỉ dẫn cần thiết cho việc bảo quản gỗ;</div>
        <div class="hd-text">- Yêu cầu Bên B cung cấp hồ sơ nguồn gốc gỗ và các hồ sơ có liên quan theo quy định tại Hợp đồng này;</div>
        <div class="hd-text">- Đơn phương chấm dứt Hợp đồng trong trường hợp Bên B vi phạm một trong các điều khoản hoặc các thỏa thuận khác có liên quan đến Hợp đồng này;</div>
        <div class="hd-text">- Các quyền khác theo thỏa thuận của các bên và quy định pháp luật.</div>
        <div class="hd-text bold">4.2. Nghĩa vụ của Bên A</div>
        <div class="hd-text">- Thanh toán giá trị Hợp đồng đúng thời hạn và phương thức thanh toán quy định tại Hợp đồng này;</div>
        <div class="hd-text">- Tổ chức tiếp nhận gỗ nhanh chóng, an toàn, dứt điểm theo thời gian nhận bàn giao quy định tại Hợp đồng;</div>
        <div class="hd-text">- Các nghĩa vụ khác theo thỏa thuận của các bên và quy định pháp luật.</div>

        <div class="hd-section">Điều 5: Quyền và nghĩa vụ của Bên B</div>
        <div class="hd-text bold">5.1. Quyền của Bên B</div>
        <div class="hd-text">- Yêu cầu Bên A thanh toán giá trị Hợp đồng theo đúng thời hạn và phương thức thanh toán quy định tại Hợp đồng này;</div>
        <div class="hd-text">- Yêu cầu Bên A tổ chức tiếp nhận gỗ nhanh chóng, an toàn và dứt điểm;</div>
        <div class="hd-text">- Các quyền khác theo quy định pháp luật và tại Hợp đồng này.</div>
        <div class="hd-text bold">5.2. Nghĩa vụ của Bên B</div>
        <div class="hd-text">- Giao hàng đúng số lượng, chất lượng, kích thước và đúng thời gian thỏa thuận tại Hợp đồng này và Phụ lục kèm theo;</div>
        <div class="hd-text">- Cung cấp mọi chỉ dẫn cần thiết cho việc bảo quản gỗ cho Bên A;</div>
        <div class="hd-text">- Cung cấp hồ sơ nguồn gốc gỗ và các hồ sơ khác có liên quan cho Bên A;</div>
        <div class="hd-text">- Không được vi phạm các điều cấm trong hoạt động lâm nghiệp;</div>
        <div class="hd-text">- Chịu trách nhiệm trước pháp luật về những nội dung kê khai và nguồn gốc gỗ hợp pháp tại Bảng kê lâm sản;</div>
        <div class="hd-text">- Các nghĩa vụ khác theo thỏa thuận của các bên và quy định pháp luật.</div>

        <div class="hd-section">Điều 6: Thời điểm chịu rủi ro</div>
        <div class="hd-text">1. Bên B phải chịu toàn bộ rủi ro đối với gỗ trong suốt quá trình vận chuyển đến địa điểm bãi 1 để bàn giao cho Bên A.</div>
        <div class="hd-text">2. Sau 2 ngày kể từ thời điểm bàn giao gỗ mà Bên A không khiếu nại, phản ánh gì về số lượng, chất lượng gỗ với Bên B thì Bên B không phải chịu bất cứ trách nhiệm phát sinh về số lượng, chất lượng gỗ đã bàn giao.</div>

        <div class="hd-section">Điều 7: Quyền đơn phương chấm dứt Hợp đồng</div>
        <div class="hd-text bold">7.1. Quyền đơn phương chấm dứt Hợp đồng của Bên A</div>
        <div class="hd-text">Bên A có quyền đơn phương chấm dứt Hợp đồng trong các trường hợp:</div>
        <div class="hd-text">- Bên B không cung cấp đủ số lượng gỗ theo kế hoạch cho Bên A;</div>
        <div class="hd-text">- Gỗ bàn giao không đảm bảo chất lượng, tiêu chuẩn, vượt quá sai số cho phép theo thỏa thuận tại Hợp đồng này và Phụ lục kèm theo;</div>
        <div class="hd-text">- Bên B có hành vi không thực hiện đúng, đầy đủ, vi phạm nghiêm trọng Hợp đồng này và việc tiếp tục thực hiện sẽ gây tổn thất nặng nề và làm ảnh hưởng nghiêm trọng đến quyền lợi của Bên A;</div>
        <div class="hd-text">- Các trường hợp khác thỏa thuận tại Hợp đồng này và theo quy định pháp luật;</div>
        <div class="hd-text bold">7.2. Quyền đơn phương chấm dứt Hợp đồng của Bên B</div>
        <div class="hd-text">Bên B có quyền đơn phương chấm dứt Hợp đồng trong các trường hợp:</div>
        <div class="hd-text">- Bên A không thanh toán đầy đủ, đúng hạn giá trị Hợp đồng theo thỏa thuận tại Hợp đồng này và Phụ lục kèm theo cho Bên B trong thời gian 30 ngày, kể từ ngày đến hạn thanh toán theo thỏa thuận;</div>
        <div class="hd-text">- Bên A có hành vi không thực hiện đúng, đầy đủ, vi phạm các nghĩa vụ thỏa thuận tại Hợp đồng này;</div>
        <div class="hd-text">- Các trường hợp khác thỏa thuận tại Hợp đồng này và theo quy định pháp luật.</div>

        <div class="hd-section">Điều 8: Trách nhiệm khi đơn phương chấm dứt Hợp đồng</div>
        <div class="hd-text">8.1. Khi một bên cho rằng bên kia có hành vi vi phạm nghĩa vụ Hợp đồng thì bên phát hiện có trách nhiệm thông báo và nêu rõ hành vi vi phạm bằng văn bản cho bên kia biết. Thông báo phải chỉ rõ sai phạm của bên kia, mức độ ảnh hưởng và thời gian khắc phục các sai phạm. Trong thời hạn 15 ngày, kể từ ngày nhận được Thông báo, bên vi phạm có trách nhiệm khắc phục các sai phạm.</div>
        <div class="hd-text">8.2. Hết thời hạn khắc phục quy định tại Thông báo mà bên vi phạm không thực hiện việc khắc phục đầy đủ các sai phạm thì bên đề nghị có quyền Thông báo đơn phương chấm dứt Hợp đồng. Hợp đồng sẽ chấm dứt trong thời hạn 07 ngày, kể từ ngày bên vi phạm nhận được Thông báo.</div>

        <div class="hd-section">Điều 9: Giải quyết tranh chấp</div>
        <div class="hd-text">Trong trường hợp phát sinh tranh chấp liên quan đến Hợp đồng này, các bên trước hết cùng giải quyết trên cơ sở đàm phán, thương lượng hoặc hòa giải. Nếu các bên vẫn không đạt được thỏa thuận bằng đàm phán, thương lượng hoặc hòa giải, các bên có quyền khởi kiện tại Tòa án có thẩm quyền nơi Bên A có trụ sở để giải quyết theo quy định hiện hành của pháp luật Việt Nam.</div>

        <div class="hd-section">Điều 10: Hiệu lực của Hợp đồng</div>
        <div class="hd-text">Hợp đồng này có hiệu lực kể từ ngày ký và chấm dứt hiệu lực một trong các trường hợp sau:</div>
        <div class="hd-text">- Theo thỏa thuận của các bên;</div>
        <div class="hd-text">- Một trong hai bên không thể tiếp tục thực hiện Hợp đồng này do sự kiện bất khả kháng theo quy định pháp luật và sự kiện này ảnh hưởng đến các bên tham gia Hợp đồng làm một trong hai Bên hoặc cả hai Bên không có khả năng tiếp tục thực hiện Hợp đồng;</div>
        <div class="hd-text">- Một trong các bên vi phạm nghiêm trọng Hợp đồng này và việc tiếp tục thực hiện sẽ gây tổn thất nặng nề và làm ảnh hưởng nghiêm trọng đến quyền lợi của bên kia;</div>
        <div class="hd-text">- Các trường hợp đơn phương chấm dứt Hợp đồng được quy định trong Hợp đồng này;</div>
        <div class="hd-text">- Các Bên có thể chấm dứt Hợp đồng trước thời hạn căn cứ theo quy định của pháp luật về việc giải thể, phá sản nếu một trong các Bên bị giải thể, phá sản;</div>

        <div class="hd-section">Điều 11: Điều khoản chung</div>
        <div class="hd-text">Hai bên cam kết thực hiện nghiêm chỉnh, đầy đủ các quy định trong Hợp đồng này và Phụ lục kèm theo.</div>
        <div class="hd-text">Mọi sửa đổi và bổ sung Hợp đồng, Phụ lục Hợp đồng chỉ có giá trị pháp lý khi được hai bên lập thành văn bản.</div>
        <div class="hd-text">Hợp đồng này gồm 11 điều, 06 trang được lập thành 03 (ba) bản gốc có nội dung và giá trị pháp lý như nhau, Bên A giữ 02 (hai) bản, Bên B giữ 01 (một) bản.</div>
        <div class="hd-text">Hai bên đã đọc kỹ lại bản Hợp đồng này một lần nữa, hiểu rõ những gì thỏa thuận ở trên và ký tên dưới đây để làm căn cứ thực hiện.</div>

        <!-- Ký tên -->
        <div class="sign-area q-mt-lg">
          <div class="sign-col">
            <div class="sign-title">ĐẠI DIỆN BÊN A</div>
            <div class="sign-space"></div>
            <div class="sign-name"></div>
          </div>
          <div class="sign-col">
            <div class="sign-title">ĐẠI DIỆN BÊN B</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ tenHoUpper }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Phụ lục hợp đồng -->
    <div v-if="lo && (viewMode === 'plhd' || viewMode === 'all')"
         class="print-area"
         :class="{ 'plhd-break': viewMode === 'all' }">
      <div class="hd-form">
        <div class="hd-header">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="hd-header bold">Độc lập - Tự do - Hạnh phúc</div>
        <div class="hd-separator">──────────</div>

        <div class="hd-title">PHỤ LỤC HỢP ĐỒNG</div>
        <div class="hd-center">Số: {{ soPhuLuc }}</div>

        <div class="hd-text">- Căn cứ vào các văn bản quy phạm pháp luật hiện hành;</div>
        <div class="hd-text">- Căn cứ vào Hợp đồng nguyên tắc mua bán gỗ số {{ soHopDong }} ngày {{ ngayHD.ngay }} tháng {{ ngayHD.thang }} năm {{ ngayHD.nam }};</div>
        <div class="hd-text">- Căn cứ nhu cầu và khả năng của hai bên.</div>
        <div class="hd-text indent q-mt-sm">
          Hôm nay, ngày <b>{{ ngayPL.ngay }}</b> tháng <b>{{ ngayPL.thang }}</b> năm <b>{{ ngayPL.nam }}</b>, tại trụ sở {{ xuongTen }} - Địa chỉ: {{ xuongDiaChi }}, chúng tôi gồm:
        </div>

        <!-- Bên A -->
        <div class="hd-section">I. BÊN MUA (Sau đây được gọi tắt là Bên A)</div>
        <div class="hd-text bold">{{ xuongTen }}</div>
        <div class="hd-text">Mã số doanh nghiệp: <b>{{ xuongMST }}</b></div>
        <div class="hd-text">Trụ sở: {{ xuongDiaChi }}</div>
        <div class="hd-text">Mã chứng chỉ: <b>{{ xuongCCRaw }}</b> &nbsp;&nbsp;&nbsp;&nbsp; Hiệu lực: <b>{{ xuongHieuLuc }}</b></div>
        <div class="hd-text">Người đại diện: {{ xuongNguoiDD }}</div>
        <div class="hd-text" v-if="xuongUQNguoi">
          Người đại diện thu mua gỗ keo tròn FSC100% theo ủy quyền: <b>{{ xuongUQNguoi }}</b>
        </div>

        <!-- Bên B -->
        <div class="hd-section">II. BÊN BÁN (Sau đây được gọi tắt là Bên B)</div>
        <div class="hd-text">Ông/Bà: <b>{{ tenHoUpper }}</b></div>
        <div class="hd-text">CCCD số: <b>{{ lo.cccd || '..............................' }}</b></div>
        <div class="hd-text">Địa chỉ: {{ lo.dia_chi_cccd || diaChiBenB }}</div>
        <div class="hd-text">Mã chứng chỉ rừng: <b>{{ lo.chung_chi || '...............' }}</b></div>
        <div class="hd-text" v-if="lo.nhom_chung_chi">Thuộc nhóm chứng chỉ rừng FSC: <b>{{ lo.nhom_chung_chi }}</b></div>

        <!-- Thông tin lô khai thác (Khoảnh, Lô, Diện tích) — 1 dòng/lô -->
        <div class="hd-text q-mt-sm" v-for="(lot, li) in (lo.lo_list || [])" :key="li">
          Khoảnh: <b>{{ lot.khoanh || '' }}</b> &nbsp;&nbsp;&nbsp;&nbsp;
          Lô: <b>{{ lot.lo || '' }}</b> &nbsp;&nbsp;&nbsp;&nbsp;
          Diện tích <b>{{ fmtNum(lot.dien_tich) }}</b> (ha)
        </div>

        <div class="hd-text q-mt-sm">
          Hai bên cùng trao đổi và thống nhất ký kết Phụ lục Hợp đồng mua bán gỗ tròn keo tai tượng rừng trồng FSC 100% (Acacia mangium) với các nội dung sau:
        </div>

        <div class="hd-section">Điều 1: Nội dung của Phụ lục Hợp đồng</div>
        <div class="hd-text">
          Căn cứ vào các quy định pháp luật và Hợp đồng nguyên tắc mua bán gỗ số: {{ soHopDong }} ngày {{ ngayHD.ngay }}/{{ ngayHD.thang }}/{{ ngayHD.nam }} ký kết giữa hai bên, Bên B đồng ý bán gỗ tròn keo tai tượng (Acacia mangium) FSC 100% (do Bên B tự trồng) cho Bên A và Bên A đồng ý nhận mua gỗ tròn keo tai tượng (Acacia mangium) FSC 100% từ Bên B với các thông tin cụ thể như sau:
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>STT</th><th>Chủng loại gỗ</th><th>Đơn vị tính<br/>(m³)</th>
              <th>Số lượng</th><th>Đơn giá<br/>(đồng/m³)</th><th>Thành tiền</th><th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td class="left">Gỗ tròn keo tai tượng FSC 100%, đường kính từ 13cm trở lên</td>
              <td>m³</td>
              <td class="num">{{ fmtNum(lo.tong_kl_go) }}</td>
              <td class="num">{{ fmtMoney(lo.don_gia) }}</td>
              <td class="num">{{ fmtMoney(thanhTien) }}</td>
              <td></td>
            </tr>
            <tr class="total-row">
              <td colspan="3" class="bold">TỔNG</td>
              <td class="num bold">{{ fmtNum(lo.tong_kl_go) }}</td>
              <td></td>
              <td class="num bold">{{ fmtMoney(thanhTien) }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div class="hd-text q-mt-sm">Giá trị đơn hàng nêu trên chưa bao gồm tiền thuế thu nhập cá nhân theo quy định.</div>
        <div class="hd-text">Hai bên cùng nhau thống nhất cách đo cho từng lô gỗ, sau khi thống nhất xong sẽ lập thành biên bản bàn giao.</div>

        <div class="hd-section">Điều 2: Yêu cầu về chất lượng gỗ</div>
        <div class="hd-text">Gỗ keo tròn FSC 100% bàn giao phải đảm bảo yêu cầu chung sau:</div>
        <div class="hd-text">- Có đường kính ≥ 13 cm, chiều dài ≥ 2m.</div>
        <div class="hd-text">- Không được mục ải, rỗng ruột hoặc cong vênh.</div>

        <div class="hd-section">Điều 3: Địa điểm và thời gian giao hàng</div>
        <div class="hd-text">- Địa điểm giao hàng: Tại địa chỉ bãi 1 do bên B chỉ định</div>
        <div class="hd-text">- Thời gian giao hàng: Sẽ được bên B thông báo tới bên A.</div>

        <div class="hd-section">Điều 4: Hiệu lực của Phụ lục hợp đồng</div>
        <div class="hd-text">Phụ lục này là một phần không thể tách rời của Hợp đồng và có hiệu lực như Hợp đồng nguyên tắc mua bán gỗ số: {{ soHopDong }} ngày {{ ngayHD.ngay }}/{{ ngayHD.thang }}/{{ ngayHD.nam }}.</div>
        <div class="hd-text">Phụ lục Hợp đồng có hiệu lực kể từ ngày ký và tự động chấm dứt hiệu lực khi Bên A nhận bàn giao đủ số lượng gỗ và thanh toán cho Bên B theo quy định tại Hợp đồng và Phụ lục này.</div>
        <div class="hd-text">Phụ lục này được lập thành 03 (ba) bản có nội dung và giá trị pháp lý như nhau, Bên A giữ 02 (hai) bản, Bên B giữ 01 (một) bản (đính kèm hợp đồng chính) làm căn cứ thực hiện.</div>

        <!-- Ký tên -->
        <div class="sign-area q-mt-lg">
          <div class="sign-col">
            <div class="sign-title">ĐẠI DIỆN BÊN A</div>
            <div class="sign-space"></div>
            <div class="sign-name"></div>
          </div>
          <div class="sign-col">
            <div class="sign-title">ĐẠI DIỆN BÊN B</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ tenHoUpper }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!lo && !loading" class="text-center text-grey-5 q-mt-xl no-print">
      Chọn tháng → Tải dữ liệu → Chọn lô gỗ để xem PLHĐ
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
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
      viewMode: "hd",
      // Thông tin xưởng xẻ
      xuongTen: "",
      xuongMST: "",
      xuongDiaChi: "",
      xuongCC: "",       // hiển thị dạng "ma. Hiệu lực ..."
      xuongCCRaw: "",    // chỉ ma chứng chỉ (dùng riêng cho HĐ)
      xuongHieuLuc: "",
      xuongNguoiDD: "",
      xuongUQNguoi: "",
      xuongCode: "",
    };
  },
  computed: {
    diaChiBenB() {
      return this.lo && this.lo.xa ? this.lo.xa : "";
    },
    thanhTien() {
      if (!this.lo) return 0;
      if (this.lo.tong_thanh_tien) return Math.round(this.lo.tong_thanh_tien);
      if (!this.lo.tong_kl_go || !this.lo.don_gia) return 0;
      return Math.round(this.lo.tong_kl_go * this.lo.don_gia);
    },
    /** Tên hộ in hoa, dùng khi hiển thị Bên B trong HĐ. */
    tenHoUpper() {
      return this.lo && this.lo.ten_ho ? this.lo.ten_ho.toUpperCase() : "";
    },
    /** Viết tắt từ tên hộ: "ĐẶNG VĂN OÀNH" → "ĐVO". */
    benBInitials() {
      if (!this.lo || !this.lo.ten_ho) return "XYZ";
      return this.lo.ten_ho.trim().split(/\s+/)
        .map(w => w.charAt(0).toUpperCase()).join("");
    },
    /**
     * Số HĐ — ưu tiên cột so_hop_dong nhập từ Excel KH.
     * Fallback: dựng từ Mã lô gỗ "{stt}-{yy}/HĐMB-{xuongCode}-{initials}".
     */
    soHopDong() {
      if (this.lo && this.lo.so_hop_dong) return this.lo.so_hop_dong;
      const code = this.xuongCode || "XXX";
      const { stt, yy } = this.parseLoGoTron();
      const base = `${stt}-${yy}/HĐMB-${code}`;
      return code === "LT" ? base : `${base}-${this.benBInitials}`;
    },
    /** Số PLHĐ — ưu tiên cột so_phu_luc nhập từ Excel KH. */
    soPhuLuc() {
      if (this.lo && this.lo.so_phu_luc) return this.lo.so_phu_luc;
      const code = this.xuongCode || "XXX";
      const { stt, yy } = this.parseLoGoTron();
      const base = `${stt}-${yy}/PLHĐ-${code}`;
      return code === "LT" ? base : `${base}-${this.benBInitials}`;
    },
    /** Ngày ký HĐ — ưu tiên cột ngay_hop_dong nhập từ Excel KH, fallback = hôm nay. */
    ngayHD() {
      const parsed = this.parseDateString(this.lo && this.lo.ngay_hop_dong);
      const d = parsed || new Date();
      return { ngay: d.getDate(), thang: d.getMonth() + 1, nam: d.getFullYear() };
    },
    /** Ngày ký PLHĐ — ưu tiên cột ngay_phu_luc, fallback dùng ngày HĐ. */
    ngayPL() {
      const parsed = this.parseDateString(this.lo && this.lo.ngay_phu_luc);
      if (parsed) {
        return { ngay: parsed.getDate(), thang: parsed.getMonth() + 1, nam: parsed.getFullYear() };
      }
      return this.ngayHD;
    },
  },
  async created() { await this.loadXuongXe(); },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },
    fmtNum(v) { return v == null ? "" : Number(v).toFixed(2); },
    fmtMoney(v) { return v == null ? "" : Math.round(Number(v)).toLocaleString("vi-VN"); },
    /**
     * Parse chuỗi ngày từ Excel — chấp nhận "12/05/2026", "12-05-2026", "2026-05-12",
     * hoặc Date đã được xlsx convert. Trả về Date hoặc null.
     */
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
    /**
     * Tách "FSCLOG25-266" → { stt: "266", yy: "25" }.
     * Nếu không khớp pattern, dùng "001" và 2 chữ số cuối của năm đang chọn.
     */
    parseLoGoTron() {
      const yyFallback = String(this.nam).slice(-2);
      const lots = (this.lo && this.lo.lo_list) || [];
      const code = (lots[0] && lots[0].lo_go_tron) || "";
      const m = code.match(/^FSCLOG(\d{2})-(\d+)/i);
      if (m) return { yy: m[1], stt: m[2] };
      return { yy: yyFallback, stt: "001" };
    },
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
    onSelectLo(item) {
      this.lo = item;
    },
    applyXuong() {
      const cfg = this.getXuongConfig(this.xuongXe);
      this.xuongTen = cfg.ten || "";
      this.xuongMST = cfg.mst || "";
      this.xuongDiaChi = cfg.dia_chi || "";
      this.xuongCCRaw = cfg.chung_chi || "";
      this.xuongHieuLuc = cfg.hieu_luc_cc || "";
      this.xuongCC = this.xuongCCRaw + (this.xuongHieuLuc ? ". Hiệu lực " + this.xuongHieuLuc : "");
      this.xuongNguoiDD = (cfg.nguoi_dai_dien || "") + (cfg.chuc_vu ? " - Chức vụ: " + cfg.chuc_vu : "");
      this.xuongUQNguoi = cfg.nguoi_nhan || "";
      this.xuongCode = cfg.ma || "";
    },
    printPage() { window.print(); },
  },
};
</script>

<style scoped>
.hd-form {
  border: 1px solid #333;
  padding: 24px 32px;
  font-size: 13px;
  font-family: "Times New Roman", serif;
  line-height: 1.7;
  max-width: 800px;
}
.hd-header { text-align: center; font-size: 13px; }
.hd-separator { text-align: center; margin-bottom: 12px; }
.hd-title { text-align: center; font-weight: bold; font-size: 16px; margin: 12px 0; }
.hd-center { text-align: center; margin-bottom: 12px; }
.hd-section { font-weight: bold; margin-top: 12px; margin-bottom: 4px; }
.hd-text { margin-left: 8px; }
.hd-text.indent { text-indent: 2em; }
.hd-row { margin-left: 8px; }
.hd-row .lbl { font-weight: bold; margin-right: 8px; }
.bold { font-weight: bold; }
.left { text-align: left; }
.data-table { width: 100%; border-collapse: collapse; margin: 8px 0; }
.data-table th, .data-table td { border: 1px solid #333; padding: 4px 8px; text-align: center; font-size: 11px; }
.data-table th { background: #f0f0f0; font-weight: bold; }
.data-table .num { text-align: right; }
.data-table .total-row td { font-weight: bold; }
.sign-area { display: flex; justify-content: space-between; }
.sign-col { text-align: center; width: 40%; }
.sign-title { font-weight: bold; }
.sign-space { height: 70px; }
.sign-name { font-weight: bold; }

@media print {
  .no-print { display: none !important; }
  .hd-form { border: 1px solid #000; }
  /* Khi in cả 2 (HĐ + PLHĐ): PLHĐ bắt đầu trang mới */
  .plhd-break { page-break-before: always; break-before: page; }
  @page { size: portrait A4; margin: 10mm; }
}
</style>
