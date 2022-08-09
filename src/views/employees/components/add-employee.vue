<template>
  <el-dialog title="新增员工" :visible="isShowDialog" @close="close">
    <!-- 表单 -->
    <el-form label-width="120px" :model="formData" :rules="rules" ref="form">
      <el-form-item label="姓名" prop="username">
        <el-input
          style="width: 60%"
          placeholder="请输入姓名"
          v-model="formData.username"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          style="width: 60%"
          placeholder="请输入手机号"
          v-model="formData.mobile"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          style="width: 60%"
          placeholder="请选择入职时间"
          v-model="formData.timeOfEntry"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          style="width: 60%"
          placeholder="请选择"
          v-model="formData.formOfEmployment"
        >
          <el-option
            v-for="item in select"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          style="width: 60%"
          placeholder="请输入工号"
          v-model="formData.workNumber"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-cascader
          :options="options"
          v-model="formData.departmentName"
          :props="{
            checkStrictly: true,
            emitPath: false,
            value: 'name',
            label: 'name',
          }"
          placeholder="请选择部门"
          @focus="getDepartments"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          style="width: 60%"
          placeholder="请选择转正时间"
          v-model="formData.correctionTime"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="close">取消</el-button>
          <el-button type="primary" size="small" @click="onSummit"
            >确定</el-button
          >
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from "@/api/departments";
import { transformTree } from "@/utils/index";
import EmployeeEnum from "@/api/constant/employees";
import { addEmployee } from "@/api/employees";
export default {
  data() {
    return {
      select: EmployeeEnum.hireType,
      options: [],
      formData: {
        username: "", // 用户姓名
        mobile: "", // 手机号
        formOfEmployment: "", // 聘用形式
        workNumber: "", // 工号
        departmentName: "", // 部门名称
        timeOfEntry: "", // 入职时间
        correctionTime: "", // 转正时间
      },
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
    };
  },
  props: {
    isShowDialog: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit("update:isShowDialog", false);
      this.$refs.form.resetFields();
      this.formData = {
        username: "", // 用户姓名
        mobile: "", // 手机号
        formOfEmployment: "", // 聘用形式
        workNumber: "", // 工号
        departmentName: "", // 部门名称
        timeOfEntry: "", // 入职时间
        correctionTime: "", // 转正时间
      };
    },
    async getDepartments() {
      const { depts } = await getDepartments();
      // console.log(depts);
      this.options = transformTree(depts);
      // console.log(this.options);
    },
    async onSummit() {
      await this.$refs.form.validate();
      await addEmployee(this.formData);
      this.$message.success("新增成功");
      this.close();
      this.$parent.getEmployeeList();
    },
  },
};
</script>

<style></style>
