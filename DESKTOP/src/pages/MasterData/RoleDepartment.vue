<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-6 top-title text-primary">
            Danh sách người dùng theo phòng ban
          </div>
          <div class="col-6" align="right">
            <q-btn
              v-if="departmentId != null && isInsert"
              color="positive"
              icon="add_circle_outline"
              label="Thêm mới"
              @click="addUser"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-5" style="margin-top: 46px">
            <DxTreeList
              id="departments"
              :data-source="dataSource"
              :column-auto-width="true"
              :show-row-lines="true"
              :show-borders="true"
              :expanded-row-keys="expandedRowKeys"
              key-expr="id"
              :columns="columns"
              parent-id-expr="parentId"
              @selection-changed="onSelectionChanged1"
            >
              <DxPaging :enabled="true" :page-size="40" />
              <DxSelection mode="single" />
              <DxFilterRow :visible="true" />
              <DxColumn
                :width="120"
                data-field="parentId"
                caption="Menu cha"
                :visible="false"
              >
              </DxColumn>
              <DxColumn data-field="name" caption="Tên phòng ban">
                <DxValidationRule type="required" />
              </DxColumn>
            </DxTreeList>
          </div>
          <div class="col-7">
            <DxDataGrid :data-source="listUser" :show-borders="true">
              <DxSearchPanel
                :visible="true"
                :placeholder="'Tìm kiếm MNV hoặc họ tên'"
                :width="400"
              />
              <DxExport :enabled="true" />

              <DxColumn data-field="ACCOUNT" caption="Mã nhân viên" />
              <DxColumn data-field="ACCOUNT_ID" caption="Họ và tên">
                <DxLookup
                  :data-source="arrUser"
                  display-expr="label"
                  value-expr="value"
                />
              </DxColumn>
              <DxColumn data-field="POSITION_ID" caption="Chức vụ">
                <DxLookup
                  :data-source="strPositions"
                  display-expr="label"
                  value-expr="value"
                />
              </DxColumn>
              <DxColumn data-field="DESK_MANAGER" caption="Phụ trách">
                <DxLookup
                  :data-source="managers"
                  display-expr="label"
                  value-expr="value"
                />
              </DxColumn>
              <DxColumn data-field="ORDER" caption="Thứ tự" width="100" />
              <DxColumn
                v-if="isUpdate"
                caption="Chỉnh sửa"
                width="100"
                alignment="center"
                cell-template="update-cell"
              />
              <template #update-cell="cell">
                <span class="fake-link" @click="onSelectionChanged(cell)"
                  >Sửa</span
                >
              </template>
              <DxColumn
                v-if="isDelete"
                caption="Xóa"
                width="100"
                alignment="center"
                cell-template="del-cell"
              />
              <template #del-cell="cell">
                <span class="fake-link" @click="onSelectionDelete(cell)"
                  >Xóa</span
                >
              </template>
            </DxDataGrid>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showChooseDepartment" persistent>
      <q-card style="min-width: 70%">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title" style="color: #21ba45">
              Nhập thông tin ({{ departmentName }})
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-around">
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                v-model="iName"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                :options="users"
                @filter="filterFn"
                hint="Nhập tối thiểu 2 ký tự để tìm kiếm"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Không có kết quả phù hợp
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                use-input
                v-model="iPosition"
                :options="positions"
                @filter="filterFnPosition"
                label="Chức vụ"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                use-input
                v-model="iManager"
                :options="managers"
                label="Phụ trách"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input
                v-model.number="iOrder"
                label="Thứ tự"
                type="number"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="OK" @click="createRoleDepartment" color="positive" />
          <q-btn
            label="Hủy"
            color="orange"
            @click="showChooseDepartment = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess, showNotifyError } from "../../ultils";
