<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="isShowDia = true"
                >新增角色</el-button
              >
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="tableData">
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作" v-slot="{ row }">
                <el-button
                  size="small"
                  type="success"
                  @click="assignPerm(row.id)"
                  >分配权限</el-button
                >
                <el-button size="small" type="primary" @click="edit(row.id)"
                  >编辑</el-button
                >
                <el-button size="small" type="danger" @click="del(row.id)"
                  >删除</el-button
                >
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="currentChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form
              ref="form"
              label-width="120px"
              style="margin-top: 50px"
              :model="formData"
            >
              <el-form-item label="公司名称">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.name"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.companyAddress"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.mailbox"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                  v-model="formData.remarks"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog
      :title="`${showTitle}角色`"
      :visible.sync="isShowDia"
      @close="close"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog :visible="showDialog" title="分配权限" @close="closePerm">
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK"
            >确定</el-button
          >
          <el-button size="small" @click="closePerm">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
  assignPerm,
} from "@/api/setting";
import { mapGetters } from "vuex";
import { transformTree } from "@/utils";
import { getPermissionList } from "@/api/permission";
export default {
  data() {
    return {
      defaultProps: {
        label: "name",
      },
      roleId: null,
      selectCheck: [],
      permData: [],
      showDialog: false,
      isShowDia: false,
      roleForm: {},
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
      },

      activeName: "second",
      tableData: [],
      formData: {},
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 2,
        total: 0, // 记录总数
      },
    };
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  methods: {
    closePerm() {
      this.showDialog = false;
      this.CheckedKeys = [];
    },
    async btnPermOK() {
      const CheckedKeys = this.$refs.permTree.getCheckedKeys();
      await assignPerm({
        id: this.roleId,
        permIds: CheckedKeys,
      });
      this.$message.success("分配权限成功");
      this.closePerm();
    },
    async assignPerm(id) {
      this.permData = transformTree(await getPermissionList(), "0");
      this.roleId = id;
      this.selectCheck = (await getRoleDetail(id)).permIds;
      // console.log(this.selectCheck);
      this.showDialog = true;
    },
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page);
      // console.log(rows);
      this.tableData = rows;
      this.page.total = total;
    },
    currentChange(newPage) {
      this.page.page = newPage;
      this.getRoleList();
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId);
      // console.log(this.formData);
    },
    async del(id) {
      await this.$confirm("确认删除？");
      await deleteRole(id);
      this.$message.success("删除成功");
      if ((this.tableData.length = 1 && this.page.page > 1)) {
        this.page.page--;
      }
      this.getRoleList();
    },
    async edit(id) {
      this.isShowDia = true;
      this.roleForm = await getRoleDetail(id);
    },
    close() {
      this.isShowDia = false;
      this.$refs.form.resetFields();
      this.roleForm = {};
    },
    async btnOK() {
      await this.$refs.form.validate();
      if (this.roleForm.id) {
        await updateRole(this.roleForm);
      } else {
        await addRole(this.roleForm);
      }
      await this.getRoleList();
      this.$message.success("编辑成功");
      this.close();
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
  computed: {
    ...mapGetters(["companyId"]),
    showTitle() {
      return this.roleForm.id ? "编辑" : "新增";
    },
  },
};
</script>

<style></style>
