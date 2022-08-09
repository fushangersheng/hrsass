<template>
  <el-dialog
    :title="`${showTitle}部门`"
    :visible="isShowDialog"
    center
    @close="close"
  >
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- <el-input v-model="formData.manager"></el-input> -->
        <el-select
          v-model="formData.manager"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :value="item.username"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  getEmployeeSimple,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments";
export default {
  name: "AddDept",
  props: {
    isShowDialog: {
      type: Boolean,
      default: false,
    },
    currentNode: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const checkName = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      let childrenNode = null;
      if (this.formData.id) {
        childrenNode = depts.filter((item) => {
          return (
            item.pid === this.currentNode.pid && item.id !== this.currentNode.id
          );
        });
      } else {
        childrenNode = depts.filter((item) => {
          return item.pid === this.currentNode.id;
        });
      }
      const isRepeat = childrenNode.some((item) => item.name === value);
      if (isRepeat) {
        return Promise.reject(new Error("部门名称重复了"));
      }
    };
    const checkCode = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      let isRepeat = null;
      if (this.formData.id) {
        isRepeat = depts.some(
          (item) => item.code === value && item.id !== this.currentNode.id
        );
      } else {
        isRepeat = depts.some((item) => item.code === value);
      }
      if (isRepeat) {
        return Promise.reject("部门编码重复了");
      }
    };
    return {
      options: [],
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
          {
            validator: checkName,
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          {
            validator: checkCode,
            trigger: "blur",
          },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            trigger: "blur",
            min: 1,
            max: 300,
            message: "部门介绍要求1-50个字符",
          },
        ],
      },
    };
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑" : "新增";
    },
  },
  methods: {
    async getEmployeeSimple() {
      this.options = await getEmployeeSimple();
    },
    async onSubmit() {
      await this.$refs.form.validate();
      if (this.formData.id) {
        await updateDepartments(this.formData);
      } else {
        await addDepartments({
          ...this.formData,
          pid: this.currentNode.id,
        });
      }

      this.$message.success(`${this.showTitle}成功`);
      this.$emit("getDepartments");
      this.close();
    },
    close() {
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      this.$emit("update:isShowDialog", false);
      this.$refs.form.resetFields();
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id);
    },
  },
};
</script>

<style></style>
