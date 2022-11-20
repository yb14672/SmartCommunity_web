<template>
<div class="error">
    <div class="error-body-con">
        <el-card>
            <div class="error-body-con-title">
                5<span class="error-0-span"></span><span class="error-0-span"></span>
            </div>
            <p class="error-body-con-message">Oops! the server is wrong</p>
            <div class="error-btn-con">
                <el-button @click="goHome" size="large" plain class="btn">返回首页</el-button>
                <el-button @click="backPage" size="large" type="primary" class="btn">返回上一页</el-button>
            </div>
        </el-card>
    </div>
</div>
</template>

<script>
export default {
    name: 'error',
    methods: {
        backPage() {
            this.$router.go(-1);
        },
        goHome() {
            this.$router.push({
                name: 'home_index'
            });
        }
    }
};
</script>

<style lang="less" scoped>
@keyframes erroranimation {
    0% {
        transform: rotateZ(0deg);
    }

    20% {
        transform: rotateZ(-10deg);
    }

    40% {
        transform: rotateZ(5deg);
    }

    60% {
        transform: rotateZ(-5deg);
    }

    80% {
        transform: rotateZ(10deg);
    }

    100% {
        transform: rotateZ(0deg);
    }
}

.error {
    &-body-con {
        width: 700px;
        height: 500px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        &-title {
            text-align: center;
            font-size: 240px;
            font-weight: 700;
            color: #2d8cf0;
            height: 260px;
            line-height: 260px;
            margin-top: 40px;

            .error-0-span {
                display: inline-block;
                position: relative;
                width: 170px;
                height: 170px;
                border-radius: 50%;
                border: 20px solid #ed3f14;
                color: #ed3f14;
                margin-right: 10px;

                i {
                    display: inline-block;
                    font-size: 120px;
                    position: absolute;
                    bottom: -10px;
                    left: 10px;
                    transform-origin: center bottom;
                    animation: erroranimation 3s ease 0s infinite alternate;
                }
            }
        }

        &-message {
            display: block;
            text-align: center;
            font-size: 30px;
            font-weight: 500;
            letter-spacing: 4px;
            color: #dddde2;
        }
    }

    &-btn-con {
        text-align: center;
        padding: 20px 0;
        margin-bottom: 40px;

        .btn {
            width: 200px;

            &:not(:first-child) {
                margin-left: 40px;
            }
        }
    }
}
</style>
<style lang="less" scoped>
@media (max-width:767px) {
    .error {
        &-body-con {
            width: 300px;

            &-title {
                font-size: 100px;
                height: 100px;
                line-height: 100px;

                .error-0-span {
                    width: 50px;
                    height: 50px;
                    border-width: 10px;
                    margin-left: 10px;

                    i {
                        font-size: 60px;
                    }
                }
            }
        }

        &-btn-con {
            .btn {
                width: 100%;

                &:not(:first-child) {
                    margin-left: 0px;
                    margin-top: 10px;
                }
            }
        }
    }
}
</style>
