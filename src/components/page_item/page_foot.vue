<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'page_foot'
})
</script>

<template>
  <div class="page-foot">
    <p>
      Copyright &copy; 2024-{{ new Date().getFullYear() }} HZNU-ACM-LAB. All Rights Reserved.<br />
      Powered by
    </p>
  </div>
</template>

<style scoped>
.page-foot {
  width: 100%;
  text-align: center;
  position: fixed;
  bottom: 0;
}

p {
  color: #909399;
  font-size: 14px;
  position: relative;
  line-height: 100%;
  top: 50%;
  transform: translate(0, -50%);
}
</style>
