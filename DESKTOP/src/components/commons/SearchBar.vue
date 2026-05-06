<template>
  <div class="YL__toolbar-input-container row no-wrap">
    <q-input dense outlined square v-model="search" placeholder="Tìm kiếm" class="bg-white col" />
    <q-btn
      class="YL__toolbar-input-btn"
      color="grey-3"
      text-color="grey-8"
      icon="search"
      unelevated
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      search:''
    }
  }
};
</script>

<style>
</style>