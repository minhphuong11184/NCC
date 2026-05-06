<template>
  <q-page class="q-pa-md">

    <!-- Header -->
    <div class="row items-center q-mb-md">
      <q-icon name="fingerprint" size="28px" color="blue-8" class="q-mr-sm" />
      <div class="text-h6 text-blue-8">Quản lý máy chấm công ZKTeco</div>
    </div>

    <!-- Tabs -->
    <q-tabs v-model="tab" dense align="left" active-color="blue-8" indicator-color="blue-8" class="q-mb-md">
      <q-tab name="machines" icon="devices"    label="Danh sách máy" />
      <q-tab name="logs"     icon="event_note" label="Dữ liệu chấm công" />
    </q-tabs>

    <!-- ═══════════════════════════════════════════════════
         TAB 1: QUẢN LÝ MÁY
    ════════════════════════════════════════════════════ -->
    <div v-if="tab === 'machines'">

      <!-- Toolbar -->
      <div class="row items-center q-gutter-sm q-mb-md">
        <q-btn color="blue-8" icon="add" label="Thêm máy" @click="openAddDialog" />
        <q-btn color="teal-7" icon="sync" label="Đồng bộ tất cả"
          :loading="syncing" @click="syncAll" />
        <q-space />
        <q-select
          v-model="filterFactory"
          :options="factories" option-value="value" option-label="label"
          emit-value map-options clearable outlined dense
          style="min-width:200px" placeholder="Lọc nhà máy"
        />
      </div>

      <!-- Kéo dữ liệu theo khoảng ngày -->
      <q-card class="q-mb-md" flat bordered>
        <q-card-section class="q-pa-sm">
          <div class="row items-center q-gutter-sm">
            <q-icon name="date_range" color="orange-8" size="20px" />
            <span class="text-caption text-bold text-orange-8">Kéo dữ liệu theo ngày</span>
            <q-select
              v-model="rangeSync.machineId"
              :options="machineOptions" option-value="value" option-label="label"
              emit-value map-options outlined dense clearable
              label="Chọn máy *"
              style="min-width:180px"
            />
            <q-input v-model="rangeSync.fromDate" type="date" outlined dense label="Từ ngày"
              style="min-width:150px" />
            <q-input v-model="rangeSync.toDate" type="date" outlined dense label="Đến ngày"
              style="min-width:150px" />
            <q-btn color="orange-8" icon="download" label="Kéo dữ liệu"
              :loading="rangeSyncing" @click="syncRange" />
          </div>
        </q-card-section>
      </q-card>

      <!-- Bảng máy -->
      <q-card>
        <q-table
          :data="filteredMachines"
          :columns="machineColumns"
          row-key="id"
          :loading="loadingMachines"
          flat dense
          :pagination="{ rowsPerPage: 20 }"
        >
          <!-- Active toggle -->
          <template v-slot:body-cell-active="props">
            <q-td :props="props" class="text-center">
              <q-chip
                dense
                :color="props.row.active ? 'positive' : 'grey-5'"
                text-color="white"
                size="sm"
              >{{ props.row.active ? 'Đang dùng' : 'Tắt' }}</q-chip>
            </q-td>
          </template>

          <!-- lastSync -->
          <template v-slot:body-cell-lastSync="props">
            <q-td :props="props">
              <span class="text-caption text-grey-7">
                {{ props.row.lastSync ? formatTime(props.row.lastSync) : '—' }}
              </span>
            </q-td>
          </template>

          <!-- Actions -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-xs">
              <!-- Debug kéo dữ liệu -->
              <q-btn flat round dense size="sm" icon="bug_report" color="purple-7"
                :loading="debuggingId === props.row.id"
                @click="debugMachine(props.row)">
                <q-tooltip>Debug kéo dữ liệu</q-tooltip>
              </q-btn>
              <!-- Test kết nối -->
              <q-btn flat round dense size="sm" icon="wifi_tethering"
                :loading="testingId === props.row.id"
                :color="testResults[props.row.id] === true ? 'positive' : testResults[props.row.id] === false ? 'negative' : 'orange-7'"
                @click="testConnection(props.row)">
                <q-tooltip>Test kết nối</q-tooltip>
              </q-btn>
              <q-btn flat round dense size="sm" icon="sync" color="teal-7"
                :loading="syncingId === props.row.id"
                @click="syncOne(props.row)">
                <q-tooltip>Kéo dữ liệu ngay</q-tooltip>
              </q-btn>
              <q-btn flat round dense size="sm" icon="edit" color="blue-7"
                @click="openEditDialog(props.row)">
                <q-tooltip>Sửa</q-tooltip>
              </q-btn>
              <q-btn flat round dense size="sm"
                :icon="props.row.active ? 'toggle_on' : 'toggle_off'"
                :color="props.row.active ? 'positive' : 'grey-5'"
                @click="toggleActive(props.row)">
                <q-tooltip>{{ props.row.active ? 'Tắt máy' : 'Bật máy' }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>

      <!-- Kết quả sync -->
      <q-card v-if="syncResults.length" class="q-mt-md">
        <q-card-section class="q-pa-sm">
          <div class="text-caption text-bold q-mb-xs">Kết quả đồng bộ lần cuối</div>
          <div v-for="r in syncResults" :key="r.ip" class="row items-center q-gutter-xs q-mb-xs">
            <q-icon :name="r.success ? 'check_circle' : 'error'"
              :color="r.success ? 'positive' : 'negative'" size="16px" />
            <span class="text-caption text-bold">{{ r.machine }}</span>
            <span class="text-caption text-grey-7">({{ r.ip }})</span>
            <q-chip dense size="xs" :color="r.success ? 'teal-6' : 'red-6'" text-color="white">
              {{ r.success ? `+${r.inserted} bản ghi` : r.error }}
            </q-chip>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- ═══════════════════════════════════════════════════
         TAB 2: DỮ LIỆU CHẤM CÔNG
    ════════════════════════════════════════════════════ -->
    <div v-if="tab === 'logs'">
      <!-- Bộ lọc -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md items-end">
            <div class="col-12 col-md-2">
              <div class="text-caption text-grey-7 q-mb-xs">Nhà máy</div>
              <q-select v-model="logFilter.factoryId"
                :options="factories" option-value="value" option-label="label"
                emit-value map-options clearable outlined dense label="Tất cả" />
            </div>
            <div class="col-12 col-md-2">
              <div class="text-caption text-grey-7 q-mb-xs">Máy chấm công</div>
              <q-select v-model="logFilter.machineId"
                :options="machineOptions" option-value="value" option-label="label"
                emit-value map-options clearable outlined dense label="Tất cả" />
            </div>
            <div class="col-12 col-md-2">
              <div class="text-caption text-grey-7 q-mb-xs">Ngày</div>
              <q-input v-model="logFilter.date" type="date" outlined dense />
            </div>
            <div class="col-12 col-md-2">
              <div class="text-caption text-grey-7 q-mb-xs">Mã NV</div>
              <q-input v-model="logFilter.userId" outlined dense clearable
                placeholder="Nhập mã NV..." />
            </div>
            <div class="col-auto">
              <q-btn color="blue-8" icon="search" label="Xem" :loading="loadingLogs"
                @click="loadLogs" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Stats -->
      <div v-if="logs.length" class="row q-gutter-sm q-mb-md">
        <q-chip icon="people" color="blue-8" text-color="white">
          {{ uniqueUsers }} nhân viên
        </q-chip>
        <q-chip icon="event_note" color="teal-7" text-color="white">
          {{ logs.length }} lượt chấm
        </q-chip>
      </div>

      <!-- Bảng log -->
      <q-card>
        <q-table
          :data="logs"
          :columns="logColumns"
          row-key="id"
          :loading="loadingLogs"
          flat dense
          :pagination="{ rowsPerPage: 50 }"
          :filter="logSearch"
        >
          <template v-slot:top-right>
            <q-input v-model="logSearch" dense outlined placeholder="Tìm mã NV..." clearable>
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
          </template>

          <template v-slot:body-cell-punchType="props">
            <q-td :props="props">
              <q-chip dense size="sm"
                :color="punchTypeColor(props.row.punchType)"
                text-color="white">
                {{ punchTypeLabel(props.row.punchType) }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-punchTime="props">
            <q-td :props="props">{{ formatTime(props.row.punchTime) }}</q-td>
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- ═══════════════════════════════════════════════════
         DIALOG THÊM / SỬA MÁY
    ════════════════════════════════════════════════════ -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width:380px">
        <q-card-section class="bg-blue-8 text-white row items-center">
          <q-icon name="devices" class="q-mr-sm" />
          <span class="text-subtitle1">{{ editMode ? 'Sửa máy chấm công' : 'Thêm máy chấm công' }}</span>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-sm">
          <q-input v-model="form.name" outlined dense label="Tên máy *"
            placeholder="VD: Máy CC Cổng A" />
          <q-input v-model="form.ip" outlined dense label="Địa chỉ IP *"
            placeholder="VD: 192.168.1.201" />
          <q-input v-model.number="form.port" type="number" outlined dense
            label="Port" hint="Mặc định 4370" />
          <q-select v-model="form.factoryId"
            :options="factories" option-value="value" option-label="label"
            emit-value map-options outlined dense label="Nhà máy" clearable />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Hủy" v-close-popup />
          <q-btn color="blue-8" :label="editMode ? 'Lưu' : 'Thêm'"
            :loading="saving" @click="saveMachine" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { date } from 'quasar'

const FACTORIES = [
  { label: 'Thuận Hưng (100000)',   value: 100000 },
  { label: 'Quang Minh (100002)',   value: 100002 },
  { label: 'Yên Sơn 1B (100004)',  value: 100004 },
  { label: 'Yên Sơn YS4 (100005)', value: 100005 },
  { label: 'Yên Sơn 1 (102340)',   value: 102340 },
  { label: 'Thái Bình (102366)',   value: 102366 },
]

export default {
  name: 'PageChamCong',

  data() {
    return {
      tab: 'machines',
      factories: FACTORIES,
      filterFactory: null,

      // Máy chấm công
      machines: [],
      loadingMachines: false,
      syncing: false,
      syncingId: null,
      syncResults: [],
      testingId: null,
      testResults: {},   // { [machineId]: true/false }
      debuggingId: null,

      // Kéo theo ngày
      rangeSyncing: false,
      rangeSync: {
        machineId: null,
        fromDate: date.formatDate(new Date(), 'YYYY-MM-DD'),
        toDate:   date.formatDate(new Date(), 'YYYY-MM-DD'),
      },

      // Dialog
      dialog: false,
      editMode: false,
      saving: false,
      form: { id: null, name: '', ip: '', port: 4370, factoryId: null },

      // Logs
      logs: [],
      loadingLogs: false,
      logSearch: '',
      logFilter: {
        factoryId: null,
        machineId: null,
        date: date.formatDate(new Date(), 'YYYY-MM-DD'),
        userId: ''
      },

      machineColumns: [
        { name: 'name',      label: 'Tên máy',          field: 'name',      align: 'left'  },
        { name: 'ip',        label: 'IP',                field: 'ip',        align: 'left'  },
        { name: 'port',      label: 'Port',              field: 'port',      align: 'center'},
        { name: 'factoryId', label: 'Nhà máy',           field: 'factoryId',
          format: val => FACTORIES.find(f => f.value === val)?.label?.split(' (')[0] || '—',
          align: 'left' },
        { name: 'active',    label: 'Trạng thái',        field: 'active',    align: 'center'},
        { name: 'lastSync',  label: 'Đồng bộ lần cuối', field: 'lastSync',  align: 'left'  },
        { name: 'actions',   label: '',                  field: 'actions',   align: 'center'},
      ],

      logColumns: [
        { name: 'userId',      label: 'Mã NV',       field: 'userId',      align: 'left'  },
        { name: 'punchTime',   label: 'Thời gian',   field: 'punchTime',   align: 'left'  },
        { name: 'punchType',   label: 'Loại',        field: 'punchType',   align: 'center'},
        { name: 'machineName', label: 'Máy',         field: 'machineName', align: 'left'  },
      ],
    }
  },

  computed: {
    filteredMachines() {
      if (!this.filterFactory) return this.machines
      return this.machines.filter(m => m.factoryId === this.filterFactory)
    },

    machineOptions() {
      return this.machines.map(m => ({ label: m.name, value: m.id }))
    },

    uniqueUsers() {
      return new Set(this.logs.map(l => l.userId)).size
    }
  },

  mounted() {
    this.loadMachines()
  },

  methods: {
    ...mapActions('prod', [
      'getAttendanceMachines',
      'addAttendanceMachine',
      'updateAttendanceMachine',
      'syncAttendanceAll',
      'syncAttendanceOne',
      'getAttendanceLogs',
      'testAttendanceMachine',
      'debugAttendanceMachine',
      'syncAttendanceRange',
    ]),

    async loadMachines() {
      this.loadingMachines = true
      try {
        const data = await this.getAttendanceMachines()
        this.machines = data?.data || []
      } catch (err) {
        this.$q.notify({ type: 'negative', message: err.message, position: 'top' })
      } finally {
        this.loadingMachines = false
      }
    },

    async syncAll() {
      this.syncing = true
      this.syncResults = []
      try {
        const res = await this.syncAttendanceAll()
        this.syncResults = res?.data || []
        const total = this.syncResults.reduce((s, r) => s + (r.inserted || 0), 0)
        this.$q.notify({ type: 'positive', message: `Đồng bộ xong: +${total} bản ghi`, position: 'top' })
        await this.loadMachines()
      } catch (err) {
        this.$q.notify({ type: 'negative', message: err.message, position: 'top' })
      } finally {
        this.syncing = false
      }
    },

    async syncRange() {
      const { machineId, fromDate, toDate } = this.rangeSync
      if (!machineId) {
        this.$q.notify({ type: 'warning', message: 'Vui lòng chọn máy chấm công', position: 'top' })
        return
      }
      if (!fromDate || !toDate) {
        this.$q.notify({ type: 'warning', message: 'Vui lòng chọn khoảng ngày', position: 'top' })
        return
      }
      if (fromDate > toDate) {
        this.$q.notify({ type: 'warning', message: 'Từ ngày phải nhỏ hơn hoặc bằng đến ngày', position: 'top' })
        return
      }
      this.rangeSyncing = true
      try {
        const res = await this.syncAttendanceRange({ machineId, fromDate, toDate })
        if (!res) return // postRequest đã hiển thị thông báo lỗi HTTP
        const r = res?.data
        let msg, type
        if (!r?.success) {
          type = 'negative'
          msg = r?.error || 'Lỗi kết nối máy chấm công'
        } else if (r.filtered === 0) {
          type = 'warning'
          msg = `${r.machine}: không có dữ liệu từ ${fromDate} → ${toDate}. `
              + (r.machineMinDate
                  ? `Máy có dữ liệu từ ${r.machineMinDate} đến ${r.machineMaxDate}`
                  : 'Máy chưa có dữ liệu nào')
        } else {
          type = 'positive'
          msg = `${r.machine}: lọc ${r.filtered}/${r.total} bản ghi, +${r.inserted} mới (${fromDate} → ${toDate})`
        }
        this.$q.notify({ type, message: msg, position: 'top', timeout: 6000 })
        await this.loadMachines()
      } catch (err) {
        this.$q.notify({ type: 'negative', message: err.message, position: 'top' })
      } finally {
        this.rangeSyncing = false
      }
    },

    async syncOne(machine) {
      this.syncingId = machine.id
      try {
        const res = await this.syncAttendanceOne(machine.id)
        const r = res?.data
        this.$q.notify({
          type: r?.success ? 'positive' : 'negative',
          message: r?.success ? `${machine.name}: +${r.inserted} bản ghi mới` : (r?.error || 'Lỗi'),
          position: 'top'
        })
        await this.loadMachines()
      } catch (err) {
        this.$q.notify({ type: 'negative', message: err.message, position: 'top' })
      } finally {
        this.syncingId = null
      }
    },

    async debugMachine(machine) {
      this.debuggingId = machine.id
      this.$q.notify({ type: 'info', message: `Đang kéo thử từ ${machine.name}... (tối đa 30s)`, position: 'top', timeout: 3000 })
      try {
        const res = await this.debugAttendanceMachine(machine.id)
        const r = res?.data
        if (r?.error && !r?.recordCount) {
          // Lỗi kết nối hoàn toàn (không lấy được bất kỳ bản ghi nào)
          this.$q.dialog({
            title: `Debug: ${machine.name}`,
            message: `<b>Lỗi:</b> ${r.error}<br><b>Giao thức:</b> ${r.connectionType || '?'}`,
            html: true
          })
        } else {
          this.$q.dialog({
            title: `Debug: ${machine.name}`,
            message: `
              <b>Giao thức:</b> ${r?.connectionType}<br>
              <b>Tổng bản ghi trong máy (getInfo):</b> ${r?.logCountsOnMachine ?? '?'}<br>
              <b>Dung lượng tối đa:</b> ${r?.logCapacity ?? '?'}<br>
              <b>Đọc được:</b> ${r?.recordCount ?? 0}
              ${typeof r?.missingRecords === 'number' && r.missingRecords > 0
                ? `<b style="color:orange"> ⚠ Thiếu ${r.missingRecords} bản ghi!</b>` : ''}<br>
              <b>Ngày cũ nhất:</b> ${r?.oldestRecord || '—'}<br>
              <b>Ngày mới nhất:</b> ${r?.newestRecord || '—'}<br>
              ${r?.hasError ? '<b style="color:orange">Cảnh báo: ' + r.error + '</b><br>' : ''}
              <b>Mẫu (3 bản ghi đầu):</b><br>
              <pre style="font-size:11px">${JSON.stringify(r?.sample, null, 2)}</pre>
            `,
            html: true
          })
        }
      } catch (err) {
        this.$q.notify({ type: 'negative', message: err.message, position: 'top' })
      } finally {
        this.debuggingId = null
      }
    },

    async testConnection(machine) {
      this.testingId = machine.id
      this.$set(this.testResults, machine.id, null)
      try {
        const res = await this.testAttendanceMachine(machine.id)
        const r = res?.data
        this.$set(this.testResults, machine.id, r?.connected === true)
        this.$q.notify({
          type: r?.connected ? 'positive' : 'negative',
          icon: r?.connected ? 'wifi' : 'wifi_off',
          message: r?.connected
            ? `${machine.name}: Kết nối thành công${r.serialNumber ? ' | S/N: ' + r.serialNumber : ''}`
            : `${machine.name}: Không kết nối được — ${r?.error || 'Timeout'}`,
          position: 'top',
          timeout: 4000
        })
      } catch (err) {
        this.$set(this.testResults, machine.id, false)
        this.$q.notify({ type: 'negative', message: err.message, position: 'top' })
      } finally {
        this.testingId = null
      }
    },

    async toggleActive(machine) {
      try {
        await this.updateAttendanceMachine({
          id: machine.id, name: machine.name, ip: machine.ip,
          port: machine.port, factoryId: machine.factoryId,
          active: machine.active ? 0 : 1
        })
        await this.loadMachines()
      } catch (err) {
        this.$q.notify({ type: 'negative', message: err.message, position: 'top' })
      }
    },

    openAddDialog() {
      this.editMode = false
      this.form = { id: null, name: '', ip: '', port: 4370, factoryId: null }
      this.dialog = true
    },

    openEditDialog(machine) {
      this.editMode = true
      this.form = { ...machine }
      this.dialog = true
    },

    async saveMachine() {
      if (!this.form.ip) {
        this.$q.notify({ type: 'warning', message: 'Vui lòng nhập địa chỉ IP', position: 'top' })
        return
      }
      this.saving = true
      try {
        if (this.editMode) {
          await this.updateAttendanceMachine(this.form)
        } else {
          await this.addAttendanceMachine(this.form)
        }
        this.$q.notify({ type: 'positive', message: 'Lưu thành công', position: 'top' })
        this.dialog = false
        await this.loadMachines()
      } catch (err) {
        this.$q.notify({ type: 'negative', message: err.message, position: 'top' })
      } finally {
        this.saving = false
      }
    },

    async loadLogs() {
      this.loadingLogs = true
      this.logs = []
      try {
        const params = {}
        if (this.logFilter.factoryId) params.factoryId = this.logFilter.factoryId
        if (this.logFilter.machineId) params.machineId = this.logFilter.machineId
        if (this.logFilter.date)      params.date      = this.logFilter.date
        if (this.logFilter.userId)    params.userId    = this.logFilter.userId
        const res = await this.getAttendanceLogs(params)
        this.logs = res?.data || []
      } catch (err) {
        this.$q.notify({ type: 'negative', message: err.message, position: 'top' })
      } finally {
        this.loadingLogs = false
      }
    },

    factoryLabel(id) {
      return FACTORIES.find(f => f.value === id)?.label?.split(' (')[0] || '—'
    },

    formatTime(val) {
      if (!val) return '—'
      const d = new Date(val)
      if (isNaN(d.getTime())) return '—'
      // punchTime lưu giờ VN nhưng mssql trả về dạng UTC → dùng UTC getters để hiển thị đúng giờ VN
      const p = n => String(n).padStart(2, '0')
      return `${p(d.getUTCDate())}/${p(d.getUTCMonth()+1)}/${d.getUTCFullYear()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`
    },

    punchTypeLabel(type) {
      const map = { 0: 'Vào', 1: 'Ra', 4: 'OT vào', 5: 'OT ra' }
      return map[type] ?? `Type ${type}`
    },

    punchTypeColor(type) {
      const map = { 0: 'positive', 1: 'red-6', 4: 'orange-7', 5: 'deep-orange-6' }
      return map[type] ?? 'grey-6'
    }
  }
}
</script>
