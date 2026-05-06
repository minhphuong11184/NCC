<template>
  <q-dialog v-model="show" :persistent="persistent" >
      <q-card class="full-height" style="min-width:80%"> 
          <q-card-section class="row items-center q-pb-none">
              <span class="q-ml-sm top-title">Chọn sản phẩm </span>
               <q-space />
          <q-btn icon="close" flat round dense @click="closeEvent" />
          </q-card-section>
          <q-card-section>
               <DxDataGrid
                :data-source="items"
                :selection="{ mode: 'single' }"
                :show-borders="true"
                :hover-state-enabled="true"
                :allow-column-resizing="true"
                :column-resizing-mode="'widget'"
                :column-min-width="50"
                :column-auto-width="true"
                key-expr="id"
                @selection-changed="onSelectionChanged"
                >
                <DxSearchPanel
                        :visible="true"
                        :width="440"
                        placeholder="Tìm sản phẩm"
                    />
                <DxFilterRow
                    :visible="true"
                />
                    <DxHeaderFilter
                        :visible="true"
                    />

                    <DxColumn
                        data-field="code"
                        caption="Mã"
                        :width="100"
                    />
                    <DxColumn data-field="name" caption="Tên sản phẩm"/>
                    <DxColumn
                        :width="80"
                        data-field="unit.name"
                        caption="Đơn vị"
                    >
                    </DxColumn>
                    <DxColumn data-field="height" :width="100" caption="Dầy"/>
                    <DxColumn data-field="width" :width="100" caption="Rộng"/>
                    <DxColumn data-field="length" :width="100" caption="Dài"/>
                    <DxColumn data-field="volumn" :width="110" caption="Khối lượng/m³"/>

                    <DxColumn
                        :width="125"
                        data-field="type.name"
                        caption="Loại sản phẩm"
                    >
                    </DxColumn>
                </DxDataGrid>
          </q-card-section>
      </q-card>
  </q-dialog>
</template>

<script>
import { DxDataGrid, DxColumn,DxSearchPanel,DxFilterRow,DxHeaderFilter } from 'devextreme-vue/data-grid';
export default {
    props:{
        show:{
            type: Boolean,
            default: false
        },
        persistent:{
            type: Boolean,
            default : true
        },
        items:{
            type: Array
        },
        closeEvent:{
            type: Function
        },
        xtype:{
            type:String,
            default:'item'
        },
        onSelectionChanged:{
            type:Function
        }
    },
    components: {
        DxDataGrid,
        DxColumn,
        DxSearchPanel,
        DxFilterRow,DxHeaderFilter
    },
    methods: {
    // onSelectionChanged({ selectedRowsData }) {
    //     const data = selectedRowsData[0];
    //     if (this.xtype==='material') {
    //         this.$store.dispatch('base/SELECT_MATERIRAL',data)
    //     }else {
    //         this.$store.dispatch('base/SELECT_ITEM',data)
    //     }
    //     this.closeEvent()
    // }
  }
}
</script>

<style>

</style>