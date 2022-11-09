<template>
  <div class="jianbian">
    <router-view></router-view>
    <!-- 轮播区域 -->
    <div class="imgBox">
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item v-for="item in imgList" :key="item">
          <img :src="item.url" alt="" style="width: 100%"/>
        </el-carousel-item>
      </el-carousel>
    </div>
    <center>
      <h1 @click="login">欢迎您进入智慧社区系统</h1>
      <el-link style="color: white;font-size:20px;margin-top: 20px;margin-bottom: 20px"
               type="info" @click="login" icon="el-icon-question">
        点击进入系统
      </el-link>
      <!--底部footer-->
      <footer style="font-size: 20vm;color: white "
              class="ui inverted vertical segment m-padded-tb-massive m-opacity-tiny animated bounceInUp">
        <div class="ui center aligned container">
          <div class="ui inverted divided stackable grid">
            <div class="four wide column">
              <h4 class="ui inverted header m-text-thin m-text-spaced">联系我</h4>
              <div class="ui inverted link list">
                <a href="#" class="item">QQ:2334969610</a><br>
                <a href="#" class="item">微信:community city</a><br>
                <a href="#" class="item">手机号:17458674343</a>
              </div>
            </div>
            <div class="five wide column">
              <h4 class="ui inverted header m-text-thin m-text-spaced">最新博客</h4>
              <p class="m-text-thin m-text-spaced m-opacity-mini">关注我们</p>
            </div>
          </div>
          <div class="ui inverted section divider"></div>
          <p class="m-text-thin m-text-spaced m-opacity-mini">
            <span>Copyright © 2022 - 2023 web Designed by Community opacity</span>
          </p>
          <p>
            <span>备案号</span>
          </p>
          <p>
            本站已安全运行{{ dnum }}天 {{ hnum }}小时 {{ mnum }} 分 {{ snum }}秒
          </p>
        </div>
      </footer>
    </center>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: '',
      dnum: 0,
      hnum: 0,
      mnum: 0,
      snum: 0,
      imgList: [
        {url: require("../assets/imgs/pic01.jpg")},
        {url: require("../assets/imgs/pic02.jpg")},
        {url: require("../assets/imgs/pic03.jpg")},
        {url: require("../assets/imgs/pic04.jpg")},
      ],
      index: 0, //现在是第几张
      time: 1500, //设置循环时间
      width: 0, //移动的长度
      listIndex: 0, //默认显示第几张图片
    };
  },
  computed: {},
  methods: {
    // 这里是计算建站时间的脚本
    createTime() {
      let now = new Date()
      // 页脚建站时间计算脚本
      let grt = new Date("02/24/2021 00:00:00");//在此处修改你的建站时间，格式：月/日/年 时:分:秒
      now.setTime(now.getTime() + 250);

      let days = (now - grt) / 1000 / 60 / 60 / 24;
      this.dnum = Math.floor(days);
      let hours = (now - grt) / 1000 / 60 / 60 - (24 * this.dnum);
      this.hnum = Math.floor(hours);
      if (String(this.hnum).length == 1) {
        this.hnum = "0" + this.hnum;
      }
      let minutes = (now - grt) / 1000 / 60 - (24 * 60 * this.dnum) - (60 * this.hnum);
      this.mnum = Math.floor(minutes);
      if (String(this.mnum).length == 1) {
        this.mnum = "0" + this.mnum;
      }
      let seconds = (now - grt) / 1000 - (24 * 60 * 60 * this.dnum) - (60 * 60 * this.hnum) - (60 * this.mnum);
      this.snum = Math.round(seconds);
      if (String(this.snum).length == 1) {
        this.snum = "0" + this.snum;
      }
    },
    //1秒切图
    setTimer() {
      this.timer = setInterval(() => {
        this.listIndex++;
        if (this.listIndex === this.list.length) {
          this.listIndex = 0;
        }
      }, 1000);
    },
    login() {
      //清除定时器
      clearInterval(this.timer);
      this.$router.push("/Login")
    }
  },
  created() {
    //定时器
    this.setTimer();
  },
  mounted() {
    // setInterval函数中的this指向是window而不是vue , 所以这里需要将this赋值给that , 在setInterval中用that代替this
    let that = this
    // 每隔1000毫秒就调用一次createTime()
    this.timer = setInterval(function () {
      that.createTime()
    }, 1000);
  },
  // 销毁这个定时任务
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped lang="less">

.imgBox {
  margin-top: 60px;

}

.content img {
  margin-top: 20vm;
  width: 400px;
  border-radius: 10px;
}

.cycle button {
  width: 40px;
  height: 80px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
  text-align: center;
}

.cycle .right {
  right: 0px;
}

.cycle .left {
  left: 0px;
}

.bottom {
  position: absolute;
  bottom: 10px;
  display: inline-block;
  transform: translateX(50%);
  right: 50%;
}

.bottom span {
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: rgba(110, 102, 102, 0.849);
  opacity: 0.3%;
  margin: 10px;
  display: inline-block;
  /* span是行内元素 */
}

h1 {
  overflow: hidden;
  font-size: 60px;
  width: 0;
  height: 150px;
  line-height: 150px;
  margin: 40px auto;
  color: #fff;
  /* background: lightcoral; */
  white-space: nowrap;
  animation: w 4s steps(13) forwards;
  text-align: center;
}

@keyframes w {
  0% {
    width: 0;
  }
  100% {
    width: 1100px;

  }
}

.tupian-img {
  width: 1100px;
  height: 500px;
  /* margin-top:20px; */
}

.el-card {
  width: 100%;
  height: 500px;
}

.jianbian {
  width: 100%;
  height: 100%;

  top: 0;
  z-index: 9;
  padding: 0;
  font-family: "微软雅黑 Light", fantasy;
  background-image: linear-gradient(45deg,
  #2c3e50,
  #27ae60,
  #2980b9,
  #e74c3c,
  #8e44ad);
  background-size: 400%;
  animation: bganimation 15s infinite;
  margin-top: -100px;
}

@keyframes bganimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

