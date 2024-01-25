<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'page_nav'
})
</script>

<template>
  <div id="page-top">
    <el-menu class="page-nav" mode="horizontal" router>
      <el-menu-item index="/" route="/">Home</el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.page-nav .el-menu-item,
::v-deep .page-nav .el-submenu__title {
  font-size: 16px;
}
</style>
