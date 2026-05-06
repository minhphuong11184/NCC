<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.material.blue.light.compact.css";
import "devextreme/dist/css/dx.light.css";
export default {
  name: "App",
  computed: {
    ...mapGetters("base", ["myFactoryInfor"])
  },
  meta: {
    title: "TT25",
    titleTemplate: title => `${title} - Desktop App`
  },
  methods: {
    ...mapActions("base", ["GET_DEPARTMENTS", "getAllCongDoans"]),
    ...mapActions("lenhSanXuats", ["getAllSoLenhSanXuats"])
  },
  created() {
    this.$q.loadingBar.setDefaults({
      color: "positive",
      size: "3px",
      position: "top"
    });
    this.GET_DEPARTMENTS();
    this.getAllCongDoans({ factoryId: this.myFactoryInfor.id });
    this.getAllSoLenhSanXuats();
  }
};
</script>
