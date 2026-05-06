<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6 text-orange">Biểu mẫu đề xuất</div>
    </q-card-section>
    <q-separator />
    <q-card-actions v-show="isSelectedRowKeys" align="right">
      <q-btn
        color="primary"
        icon="save_alt"
        label="Lưu lại"
        @click="showConfirmChangeForm"
      />
    </q-card-actions>
    <q-separator />
    <q-card-section>
      <DxTreeList
        id="employees"
        ref="treeList"
        :data-source="proposalForms.data"
        :show-row-lines="true"
        :show-borders="true"
        :column-auto-width="true"
        :selected-row-keys.sync="selectedRowKeys"
        key-expr="id"
        parent-id-expr="parentId"
      >
        <DxSelection :recursive="recursive" mode="multiple" />
        <DxColumn data-field="name" caption="Tên biểu mẫu" />
        <DxColumn data-field="status" caption="Trạng thái" />
        <DxColumn
          :width="120"
          data-field="updatedAt"
          data-type="date"
          caption="Ngày áp dụng"
        />
      </DxTreeList>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from "vuex";
import { DxTreeList, DxSelection, DxColumn } from "devextreme-vue/tree-list";
export default {
  props: ["accountId"],
  components: {
    DxTreeList,
    DxSelection,
    DxColumn
  },
  data() {
    return {
      oldSelectedRowKeys: [],
      recursive: false,
      isSelectedRowKeys: false,
      isLoad: false,
      selectedRowKeys:[]
    };
  },
  computed: {
    ...mapGetters("proposalForm", ["proposalForms"])
  },
  created() {
    this.getAllProposalForms();
  },
  mounted() {
    // this.loadAccountForms();
    this.oldSelectedRowKeys = [...this.selectedRowKeys];
  },
  watch: {
    async accountId(newValue,oldValue){
      this.selectedRowKeys = [];
      if(newValue){
        this.selectedRowKeys = [];
        const { data } = await axios.get(
        "/api/v2/accountForm?accountId=" + newValue
         );
         data.data.forEach(e => this.selectedRowKeys.push(e.id))
      }
    },
    selectedRowKeys(newValue, oldValue) {
      if (this.compareArrayWithVueModel(newValue, this.oldSelectedRowKeys))
        this.isSelectedRowKeys = false;
      else this.isSelectedRowKeys = true;
    }
  },
  methods: {
    ...mapActions("proposalForm", [
      "getAllProposalForms",
      "syncAccountForm",
      "getAllAccountForms"
    ]),

    onRecursiveChanged() {
      this.selectedRowKeys = [];
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
    async showConfirmChangeForm() {
      console.log("Lưu lại");
      let accountForms = [];
      let accountId = this.accountId;
      for (let index = 0; index < this.selectedRowKeys.length; index++) {
        accountForms.push({
          accountId,
          proposalFormId: this.selectedRowKeys[index]
        });
      }
      await this.syncAccountForm({ accountId, accountForms });
      // this.loadAccountForms();
    }
  }
};
</script>
