<template>
  <div class="contents">
    <!--左-->
    <div class="content_left">
      <div class="pagetab">
        <!-- <div class="item">实时监测</div> -->
      </div>
      <ItemWrap class="content_left-top content_lr-item" title="房屋总览">
        <LeftTop/>
      </ItemWrap>
      <ItemWrap class="content_left-center content_lr-item" title="投诉建议">
        <LeftBottom />
      </ItemWrap>
<!--      <ItemWrap-->
<!--        class="content_left-bottom content_lr-item"-->
<!--        title="设备提醒"-->
<!--        style="padding: 0 10px 16px 10px"-->
<!--      >-->
<!--        <LeftCenter />-->
<!--      </ItemWrap>-->
    </div>
    <!--中-->
    <div class="content_center">
      <CenterMap class="content_center_top" />
<!--      <ItemWrap class="content_center-bottom" title="安装计划">-->
<!--          <RightTop/>-->
<!--      </ItemWrap>-->
    </div>
    <!--右-->
    <div class="content_right">
      <ItemWrap
        class="content_left-bottom content_lr-item"
        title="房屋绑定率"
      >
        <CenterBottom/>
      </ItemWrap>
      <ItemWrap
        class="content_left-bottom content_lr-item"
        title="最新互动"
        style="padding: 0 10px 16px 10px"
      >
        <RightBottom />
      </ItemWrap>
<!--      <ItemWrap-->
<!--        class="content_left-bottom content_lr-item"-->
<!--        title="数据统计图 "-->
<!--      >-->
<!--        <RightCenter />-->
<!--      </ItemWrap>-->
    </div>
  </div>
</template>

<script>
import LeftTop from './left-top.vue'
import LeftCenter from "./left-center.vue";
import LeftBottom from "./left-bottom.vue";
import CenterMap from "./center-map.vue";
import CenterBottom from "./center-bottom.vue";
import RightTop from "./right-top.vue";
import RightCenter from "./right-center.vue";
import RightBottom from "./right-bottom.vue";

export default {
  components: {
    LeftTop,
    LeftCenter,
    LeftBottom,
    CenterMap,
    RightTop,
    RightCenter,
    RightBottom,
    CenterBottom,
  },
  data() {
    return {

    };
  },
  filters: {
    numsFilter(msg) {
      return msg || 0;
    },
  },
  created() {
  },

  mounted() {},
  methods: {

  },
};
</script>
<style lang="scss" scoped>
// 内容
.contents {
  background-image: url("../../assets/img/pageBg.png");
  background-size: cover;
  background-position: center center;
  .content_left,
  .content_right {
    width: 430px;
    box-sizing: border-box;
    // padding: 16px 0;
  }

  .content_center {
    width: 550px;
  }

  //左右两侧 三个块
  .content_lr-item {
    height: 310px;
  }

  .content_center_top {
    width: 100%;
  }

  // 中间
  .content_center {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .content_center-bottom {
    height: 315px;
  }

  //左边 右边 结构一样
  .content_left,
  .content_right {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
  }
  .content_left{
    margin-top: -90px;
  }

}


@keyframes rotating {
    0% {
        -webkit-transform: rotate(0) scale(1);
        transform: rotate(0) scale(1);
    }
    50% {
        -webkit-transform: rotate(180deg) scale(1.1);
        transform: rotate(180deg) scale(1.1);
    }
    100% {
        -webkit-transform: rotate(360deg) scale(1);
        transform: rotate(360deg) scale(1);
    }
}
</style>
