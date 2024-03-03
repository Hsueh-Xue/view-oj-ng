<script lang="ts">
import page_nav from '@/components/page_item/page_nav.vue'
import page_foot from '@/components/page_item/page_foot.vue'
import { defineComponent, onMounted, type Ref, ref } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
    page_foot,
    page_nav
  },
  setup(props, ctx) {
    const pageMainBox: Ref<any> = ref(null)
    const pageBox: Ref<any> = ref(null)
    onMounted(() => {
      let clientWidth = window.innerWidth
      pageBox.value.style.width = clientWidth + 'px'
    })
    return {
      pageMainBox,
      pageBox
    }
  }
})
</script>

<template>
  <div id="app" ref="pageBox">
    <div id="appBox">
      <page_nav></page_nav>
      <div class="page-main-box" ref="pageMainBox">
        <RouterView></RouterView>
      </div>
      <br>
      <page_foot></page_foot>
    </div>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
  border: 0;
  text-decoration: none;
  list-style-type: none;
  background: white;
}

#app {
  font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial,
  sans-serif;
  overflow: hidden;
  width: 100%;
  min-width: 1100px;
}

#appBox {
  width: 1100px;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
}

.page-main-box {
  margin-top: 20px;
  margin-bottom: 20px;
  position: relative;
}

.scrollbar {
  height: 100%;
}

.el-scrollbar__wrap {
  overflow: auto;
}

.el-select-dropdown .el-scrollbar .el-scrollbar__wrap {
  overflow: scroll;
}
</style>
