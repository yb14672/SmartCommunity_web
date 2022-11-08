<template>
    <div class="jianbian">
        <router-view></router-view>
        <h1>欢迎您进入智慧社区系统</h1>
            <!-- 轮播区域 -->
            <div class="imgBox">
                <el-carousel :interval="4000" type="card" height="400px">
                    <el-carousel-item v-for="item in imgList" :key="item">
                        <img :src="item.url" alt="" style="width: 100%"/>
                    </el-carousel-item>
                </el-carousel>
            </div>
        <center>
        <el-link style="color: white;font-size:16px;margin-top: 20px;margin-bottom: 20px"
                 type="info" @click="login" icon="el-icon-question">
            关乎我们
        </el-link>
        </center>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //星空效果div循环生成800个
                items: 800,
                distance: 800,
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
                timer: null, //定时器
            };
        },
        computed: {
            //上一张
            prevIndex() {
                if (this.listIndex === 0) {
                    return this.list.length - 1;
                } else {
                    return this.listIndex - 1;
                }
            },
            //下一张
            nextIndex() {
                if (this.listIndex === this.list.length - 1) {
                    return 0;
                } else {
                    return this.listIndex + 1;
                }
            },
        },
        methods: {
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
                this.$router.push("/Login")
            }
        },
        created() {
            //定时器
            this.setTimer();
        },
        mounted() {
        },
    };
</script>

<style scoped lang="less">
    .home {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .box {
            position: relative;
            width: 500px;
            height: 500px;

            img {
                width: 100%;
                height: 100%;
                z-index: 100;
            }

            p {
                cursor: pointer;
                color: white;
                font-size: 28px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 50px;
                height: 50px;
                background: rgba(0, 0, 0, 0.5);
            }

            .left {
                position: absolute;
                top: 50%;
                left: 0;
            }

            .right {
                position: absolute;
                top: 50%;
                right: 0;
            }

            ul {
                list-style: none;
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: absolute;
                width: 150px;
                height: 20px;
                top: 90%;
                right: 35%;

                .color {
                    background: red;
                    color: red;
                }

                li {
                    cursor: pointer;
                    width: 10px;
                    height: 10px;
                    background: white;
                    border-radius: 50%;
                }
            }
        }
    }

    .imgBox {
        margin-top: 60px;
    }

    .content img {
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
        opacity: 0.4;
        margin: 10px;
        display: inline-block;
        /* span是行内元素 */
    }

    /* 圆圈圈激活后*/

    .bottom .active {
        /*数值分别是：水平偏移，上下偏移，模糊，大小，颜色 */
        box-shadow: 0px 0px 2px 2px #53a8ff;
        background-color: #a0cfff !important;
        opacity: 0.6;
    }

    h1 {
        overflow: hidden;
        font-size: 80px;
        width: 0;
        height: 150px;
        line-height: 150px;
        margin: 100px auto;
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
        padding: 0;
        height: 100%;
        width: 100%;
        /* margin: 0;
                  padding: 0; */
        font-family: "montserrat";
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

