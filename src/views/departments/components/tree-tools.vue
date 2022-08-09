<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 20px; width: 100%"
  >
    <el-col>
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeData.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="clickItem">
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item v-if="!isRoot" command="del"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "@/api/departments";
export default {
  props: {
    treeData: {
      type: Object,
      default: () => ({}),
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  // created() {
  //   console.log(this.treeData);
  // },
  methods: {
    async clickItem(type) {
      if (type === "add") {
        this.$emit("handleAddDept", this.treeData);
      } else if (type === "edit") {
        this.$emit("handleEditDept", this.treeData);
      } else {
        await this.$confirm("确认退出？");
        // console.log(333);
        await delDepartments(this.treeData.id);
        this.$message.success("删除成功");
        this.$emit("getDepartments");
      }
    },
  },
};
</script>

<style></style>
