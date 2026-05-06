<template>
  <q-dialog v-model="show">
      <q-card style="min-width:600px">
          <q-card-section class="row items-center">
              <div class="top-title">Đọc kỹ hướng dẫn sử dụng trước khi dùng</div>
          </q-card-section>
          <q-card-section>
              <div class="help" v-html="help">

              </div>
          </q-card-section>
          <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
      </q-card>
  </q-dialog>
</template>

<script>
export default {
    props:{
        help:{
            type: String,
            default:`<h3>Chưa có hướng dẫn cho mục này !</h3>`
        },
        show:{
            type:Boolean,
            default: false
        }
    }
}
</script>

<style>

</style>