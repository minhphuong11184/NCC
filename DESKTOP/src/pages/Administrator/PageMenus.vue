<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-12 top-title text-blue">Quản lý danh mục chức năng Desktop</div>
        </div>
        <MenuTodos />
      </q-card-section>
    </q-card>
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>
  </q-page>
</template>

<script>
import MenuTodos from "../../components/Adminsitrator/MenusTodo";

export default {
  components: {
    MenuTodos
  }
};
</script>
