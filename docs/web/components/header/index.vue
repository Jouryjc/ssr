<template>
  <div class="header">
    <div class="header__left">
      <router-link class="logo" to="/">
        <img src="/images/logo.jpeg" alt="">
      </router-link>
    </div>
    <div class="nav">
      <div class="nav_left" />
      <searchBox />
      <router-link v-for="item in (isMobile ? headerItems.slice(0, 3) : headerItems)" :key="item.path" :to="item.path">
        {{ item.label }}
      </router-link>
      <a target="__black" href="https://github.com/zhangyuang/ssr">
        Github
      </a>
      <a target="__black" href="http://fe.ssr-fc.com/">
        前端开发手册
      </a>
      <a v-if="!isMobile" href="https://github.com/zhangyuang/ssr" target="_blank"><img
          src="https://img.shields.io/github/stars/zhangyuang/ssr.svg?color=000" alt="Node" style="width:90px"></a>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { webSiteConfig } from '@/config/index'
import searchBox from '../searchBox/index.vue'

export default defineComponent({
  components: {
    searchBox
  },
  inject: ['asyncData'],
  data() {
    return {
      headerItems: webSiteConfig.header.items,
      isMobile: true
    }
  },
  created() {
    const { ua } = this.asyncData.value
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua)
    this.isMobile = isMobile
  }

})
</script>

<style scoped lang="less">
@import "../../common.less";
@import "./index.less";
</style>