import {
  DxTreeList,
  DxEditing,
  DxValidationRule,
  DxLookup,
  DxPaging,
  DxFilterRow,
  DxSelection,
  DxButton,
} from "devextreme-vue/tree-list";
import {
  DxDataGrid,
  DxSearchPanel,
  DxColumn,
  DxExport,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxTreeList,
    DxDataGrid,
    DxEditing,
    DxColumn,
    DxExport,
    DxValidationRule,
    DxLookup,
    DxPaging,
    DxFilterRow,
    DxSelection,
    DxButton,
    DxSearchPanel,
  },
  data() {
    return {
      dataSource: [],
      listUser: [],
      users: [],
      listPermission: [],
      isInsert: false,
      isUpdate: false,
      isDelete: false,
      strUsers: [],
      arrUser: [],
      isEdit: false,
      departmentId: null,
      departmentName: "",
      roleDepartmentId: null,
      managers: [
        {
          label: "Phụ trách chính",
          value: 1,
        },
        {
          label: "Được ủy quyền",
          value: 2,
        },
        {
          label: "Không phụ trách",
          value: 0,
        }
      ],
      iName: null,
      iPosition: null,
      iManager: null,
      iOrder: null,
      positions: [],
      strPositions: [],
      expandedRowKeys: [1],
      showChooseDate: false,
      showChooseDepartment: false,
      columns: [
        {
          dataField: "parentId",
          caption: "Menu cha",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "userInfo"]),
  },
  created() {
    this.loadPermission();
    this.loadDepartment();
    this.loadUsers();
    this.loadPosition();
  },
  methods: {
    ...mapActions("roleDepartment", [
      "insertRoleDepartment",
      "updateRoleDepartment",
      "deleteRoleDepartment",
    ]),
    ...mapActions("prod", ["getPermissionInScreen"]),
    async loadPermission() {
      console.log("router dinh tuyen", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
        if (el.CODE == "insert") {
          this.isInsert = true;
        }
        if (el.CODE == "update") {
          this.isUpdate = true;
        }
        if (el.CODE == "delete") {
          this.isDelete = true;
        }
      });
      console.log("listPermission", this.listPermission);
    },
    async loadDepartment() {
      const data = await this.$store.dispatch("base/GET_DEPARTMENTS_FULL");
      this.dataSource = [];
      this.dataSource = data.data;
      console.log("data", data);
    },
    async onSelectionChanged1({ selectedRowsData }) {
      this.departmentId = selectedRowsData[0].id;
      this.departmentName = selectedRowsData[0].name;
      this.loadUserInDepartment(this.departmentId);
    },
    async loadUserInDepartment(departmentId) {
      const payload = {
        departmentId: departmentId,
      };
      const data = await this.$store.dispatch(
        "roleDepartment/getAccountByDepartmentId",
        payload
      );
      console.log("data", data);
      this.listUser = data;
    },
    filterFn(val, update, abort) {
      if (val.length < 2) {
        abort();
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.users = this.strUsers.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterFnPosition(val, update) {
      if (val === "") {
        update(() => {
          this.positions = this.strPositions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.positions = this.strPositions.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async loadUsers() {
      const data = await this.$store.dispatch("roleDepartment/getUser");
      this.users = [];
      data.forEach((el) => {
        this.users.push({
          label: `[${el.ACCOUNT}] - ${el.NAME}`,
          value: el.ID,
        });
        this.arrUser.push({
          label: el.NAME,
          value: el.ID
        })
      });
      this.strUsers = this.users;
      
    },
    async loadPosition() {
      const data = await this.$store.dispatch("roleDepartment/getPosition");
      this.positions = [];
      data.forEach((el) => {
        this.positions.push({
          label: el.NAME,
          value: el.ID,
        });
      });
      this.strPositions = this.positions;
      console.log("positions", this.positions);
    },
    addUser() {
      this.isEdit = false;
      this.iName = null;
      this.iPosition = null;
      this.iManager = null;
      this.iOrder = null;
      this.showChooseDepartment = true;
    },
    onSelectionChanged(e) {
      console.log("e", e.data.data);
      this.roleDepartmentId = e.data.data.ID;
      this.iName = this.users.find((u) => u.value == e.data.data.ACCOUNT_ID);
      this.iPosition = this.positions.find(
        (u) => u.value == e.data.data.POSITION_ID
      );
      this.iManager = this.managers.find(
        (u) => u.value == e.data.data.DESK_MANAGER
      );
      this.iOrder = e.data.data.ORDER;
      this.isEdit = true;
      this.showChooseDepartment = true;
    },
    async createRoleDepartment() {
      if (this.isEdit) {
        const payload = {
          id: this.roleDepartmentId,
          accountId: this.iName.value,
          positionId: this.iPosition.value,
          deskManager: this.iManager ? this.iManager.value : 0,
          order: this.iOrder ? this.iOrder : 0,
        };
        const data = await this.updateRoleDepartment(payload);
        this.loadUserInDepartment(this.departmentId);
      } else {
        const payload = {
          accountId: this.iName.value,
          positionId: this.iPosition.value,
          deskManager: this.iManager ? this.iManager.value : 0,
          order: this.iOrder ? this.iOrder : 0,
          departmentId: this.departmentId,
          createdBy: this.userInfo.id,
        };
        const data = await this.insertRoleDepartment(payload);
        if (data.length > 0) {
          showNotifySuccess("Tạo thành công !");
          this.loadUserInDepartment(this.departmentId);
        } else {
          showNotifyError();
        }
      }
      this.showChooseDepartment = false;
    },
    onSelectionDelete(e) {
      this.removed(e.data.data.ID);
    },
    async removed(id) {
      const data = await this.deleteRoleDepartment(id);
      this.loadUserInDepartment(this.departmentId);
    },
  },
};
</script>

<style>
.dx-datagrid-headers .cell-bcnguoidung {
  font-size: 18px !important;
  color: orange;
  padding: 5px;
}
.dx-header-row {
  padding: 5px;
}
</style>