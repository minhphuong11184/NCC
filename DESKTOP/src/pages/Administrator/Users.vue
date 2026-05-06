<template>
  <q-page>
    <div class="row">
      <div class="col-12 top-title text-positive">Quản lý tài khoản</div>
    </div>
    <!-- <q-separator /> -->
    <q-card-section>
      <div class="row">
        <div class="col-7">
          <div class="row">
            <div class="col-6" align="right">
              <!-- <q-btn color="warning" :disable="showAddRole" icon="security" label="Phân quyền" @click="onClick" /> -->
            </div>
            <!-- <div class="col-6" align="right">
                <q-btn
                  color="primary"
                  icon="add_circle_outline"
                  label="Thêm"
                  @click="showAdd=true"
                />
              </div>-->
          </div>
          <TableUser :onSelectionChanged="onSelectionChangedTableUser" />
        </div>
        <!-- <q-separator vertical /> -->
        <div class="col-5" v-if="showRole">
          <div class="row">
            <div class="col-5">
              <div class="top-title text-bold text-positive">{{ roleName }}</div>

              <!-- <q-select v-model="role" :options="roles" label="Nhóm " filled /> -->
            </div>
          </div>
          <div class="q-mt-md row">
            <div class="col-12 q-ma-sm">
              <q-card class="my-card">
                <q-card-section style="padding: 0px 10px">
                  <div class="row">
                    <div class="col-10">
                      <div class="text-h6 text-orange" @click="selectShow('boPhanLamViec')">Bộ phận làm việc</div>
                    </div>
                    <div class="col-2" v-show="isEditSource">
                      <q-btn color="primary" icon="save_alt" label="Lưu lại" @click="showConfirmChangeSource = true" />
                    </div>
                  </div>
                </q-card-section>
                <q-card-section v-if="showBoPhanLamViec">
                  <DxTreeList id="roleSource" ref="treeList" :data-source="
                    roleSource.map((r) => ({
                      ...r,
                      parentId: r.parentId ? r.parentId : 0,
                    }))
                  " :show-row-lines="true" :show-borders="true" :column-auto-width="true"
                    :expanded-row-keys="sourceExpandedRowKeys" :selected-row-keys.sync="sourceSelectedRowKeys"
                    key-expr="departmentId" parent-id-expr="parentId">
                    <DxSelection :recursive="false" mode="multiple" />
                    <DxColumn data-field="name" caption="Tên" />
                  </DxTreeList>
                </q-card-section>
              </q-card>
            </div>
            <!-- <div class="col-12 q-ma-sm">
                <q-card class="my-card">
                  <q-card-section>
                    <div class="row">
                      <div class="col-10">
                        <div class="text-h6">
                          <p>Bộ phận xuất hàng</p>
                        </div>
                      </div>
                      <div class="col-2" v-show="isEditDestination">
                        <q-btn
                          color="primary"
                          icon="save_alt"
                          label="Lưu lại"
                          @click="showConfirmChangeDes = true"
                        />
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <DxTreeList
                      id="roleDestination"
                      ref="treeList"
                      :data-source="
                        roleDestinations.map(r => ({
                          ...r,
                          parentId: r.parentId ? r.parentId : 0
                        }))
                      "
                      :show-row-lines="true"
                      :show-borders="true"
                      :column-auto-width="true"
                      :expanded-row-keys="desExpandedRowKeys"
                      :selected-row-keys.sync="desSelectedRowKeys"
                      key-expr="departmentId"
                      parent-id-expr="parentId"
                    >
                      <DxSelection :recursive="false" mode="multiple" />
                      <DxColumn data-field="name" caption="Tên" />
                    </DxTreeList>
                  </q-card-section>
                </q-card>
              </div> -->
            <!-- <div class="col-12 q-ma-sm">
                <q-card class="my-card">
                  <q-card-section>
                    <div class="text-h6">
                      <p>Cấp độ quản lý danh mục</p>
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <TableQuanLyDanhMuc
                      :dataSource="roleDMView"
                      :updated="updateDM"
                    />
                  </q-card-section>
                </q-card>
              </div> -->
            <div class="col-12 q-ma-sm">
              <q-card class="my-card">
                <q-card-section>
                  <div class="row">
                    <div class="col-10">
                      <div class="text-h6 text-orange">
                        <p @click="selectShow('desktop')">Chức năng Desktop</p>
                      </div>
                    </div>
                    <div class="col-2" clign="right" v-show="iseDitMenu">
                      <q-btn color="primary" icon="save_alt" label="Lưu lại" @click="showDialogConfirmMenu = true" />
                    </div>
                  </div>
                </q-card-section>
                <q-card-section v-if="showChucNangDesktop">
                  <DxTreeList id="roleMenu" ref="treeList" :data-source="
                    roleMenu.map((r) => ({
                      ...r,
                      parentId: r.parentId ? r.parentId : 0,
                    }))
                  " :show-row-lines="true" :show-borders="true" :column-auto-width="true"
                    :expanded-row-keys="menuExpandedRowKeys" :selected-row-keys.sync="menuSelectedRowKeys"
                    key-expr="menuId" parent-id-expr="parentId">
                    <DxSelection :recursive="false" mode="multiple" />
                    <DxColumn data-field="name" caption="Tên" />
                  </DxTreeList>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 q-ma-sm">
              <q-card class="my-card">
                <q-card-section>
                  <div class="row">
                    <div class="col-10">
                      <div class="text-h6 text-orange">
                        <p @click="selectShow('mobile')">Chức năng Mobile</p>
                      </div>
                    </div>
                    <div class="col-2" v-show="isEditMenuMobile">
                      <q-btn color="primary" icon="save_alt" label="Lưu lại" @click="showConfirmChangeMob = true" />
                    </div>
                  </div>
                </q-card-section>
                <q-card-section v-if="showChucNangMobile">
                  <DxDataGrid id="roleDestination" :data-source="
                    roleMenuMobile.map((r) => ({
                      ...r,
                      parentId: r.parentId ? r.parentId : 0,
                    }))
                  " :show-row-lines="true" :show-borders="true" :column-auto-width="true"
                    :expanded-row-keys="mobExpandedRowKeys" :selected-row-keys.sync="mobSelectedRowKeys"
                    key-expr="menuId">
                    <DxSelection :recursive="false" mode="multiple" />
                    <DxScrolling mode="virtual" />
                    <DxColumn data-field="species" caption="Nhóm" :group-index="0">
                      <DxLookup :data-source="group" display-expr="name" value-expr="id" />
                    </DxColumn>
                    <DxColumn data-field="name" caption="Tên" />
                  </DxDataGrid>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

      </div>
    </q-card-section>
    <q-dialog v-model="showDialogConfirmUserMobile" persistent>
      <q-card style="min-width: 65%">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Cập nhật quyền User Mobile</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" @click="cancelChangeMobileUser" v-close-popup />
          <q-btn flat label="Đồng Ý" @click="changeMobileUser" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDialogConfirmUserSupper" persistent>
      <q-card style="min-width: 65%">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Cập nhật quyền Supper Mobile</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" @click="cancelChangeSupperUser" v-close-popup />
          <q-btn flat label="Đồng Ý" @click="changeSupperUser" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDialogConfirmMenu" persistent>
      <q-card style="min-width: 65%">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">
            <div class="top-title">Cập nhật quyền Phân hệ sử dụng</div>
          </span>
        </q-card-section>
        <q-card-section>
          <ul>
            <li v-for="item in roleMenu.filter((m) => {
              return m.changeType;
            })" v-bind:key="item.menuId">
              <div class="add" v-if="item.changeType === 'ADD'">
                {{ item.name }}
              </div>
              <div class="remove" v-if="item.changeType === 'REMOVE'">
                {{ item.name }}
              </div>
            </li>
          </ul>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" @click="saveMenu" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showConfirmChangeSource" persistent>
      <q-card style="min-width: 65%">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">
            <div class="top-title">Cập nhật quyền bộ phận làm việc</div>
          </span>
        </q-card-section>
        <q-card-section>
          <ul>
            <li v-for="item in roleSource.filter((m) => {
              return m.changeType;
            })" v-bind:key="item.departmentId">
              <div class="add" v-if="item.changeType === 'ADD'">
                {{ item.name }}
              </div>
              <div class="remove" v-if="item.changeType === 'REMOVE'">
                {{ item.name }}
              </div>
            </li>
          </ul>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" @click="saveSource" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showConfirmChangeDes" persistent>
      <q-card style="min-width: 65%">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">
            <div class="top-title">Cập nhật quyền bộ phận xuất hàng</div>
          </span>
        </q-card-section>
        <q-card-section>
          <ul>
            <li v-for="item in roleDestinations.filter((m) => {
              return m.changeType;
            })" v-bind:key="item.departmentId">
              <div class="add" v-if="item.changeType === 'ADD'">
                {{ item.name }}
              </div>
              <div class="remove" v-if="item.changeType === 'REMOVE'">
                {{ item.name }}
              </div>
            </li>
          </ul>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" @click="saveDes" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showConfirmChangeMob" persistent>
      <q-card style="min-width: 65%">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">
            <div class="top-title">Cập nhật quyền chức năng Mobile</div>
          </span>
        </q-card-section>
        <q-card-section>
          <ul>
            <li v-for="item in roleMenuMobile.filter((m) => {
              return m.changeType;
            })" v-bind:key="item.departmentId">
              <div class="add" v-if="item.changeType === 'ADD'">
                {{ item.name }}
              </div>
              <div class="remove" v-if="item.changeType === 'REMOVE'">
                {{ item.name }}
              </div>
            </li>
          </ul>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" @click="saveMob" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>
    <q-dialog v-model="showDialogPermission" persistent>
      <q-card style="min-width: 50%">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">
            <div class="top-title text-positive">
              Phân quyền chi tiết theo chức năng
            </div>
          </span>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-6">
              <DxDataGrid id="gridContainerMenu" :data-source="listMenuOfAccount" :allow-column-reordering="true"
                :columns-auto-width="true" :show-borders="true" :selection="{ mode: 'single' }"
                :hover-state-enabled="true" @selection-changed="onSelectionChangedMenu" key-expr="ID">
                <DxFilterRow :visible="true" />
                <DxColumn data-field="NAME" caption="Tên chức năng" />
                <DxColumn data-field="PATH" caption="Tên đường dẫn" />
              </DxDataGrid>
            </div>
            <div class="col-1"></div>
            <div v-if="roleValueId" class="col-5">
              <p style="font-size: 24px; font-weight: bold" class="text-blue">
                {{ menuName }}
              </p>
              <q-option-group color="orange" :options="listPermission" type="checkbox" v-model="permission" />
              <q-btn style="margin-top: 50px" @click="submitPermission" color="positive" no-caps label="Cập nhập" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Đóng" color="orange" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  userFake,
  roleFake,
  roleTypeFake,
  moduleFake,
  dataRoleFake,
  userRoleFake,
} from "../../ultils/fake";
import { showNotifySuccess, showNotifyError } from "../../ultils";
import { mapActions, mapGetters } from "vuex";
import { DxTreeList, DxSelection } from "devextreme-vue/tree-list";
import { DxDataGrid, DxColumn, DxFilterRow, DxLookup, DxScrolling } from "devextreme-vue/data-grid";
import TableUser from "../../components/Adminsitrator/TableUser";
import TableQuanLyDanhMuc from "../../components/Adminsitrator/TableQuanLyDanhMuc";
import TableBieuMau from "../../components/Adminsitrator/TableBieuMau";
export default {
  components: {
    DxTreeList,
    DxSelection,
    DxDataGrid,
    DxFilterRow,
    DxLookup,
    DxScrolling,
    DxColumn,
    TableUser,
    TableQuanLyDanhMuc,
    TableBieuMau,
  },
  data() {
    return {
      userFake,
      roleFake,
      userId: null,
      showDialogPermission: false,
      listMenuOfAccount: [],
      listPermission: [],
      permission: [],
      showBoPhanLamViec: false,
      showBieuMauSuDung: false,
      showChucNangDesktop: false,
      showChucNangMobile: false,
      menuName: null,
      roleValueId: null,
      showPermission: false,
      showAdd: false,
      menuId: null,
      group: [
        {
          name: "CHẾ BIẾN GỖ",
          id: "1         ",
        },
        {
          name: "e-OFFICE",
          id: "2         ",
        },
        {
          name: "VÁN CÔNG NGHIỆP",
          id: "3         ",
        },
        {
          name: "QUẢN LÝ SẤY GỖ",
          id: "4         ",
        },
        {
          name: "QUẢN LÝ MÁY",
          id: "5         ",
        },
        {
          name: "THÔNG TIN",
          id: "6         ",
        },
      ],
      roleTypeFake,
      moduleFake,
      dataRoleFake,
      roleDataSelected: [],
      sources: [],
      departments: [],
      destination: [],
      features: [],
      userRoleFake,
      mobileUser: false,
      supperUser: false,
      factorys: [{ label: "Thuận Hưng", value: 1 }],
      factory: null,
      showRole: false,
      roleName: "",
      roleMenu: [],
      roleDMView: {},
      menuSelectedRowKeys: [],
      menuExpandedRowKeys: [],
      roleSource: [],
      sourceSelectedRowKeys: [],
      sourceExpandedRowKeys: [],
      roleDestinations: [],
      desExpandedRowKeys: [],
      desSelectedRowKeys: [],
      quanLyDanhMuc: [],
      dmExpandedRowKeys: [],
      dmSelectedRowKeys: [],
      dataSourceQLDM: {},
      showDialogConfirmUserMobile: false,
      showDialogConfirmUserSupper: false,
      showDialogConfirmMenu: false,
      currentRoleData: {},
      iseDitMenu: false,
      isEditSource: false,
      showConfirmChangeSource: false,
      isEditDestination: false,
      showConfirmChangeDes: false,
      roleMenuMobile: [],
      mobExpandedRowKeys: [],
      mobSelectedRowKeys: [],
      isEditMenuMobile: false,
      showConfirmChangeMob: false,
      showMobileUser: true,
      showSupperUser: true,
      boPhanLamViec: [],
      formSelectedRowKeys: [],
    };
  },
  watch: {
    menuSelectedRowKeys(val) {
      const currentSelectMenus = this.currentRoleData.menu.values.filter(
        (m) => {
          return m.state === 1;
        }
      );
      let currentSelected = [];
      currentSelectMenus.forEach((element) => {
        currentSelected.push(element.menuId);
      });
      if (this.compareArrayWithVueModel(val, currentSelected)) {
        this.iseDitMenu = false;
      } else {
        this.iseDitMenu = true;
      }
      // nếu bỏ chọn tất cả menu
      if (val.length === 0 && currentSelected.length === 0) {
        this.iseDitMenu = false;
      }
      // lấy ra các thay đổi
      if (this.iseDitMenu) {
        for (let i = 0; i < this.roleMenu.length; i++) {
          const element = this.roleMenu[i];
          // lấy danh sách các menuId mới đc thêm vào
          if (element.state === 1) {
            // nếu danh sách ban đầu là đang đc chọn
            // mà danh sách đang chọn(val)  không có menuId này => đã đc bỏ quyền
            if (
              val.findIndex((v) => {
                return v === element.menuId;
              }) === -1
            ) {
              element.changeType = "REMOVE";
            }
          } else {
            // nếu trong danh sách ban đầu giá trị không được chọn(=0)
            // mà có trong list đang chọn => thêm mới
            if (
              val.findIndex((v) => {
                return v === element.menuId;
              }) !== -1
            ) {
              element.changeType = "ADD";
            }
          }
        }
      }
    },
    mobSelectedRowKeys(val) {
      const currentSelectMenus = this.currentRoleData.menu_mobile.values.filter(
        (m) => {
          return m.state === 1;
        }
      );
      let currentSelected = [];
      currentSelectMenus.forEach((element) => {
        currentSelected.push(element.menuId);
      });
      if (this.compareArrayWithVueModel(val, currentSelected)) {
        this.isEditMenuMobile = false;
      } else {
        this.isEditMenuMobile = true;
      }
      // nếu bỏ chọn tất cả menu
      if (val.length === 0 && currentSelected.length === 0) {
        this.isEditMenuMobile = false;
      }
      // lấy ra các thay đổi
      if (this.isEditMenuMobile) {
        for (let i = 0; i < this.roleMenuMobile.length; i++) {
          const element = this.roleMenuMobile[i];
          // lấy danh sách các menuId mới đc thêm vào
          if (element.state === 1) {
            // nếu danh sách ban đầu là đang đc chọn
            // mà danh sách đang chọn(val)  không có menuId này => đã đc bỏ quyền
            if (
              val.findIndex((v) => {
                return v === element.menuId;
              }) === -1
            ) {
              element.changeType = "REMOVE";
            }
          } else {
            // nếu trong danh sách ban đầu giá trị không được chọn(=0)
            // mà có trong list đang chọn => thêm mới
            if (
              val.findIndex((v) => {
                return v === element.menuId;
              }) !== -1
            ) {
              element.changeType = "ADD";
            }
          }
        }
      }
    },
    sourceSelectedRowKeys(val) {
      const currentSelectMenus =
        this.currentRoleData.bo_phan_lam_viec.values.filter((m) => {
          return m.state === 1;
        });
      let currentSelected = [];
      currentSelectMenus.forEach((element) => {
        currentSelected.push(element.departmentId);
      });
      if (this.compareArrayWithVueModel(val, currentSelected)) {
        this.isEditSource = false;
      } else {
        this.isEditSource = true;
      }
      // nếu bỏ chọn tất cả menu
      if (val.length === 0 && currentSelected.length === 0) {
        this.isEditSource = false;
      }
      // lấy ra các thay đổi
      if (this.isEditSource) {
        for (let i = 0; i < this.roleSource.length; i++) {
          const element = this.roleSource[i];
          // lấy danh sách các menuId mới đc thêm vào
          if (element.state === 1) {
            // nếu danh sách ban đầu là đang đc chọn
            // mà danh sách đang chọn(val)  không có menuId này => đã đc bỏ quyền
            if (
              val.findIndex((v) => {
                return v === element.departmentId;
              }) === -1
            ) {
              element.changeType = "REMOVE";
            }
          } else {
            // nếu trong danh sách ban đầu giá trị không được chọn(=0)
            // mà có trong list đang chọn => thêm mới
            if (
              val.findIndex((v) => {
                return v === element.departmentId;
              }) !== -1
            ) {
              element.changeType = "ADD";
            }
          }
        }
      }
    },
    desSelectedRowKeys(val) {
      const currentSelectMenus =
        this.currentRoleData.bo_phan_xuat_hang.values.filter((m) => {
          return m.state === 1;
        });
      let currentSelected = [];
      currentSelectMenus.forEach((element) => {
        currentSelected.push(element.departmentId);
      });
      if (this.compareArrayWithVueModel(val, currentSelected)) {
        this.isEditDestination = false;
      } else {
        this.isEditDestination = true;
      }
      // nếu bỏ chọn tất cả menu
      if (val.length === 0 && currentSelected.length === 0) {
        this.isEditDestination = false;
      }
      // lấy ra các thay đổi
      if (this.isEditDestination) {
        for (let i = 0; i < this.roleDestinations.length; i++) {
          const element = this.roleDestinations[i];
          // lấy danh sách các menuId mới đc thêm vào
          if (element.state === 1) {
            // nếu danh sách ban đầu là đang đc chọn
            // mà danh sách đang chọn(val)  không có menuId này => đã đc bỏ quyền
            if (
              val.findIndex((v) => {
                return v === element.departmentId;
              }) === -1
            ) {
              element.changeType = "REMOVE";
            }
          } else {
            // nếu trong danh sách ban đầu giá trị không được chọn(=0)
            // mà có trong list đang chọn => thêm mới
            if (
              val.findIndex((v) => {
                return v === element.departmentId;
              }) !== -1
            ) {
              element.changeType = "ADD";
            }
          }
        }
      }
    },
  },
  created() {
    // this.$root.$on("chon_role", v => {
    //   setTimeout(() => {
    //     this.loadRoleInfo(v);
    //   }, 500);
    // });
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("prod", [
      "getMenuOfAccount",
      "getUserPermission",
      "getById",
      "deleteRoleMenu",
      "insertRoleMenu",
    ]),
    selectShow(name) {
      if (name == "boPhanLamViec") {
        this.showBoPhanLamViec = !this.showBoPhanLamViec;
        this.showChucNangMobile = false;
        this.showChucNangDesktop = false;
      }
      if (name == "mobile") {
        this.showBoPhanLamViec = false;
        this.showChucNangMobile = !this.showChucNangMobile;
        this.showChucNangDesktop = false;
      }
      if (name == "desktop") {
        this.showBoPhanLamViec = false;
        this.showChucNangMobile = false;
        this.showChucNangDesktop = !this.showChucNangDesktop;
      }
    },
    async onPermission() {
      if (this.userId != null) {
        const data = await this.getMenuOfAccount({ accountId: this.userId });
        this.listMenuOfAccount = [];
        this.listMenuOfAccount = data.data;
        this.showDialogPermission = true;
      } else {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng chọn người dùng trước khi phân quyền ! </span>`,
          persistent: true,
        });
      }
    },
    onSelectionChangedMenu(e) {
      this.menuId = e.selectedRowsData[0].menuId;
      this.permission = [];
      this.menuName = e.selectedRowsData[0].NAME;
      this.roleValueId = e.selectedRowsData[0].ID;
      this.loadPermission();
      this.loadRoleMenu();
    },
    async loadRoleMenu() {
      const data = await this.getById(this.roleValueId);
      data.data.forEach((el) => {
        this.permission.push(el.PERMISSION_ID);
      });
    },
    async submitPermission() {
      await  this.removeRoleMenu();
      if (this.permission.length > 0) {
        const payload = {
          roleValueId: this.roleValueId,
          permissionIds: this.permission,
          accountId: this.userInfo.id,
        };
        const data = await this.insertRoleMenu(payload);
        if (data.meta.success) {
          this.permission = [];
          this.loadRoleMenu();
          showNotifySuccess();
        } else {
          showNotifyError();
        }
      }
    },
    async removeRoleMenu() {
      await this.deleteRoleMenu(this.roleValueId);
    },
    async updateDM(e) {
      let selectId = this.currentRoleData.cap_do_quan_ly_danh_muc.values.find(
        (c) => {
          return c.name === e.data.name && c.permission === "SELECT";
        }
      );
      let createId = this.currentRoleData.cap_do_quan_ly_danh_muc.values.find(
        (c) => {
          return c.name === e.data.name && c.permission === "CREATE";
        }
      );
      let updateId = this.currentRoleData.cap_do_quan_ly_danh_muc.values.find(
        (c) => {
          return c.name === e.data.name && c.permission === "UPDATE";
        }
      );
      let deleteId = this.currentRoleData.cap_do_quan_ly_danh_muc.values.find(
        (c) => {
          return c.name === e.data.name && c.permission === "DELETE";
        }
      );
      let allId = this.currentRoleData.cap_do_quan_ly_danh_muc.values.find(
        (c) => {
          return c.name === e.data.name && c.permission === "ALL";
        }
      );
      let success = false;
      if (e.data.CREATE === true) {
        //thêm quyền tạo mới
        if (createId.id) {
          // Nếu quyền đã có từ trước thỳ ko làm gì cả
        } else {
          //Nếu trước không có id, (không có quyền thỳ thêm vào)
          const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100007,
            value: createId.categoryId,
          };
          let dataUpdateCreate = await this.addRoleValue(payload);
          success = true;
        }
      } else {
        // Nếu là bỏ quyền
        //check id , nếu có id thỳ xóa
        if (createId.id) {
          const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100007,
            value: createId.categoryId,
          };
          let dataRemoveCreate = await this.removeRoleValue(payload);
          success = true;
        }
      }

      // quyền xem
      if (e.data.SELECT === true) {
        //thêm quyền tạo mới
        if (selectId.id) {
          // Nếu quyền đã có từ trước thỳ ko làm gì cả
        } else {
          //Nếu trước không có id, (không có quyền thỳ thêm vào)
          const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100007,
            value: selectId.categoryId,
          };
          let dataUpdateCreate = await this.addRoleValue(payload);
          success = true;
        }
      } else {
        // Nếu là bỏ quyền
        //check id , nếu có id thỳ xóa
        if (selectId.id) {
          const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100007,
            value: selectId.categoryId,
          };
          let dataRemoveCreate = await this.removeRoleValue(payload);
          success = true;
        }
      }
      //quyền cập nhật
      if (e.data.UPDATE === true) {
        //thêm quyền tạo mới
        if (updateId.id) {
          // Nếu quyền đã có từ trước thỳ ko làm gì cả
        } else {
          //Nếu trước không có id, (không có quyền thỳ thêm vào)
          const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100007,
            value: updateId.categoryId,
          };
          let dataUpdateCreate = await this.addRoleValue(payload);
          success = true;
        }
      } else {
        // Nếu là bỏ quyền
        //check id , nếu có id thỳ xóa
        if (updateId.id) {
          const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100007,
            value: updateId.categoryId,
          };
          let dataRemoveCreate = await this.removeRoleValue(payload);
          success = true;
        }
      }
      //quyền Xóa
      if (e.data.DELETE === true) {
        //thêm quyền tạo mới
        if (deleteId.id) {
          // Nếu quyền đã có từ trước thỳ ko làm gì cả
        } else {
          //Nếu trước không có id, (không có quyền thỳ thêm vào)
          const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100007,
            value: deleteId.categoryId,
          };
          let dataUpdateCreate = await this.addRoleValue(payload);
          success = true;
        }
      } else {
        // Nếu là bỏ quyền
        //check id , nếu có id thỳ xóa
        const payload = {
          roleId: this.currentRoleData.id,
          roleTypeId: 100007,
          value: deleteId.categoryId,
        };
        if (deleteId.id) {
          let dataRemoveCreate = await this.removeRoleValue(payload);
          success = true;
        }
      }
      //quyền ủy quyền
      if (e.data.ALL) {
        if (allId.id) {
        } else {
          const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100007,
            value: allId.categoryId,
          };
          let dataUpdateCreate = await this.addRoleValue(payload);
          success = true;
        }
      } else {
        if (allId.id) {
          const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100007,
            value: allId.categoryId,
          };
          let dataRemoveCreate = await this.removeRoleValue(payload);
          success = true;
        }
      }

      if (success) {
        this.$q.notify({
          message: "Thành công !",
          color: "green",
        });
      }
    },
    compareArrayWithVueModel(arrModel, arr) {
      let result = false;
      if (arrModel.length === arr.length) {
        for (let i = 0; i < arrModel.length; i++) {
          const element1 = arrModel[i];
          const element2 = arr[i];
          if (element1 === element2) {
            result = true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
      return result;
    },
    logEvent(e) { },
    loadRoleInfo(v) {
      this.iseDitMenu = false;
      this.isEditSource = false;
      const hasMobileUser = v.loai_tai_khoan.values.find((m) => {
        return m.name === "Mobile user";
      });
      const hasSupperUser = v.loai_tai_khoan.values.find((m) => {
        return m.name === "Supper user";
      });
      if (hasMobileUser) {
        this.mobileUser = hasMobileUser.state === 1 ? true : false;
      } else {
        this.showMobileUser = false;
      }
      if (hasSupperUser) {
        this.supperUser = hasSupperUser.state === 1 ? true : false;
      } else {
        this.showSupperUser = false;
      }
      this.roleName = v.name;
      this.currentRoleData = v;
      this.roleMenu = v.menu.values;
      this.menuSelectedRowKeys = [];
      this.menuExpandedRowKeys = [];
      for (let i = 0; i < this.roleMenu.length; i++) {
        const element = this.roleMenu[i];
        if (element.state === 1) {
          this.menuSelectedRowKeys.push(element.menuId);
        }
        if (element.parentId === null) {
          this.menuExpandedRowKeys.push(element.menuId);
        }
      }
      //load công đoạn làm việc
      this.roleSource = v.bo_phan_lam_viec.values;
      this.sourceSelectedRowKeys = [];
      this.sourceExpandedRowKeys = [];
      this.roleSource.forEach((element) => {
        if (element.state === 1) {
          this.sourceSelectedRowKeys.push(element.departmentId);
        }
        if (element.parentId === null) {
          this.sourceExpandedRowKeys.push(element.departmentId);
        }
      });
      //load công đoạn xuất hàng
      this.roleDestinations = v.bo_phan_xuat_hang.values;
      this.desExpandedRowKeys = [];
      this.desSelectedRowKeys = [];
      this.roleDestinations.forEach((element) => {
        if (element.parentId === null) {
          this.desExpandedRowKeys.push(element.departmentId);
        }
        if (element.state === 1) {
          this.desSelectedRowKeys.push(element.departmentId);
        }
      });
      //load datasource pivort table quản lý danh mục (git)
      this.quanLyDanhMuc = v.cap_do_quan_ly_danh_muc.values;
      let dsroureViewArray = [];
      v.cap_do_quan_ly_danh_muc.views.forEach((dm) => {
        dsroureViewArray.push({
          name: dm.name,
          CREATE: dm.CREATE === 1 ? true : false,
          SELECT: dm.SELECT === 1 ? true : false,
          UPDATE: dm.UPDATE === 1 ? true : false,
          DELETE: dm.DELETE === 1 ? true : false,
          ALL: dm.ALL === 1 ? true : false,
        });
      });
      this.roleMenuMobile = v.menu_mobile.values;
      this.mobExpandedRowKeys = [];
      this.mobSelectedRowKeys = [];
      this.roleMenuMobile.forEach((m) => {
        this.mobExpandedRowKeys.push(m.menuId);
        if (m.state === 1) {
          this.mobSelectedRowKeys.push(m.menuId);
        }
      });
      this.roleDMView = dsroureViewArray;
      this.showRole = true;
    },
    cancelChangeMobileUser() {
      this.mobileUser = !this.mobileUser;
    },
    cancelChangeSupperUser() {
      this.supperUser = !this.supperUser;
    },
    async changeMobileUser() {
      let data;
      if (this.mobileUser) {
        let payload = {
          roleId: this.currentRoleData.id,
          roleTypeId: 100008,
          value: "Mobile user",
        };
        if (this.currentRoleData.loai_tai_khoan.values[0].id) {
          let payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100008,
            value: "Mobile user",
          };
          const dataDel = await this.removeRoleValue(
            payload
          );
        }
        data = await this.$store.dispatch("base/ADD_ROLE_VALUE", payload);
        if (data.meta.success) {
          this.$q.notify({
            message: "Thành công !",
            color: "green",
          });
        }
      } else {
        let payload = {
          roleId: this.currentRoleData.id,
          roleTypeId: 100008,
          value: "Mobile user",
        };
        let dc = await this.removeRoleValue(payload);
        if (dc.meta.success) {
          this.$q.notify({
            message: "Thành công !",
            color: "green",
          });
        }
      }
    },
    async changeSupperUser() {
      let data;
      if (this.supperUser) {
        let payload = {
          roleId: this.currentRoleData.id,
          roleTypeId: 100008,
          value: "Supper user",
        };
        if (this.currentRoleData.loai_tai_khoan.values[1].id) {
          let payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100008,
            value: "Supper user",
          };
          const dataDel = await this.removeRoleValue(payload);
        }
        data = await this.addRoleValue(payload);
        if (data.meta.success) {
          this.$q.notify({
            message: "Thành công !",
            color: "green",
          });
        }
      } else {
        let payload = {
          roleId: this.currentRoleData.id,
          roleTypeId: 100008,
          value: "Supper user",
        };
        let dc = await this.removeRoleValue(payload);
        if (dc.meta.success) {
          this.$q.notify({
            message: "Thành công !",
            color: "green",
          });
        }
      }
    },
    async removeRoleValue(payload) {
      const data = await this.$store.dispatch("base/DELETE_ROLE_VALUE_DESKTOP_MOBILE", payload);
      return data;
    },
    async addRoleValue(payload) {
      const data = await this.$store.dispatch("base/ADD_ROLE_VALUE", payload);
      return data;
    },
    async saveMenu() {
      let success = false;
      for (let i = 0; i < this.roleMenu.length; i++) {
        const element = this.roleMenu[i];
        if (element.changeType === "ADD") {
          const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100006,
            value: element.menuId,
          };
          const data = await this.addRoleValue(payload);
          if (data.meta.success) {
            success = true;
          }
        }
        if (element.changeType === "REMOVE") {
          if (element.id) {
            const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100006,
            value: element.menuId,
          };
            const dataRemove = await this.removeRoleValue(payload);
            success = true;
          }
        }
      }
      if (success) {
        this.$q.notify({
          message: "Cập nhật quyền thành công !",
          color: "green",
        });
        this.showRole = false;
        this.reloadRole(this.currentRoleData.id);
        this.checkPermission();
      }
    },
    async saveSource() {
      let success = false;
      for (let i = 0; i < this.roleSource.length; i++) {
        const element = this.roleSource[i];
        if (element.changeType === "ADD") {
          const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100001,
            value: element.departmentId,
          };
          const data = await this.addRoleValue(payload);
          if (data.meta.success) {
            success = true;
            let fa =100000
            if (element.departmentId == 102340)  fa =100004
            if (element.departmentId == 102366)  fa =100005
               if (element.departmentId == 102366 || element.departmentId == 102340
               || element.departmentId == 100000) {
            const payload1 = {
                 roleId: this.currentRoleData.id,
                 fa:fa
            };
             const data1 = await this.$store.dispatch("keHoach/capnhatQC", payload1);
          }}
        }
        if (element.changeType === "REMOVE") {
          if (element.id) {
            const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100001,
            value: element.departmentId,
          };
            const dataRemove = await this.removeRoleValue(payload);
            success = true;
          }
        }
      }
      if (success) {
        this.$q.notify({
          message: "Cập nhật quyền thành công !",
          color: "green",
        });
        this.showRole = false;
        this.reloadRole(this.currentRoleData.id);
        this.checkPermission();
      }
    },
    async saveDes() {
      let success = false;
      for (let i = 0; i < this.roleDestinations.length; i++) {
        const element = this.roleDestinations[i];
        if (element.changeType === "ADD") {
          const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100002,
            value: element.departmentId,
          };
          const data = await this.addRoleValue(payload);
          if (data.meta.success) {
            success = true;
          }
        }
        if (element.changeType === "REMOVE") {
          if (element.id) {
            const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100002,
            value: element.departmentId,
          };
            const dataRemove = await this.removeRoleValue(payload);
            success = true;
          }
        }
      }
      if (success) {
        this.$q.notify({
          message: "Cập nhật quyền thành công !",
          color: "green",
        });
        this.showRole = false;
        this.reloadRole(this.currentRoleData.id);
        this.checkPermission();
      }
    },
    async saveMob() {
      let success = false;
      for (let i = 0; i < this.roleMenuMobile.length; i++) {
        const element = this.roleMenuMobile[i];
        if (element.changeType === "ADD") {
          const payload = {
            roleId: this.currentRoleData.id,
            roleTypeId: 100009,
            value: element.menuId,
          };
          const data = await this.addRoleValue(payload);
          if (data.meta.success) {
            success = true;
          }
        }
        if (element.changeType === "REMOVE") {
          if (element.id) {
            const payload = {
              roleId: this.currentRoleData.id,
              roleTypeId: 100009,
              value: element.menuId,
            };
            const dataRemove = await this.removeRoleValue(payload);
            success = true;
          }
        }
      }
      if (success) {
        this.$q.notify({
          message: "Cập nhật quyền thành công !",
          color: "green",
        });
        this.showRole = false;
        this.reloadRole(this.currentRoleData.id);
        this.checkPermission();
      }
    },
    async reloadRole(id) {
      const dataRole = await this.$store.dispatch(
        "base/GET_ROLE_INFO_BY_ID",
        id
      );
      this.loadRoleInfo(dataRole.data);
    },
    async onSelectionChangedTableUser(e) {
      const data = e.selectedRowsData[0];
      let dataRole = await this.$store.dispatch(
        "base/GET_ROLE_INFO_BY_ID",
        data.roleId
      );
      this.userId = data.roleId;
      await this.loadRoleInfo(dataRole.data);
    },
    async checkPermission() {
      const data2 = await this.getMenuOfAccount({ accountId: this.userId });
      this.listMenuOfAccount = [];
      this.listMenuOfAccount = data2.data;
      if (this.listMenuOfAccount.length > 0) {
        this.showPermission = true;
      } else {
        this.showPermission = false;
      }
    },
    async loadPermission() {
      const data2 = await this.getUserPermission({ id: this.menuId });
      this.listPermission = [];
      data2.data.forEach((el) => {
        this.listPermission.push({
          label: el.NAME,
          value: el.ID,
        });
      });
    }
  },
};
</script>

<style>
#gridContainerMenu {
  height: 500px;
}

.add {
  color: green;
}

.remove {
  text-decoration: line-through;
  color: red;
}
</style>
