<template>
  <q-dialog v-model="show" :persistent="persistent" >
      <q-card class="full-height full-width"> 
          <q-card-section class="row items-center q-pb-none">
              <span class="q-ml-sm top-title">Chọn công đoạn </span>
               <q-space />
          <!-- <q-btn icon="close" flat round dense v-close-popup /> -->
          </q-card-section>
          <q-card-section>
               <DxDataGrid
                :data-source="departments"
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
                        placeholder="Tìm công đoạn"
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
                    <DxColumn
                        data-field="type"
                        caption="Loại"
                        :width="100"
                        :group-index="0"
                    />
                    <DxColumn data-field="name" caption="Tên công đoạn"/>
                    

                   
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
        departments:{
            type: Array
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
  }
}
</script>

<style>

</style>