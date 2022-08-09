<template>
  <div class="dashboard-container" v-loading="loading">
    <div class="app-container">
      <el-card class="tree-card">
        <TreeTools
          :treeData="company"
          :is-root="true"
          @handleAddDept="handleAddDept"
        ></TreeTools>
        <!-- 用了一个行列布局 -->
      </el-card>
      <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
        <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
        <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
        <TreeTools
          :treeData="data"
          slot-scope="{ data }"
          @getDepartments="getDepartments"
          @handleAddDept="handleAddDept"
          @handleEditDept="handleEditDept"
        ></TreeTools>
      </el-tree>
    </div>
    <addDept
      ref="addDept"
      :isShowDialog.sync="isShowDialog"
      :current-node="currentNode"
      @getDepartments="getDepartments"
    ></addDept>
  </div>
</template>

<script>
import TreeTools from "@/views/departments/components/tree-tools.vue";
import addDept from "@/views/departments/components/add-dept.vue";
import { getDepartments } from "@/api/departments";
import { transformTree } from "@/utils";
export default {
  components: {
    TreeTools,
    addDept,
  },
  data() {
    return {
      defaultProps: {
        label: "name",
      },
      departs: [],
      company: {},
      isShowDialog: false,
      currentNode: "",
      loading: false,
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    handleAddDept(node) {
      this.currentNode = node;
      this.isShowDialog = true;
    },
    handleEditDept(node) {
      this.isShowDialog = true;
      this.currentNode = node;
      this.$refs.addDept.getDepartDetail(node.id);
    },
    async getDepartments() {
      try {
        this.loading = true;
        const res = await getDepartments();
        this.company = {
          name: res.companyName,
          manager: res.conpanyManage || "负责人",
          id: "",
        };
        this.departs = transformTree(res.depts, "");
        // console.log(this.departs);
      } catch (e) {
        this.loading = false;
      }
      this.loading = false;
    },
    handleNodeClick(data) {
      // console.log(data);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 850px;
  // height: 100px;
  margin: 20px auto;
}
.tree-card {
  // height: 80px;
  // padding: 10px;
  font-size: 14px;
  background: #9cf;
  color: #036;
  border: 1px solid #ebeef5;
  // .el-card__body{
  //   padding: 0px;
  // }
}
</style>
