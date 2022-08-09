<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="form"
              :model="formData"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input style="width: 300px" v-model="formData.username" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input
                  style="width: 300px"
                  type="password"
                  v-model="formData.password2"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUserDetailById"
                  >更新</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <component :is="userInfo"></component>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="JobInfo"></component>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from "@/api/user";
import userInfo from "@/views/employees/components/user-info.vue";
import JobInfo from "@/views/employees/components/job-info.vue";

export default {
  data() {
    return {
      JobInfo: JobInfo,
      userInfo: userInfo,
      formData: {
        username: "",
        password2: "",
      },
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 9, message: "密码长度6-9位", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserDetailById();
  },
  methods: {
    async getUserDetailById() {
      this.formData = await getUserDetailById(this.$route.params.id);
    },
    async saveUserDetailById() {
      try {
        await this.$refs.form.validate();
        await saveUserDetailById({
          ...this.formData,
          password: this.formData.password2,
        });
        this.$message.success("保存成功");
      } catch (e) {
        // this.$message.fail("保存失败");
      }
    },
  },
};
</script>

<style></style>
