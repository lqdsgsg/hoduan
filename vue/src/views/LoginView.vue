<template>
  <a-row style="width: 100vw; height: 100vh; overflow: hidden">
    <div
      style="
        z-index: 1;
        position: fixed;
        margin-top: 10%;
        margin-left: 40px;
        color: white;
        font-size: 22px;
        width: 60%;
      "
    >
      <h1>图书借还管理系统</h1>
      <h4 style="text-align: right; margin-top: 60px">
        ————智能数字化的图书管理方案,让知识照亮彼此
      </h4>
    </div>
    <a-col :span="18" style="background-color: antiquewhite">
      <img src="../assets/login.png" alt="" />
    </a-col>
    <a-col :span="6" style="padding: 0 50px 0 0; margin-top: 15%">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="账号"
          name="username"
          :rules="[{ required: true, message: '请输入账号!' }]"
        >
          <a-input v-model:value="formState.username"> </a-input>
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password v-model:value="formState.password">
          </a-input-password>
        </a-form-item>

        <a-form-item
          label="验证码"
          name="code"
          :rules="[{ required: true, message: '请输入验证码!' }]"
        >
          <a-row>
            <a-col :span="13"
              ><a-input v-model:value="formState.code"> </a-input
            ></a-col>
            <a-col :span="11"
              ><img
                :src="codeSrc"
                alt=" "
                @click="getUserCode"
                style="height: 32px; border-radius: 4px; cursor: pointer"
            /></a-col>
          </a-row>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit" style="width: 100%">
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { $login, $getUserCode } from "@/api";
import router from "@/router";
import { message } from "ant-design-vue";

interface FormState {
  username: string;
  password: string;
  code: string;
}

const formState = reactive<FormState>({
  username: "",
  password: "",
  code: "",
});

const codeSrc: any = ref("");
onMounted(() => {
  getUserCode();
});

const getUserCode = () => {
  $getUserCode().then((res: any) => {
    const bufferUrl = btoa(
      new Uint8Array(res).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    codeSrc.value = "data:image/png;base64," + bufferUrl;
  });
};

const onFinish = (values: any) => {
  $login(values).then((res) => {
    localStorage.setItem("userInfo", JSON.stringify(res));
    const userTemp: any = localStorage.getItem("userInfo");
    const user = JSON.parse(userTemp);
    if (user == "") {
      message.error("验证码错误/账号或密码错误/账号处于挂失", 0.5);
      formState.code = "";
      getUserCode();
      router.push("/");
      localStorage.clear();
      return 0;
    }
    if (user != "") {
      const redrict = user.menuList[0].m_path;
      message.success("欢迎您！" + user.u_name, 0.5);
      setTimeout(() => {
        router.push(redrict);
      }, 500);
    }
  });
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
  message.error("请填写表单", 0.5);
};
</script>

<style scoped>
div :deep() .ant-form-item-required::before {
  content: " " !important;
}
</style>
