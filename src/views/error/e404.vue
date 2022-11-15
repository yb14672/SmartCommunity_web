<template>
<div class="error">
    <div class="error-body-con">
        <el-card>
            <div class="error-body-con-title">4<span><i class="el-icon-warning-outline"></i></span>4</div>
            <p class="error-body-con-message">YOU&nbsp;&nbsp;LOOK&nbsp;&nbsp;LOST</p>
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
            window.open(this.$router.resolve({
                path: '/',
            }).href, '_self');
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
        transform: rotateZ(-60deg);
    }

    40% {
        transform: rotateZ(-10deg);
    }

    60% {
        transform: rotateZ(50deg);
    }

    80% {
        transform: rotateZ(-20deg);
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

            span {
                display: inline-block;
                color: #19be6b;
                font-size: 230px;
                animation: erroranimation 3s ease 0s infinite alternate;
            }
        }

        &-message {
            display: block;
            text-align: center;
            font-size: 30px;
            font-weight: 500;
            letter-spacing: 12px;
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

                span {
                    font-size: 100px;
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
