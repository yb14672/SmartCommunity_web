<!--
 * @Author: daidai
 * @Date: 2022-03-01 09:43:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-09 11:40:22
 * @FilePath: \web-pc\src\pages\big-screen\view\indexs\left-bottom.vue
-->
<template>
  <div
    v-if="pageflag"
    class="left_boottom_wrap beautify-scroll-def"
    :class="{ 'overflow-y-auto': !sbtxSwiperFlag }"
  >
    <component :is="components" :data="list" :class-option="defaultOption">
      <ul class="left_boottom">
        <li class="left_boottom_item" v-for="(item, i) in list" :key="i">
          <span class="orderNum doudong">{{ i + 1 }}</span>
          <div class="inner_right">
            <div class="dibu"></div>
            <div class="flex">
              <div class="info">
                <span class="labels">建议ID：</span>
                <span class="contents zhuyao doudong wangguan" style="font-size: 12px">
                  {{ item.complaintSuggestId }}</span
                >
              </div>
              <div class="info">
                <span class="labels">时间：</span>
                <span class="contents " style="font-size: 12px">
                  {{ item.createTime }}</span
                >
              </div>
            </div>

              <span
                class="types doudong"
                :class="{
                  typeRed: item.complaintSuggestType == 'Complaint',
                  typeGreen: item.complaintSuggestType == 'Suggest',
                }"
                >{{ item.complaintSuggestType == 'Complaint' ? "投诉" : "建议" }}</span
              >
            <div class="info addresswrap">
              <span class="labels">投诉预览：</span>
              <span v-if="item.complaintSuggestContent.length<10" class="contents ciyao" style="font-size: 12px">
                {{ item.complaintSuggestContent }}
              </span>
              <span v-else class="contents ciyao" style="font-size: 12px">
                {{ item.complaintSuggestContent.slice(0,9)}}...
              </span>
            </div>
          </div>
        </li>
      </ul>
    </component>
  </div>
  <Reacquire v-else @onclick="getData" style="line-height: 200px" />
</template>

<script>
import { currentGET } from "@/api";
import vueSeamlessScroll from "vue-seamless-scroll"; // vue2引入方式
import Kong from "../../components/kong.vue";
export default {
  components: { vueSeamlessScroll, Kong },
  data() {
    return {
      list: [],
      pageflag: true,
      components: vueSeamlessScroll,
      defaultOption: {
        ...this.$store.state.setting.defaultOption,
        singleHeight: 240,
        limitMoveNum: 5,
        step: 0,
      },
    };
  },
  computed: {
    sbtxSwiperFlag() {
      let sbtxSwiper = this.$store.state.setting.sbtxSwiper;
      if (sbtxSwiper) {
        this.components = vueSeamlessScroll;
      } else {
        this.components = Kong;
      }
      return sbtxSwiper;
    },
  },
  created() {

  },

  mounted() {
    this.getData();
  },
  methods: {
    addressHandle(item) {
      let name = item.provinceName;
      if (item.cityName) {
        name += "/" + item.cityName;
        if (item.countyName) {
          name += "/" + item.countyName;
        }
      }
      return name;
    },
    getData() {
      this.pageflag = true;
      // this.pageflag =false
      currentGET("big2", { limitNum: 20 }).then((res) => {
        console.log("投诉建议", res);
        if (res.data.meta.errorCode === 200) {
          this.countUserNumData = res.data;
          this.list = res.data.data;
          let timer = setTimeout(() => {
            clearTimeout(timer);
            this.defaultOption.step =
              this.$store.state.setting.defaultOption.step;
          }, this.$store.state.setting.defaultOption.waitTime);
        } else {
          this.pageflag = false;
          this.$Messages({
            text: res.data.data,
            type: "warning",
          });
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
@import "src/assets/css/variable";
.left_boottom_wrap {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.doudong {
  //  vertical-align:middle;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  backface-visibility: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

.left_boottom {
  width: 100%;
  height: 100%;

  .left_boottom_item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    font-size: 14px;
    margin: 10px 0;
    .orderNum {
      margin: 0 16px 0 -20px;
    }

    .info {
      margin-right: 10px;
      display: flex;
      align-items: center;
      color: #fff;

      .labels {
        flex-shrink: 0;
        font-size: 12px;
        color: black;
        //color: rgba(255, 255, 255, 0.6);
      }

      .zhuyao {
        color: $primary-color;
        font-size: 15px;
      }

      .ciyao {
        color: rgba(255, 255, 255, 0.8);
      }

      .warning {
        color: #e6a23c;
        font-size: 15px;
      }
    }

    .inner_right {
      position: relative;
      height: 100%;
      width: 380px;
      flex-shrink: 0;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .dibu {
        position: absolute;
        height: 2px;
        width: 100%;
        background-image: url("../../assets/img/zuo_xuxian.png");
        bottom: -10px;
        left: -2%;
        background-size: cover;
      }
      .addresswrap {
        width: 100%;
        display: flex;
        margin-top: 8px;
      }
    }

    .wangguan {
      color: #1890ff;
      font-weight: 900;
      font-size: 15px;
      width: 80px;
      flex-shrink: 0;
    }


    .time {
      font-size: 12px;
      // color: rgba(211, 210, 210,.8);
      color: #fff;
    }

    .address {
      font-size: 12px;
      cursor: pointer;
      // @include text-overflow(1);
    }

    .types {
      width: 30px;
      flex-shrink: 0;
    }

    .typeRed {
      color: #fc1a1a;
    }

    .typeGreen {
      color: #29fc29;
    }
  }
}
</style>
