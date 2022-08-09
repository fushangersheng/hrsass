<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template #before>
          <span>共1610条件记录</span>
        </template>
        <template #after>
          <el-button size="mini" type="primary" @click="$router.push('/import')"
            >导入</el-button
          >
          <el-button size="mini" type="danger" @click="toExport"
            >导出</el-button
          >
          <el-button size="mini" type="warning" @click="isShowDialog = true"
            >新增员工</el-button
          >
        </template>
      </PageTools>
      <el-table :data="list" border style="width: 100%">
        <el-table-column fixed type="index" prop="date" label="序号" width="95">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="95">
        </el-table-column>
        <el-table-column prop="staffPhoto" label="头像" width="95">
          <template slot-scope="{ row }">
            <el-avatar
              @click.native="showQr(row.staffPhoto)"
              :src="row.staffPhoto"
            >
              <img src="@/assets/common/img.jpeg" alt=""
            /></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="workNumber" label="工号" width="95">
        </el-table-column>
        <el-table-column
          prop="formOfEmployment"
          label="聘用形式"
          width="95"
          :formatter="formatEmployment"
        >
        </el-table-column>
        <el-table-column prop="departmentName" label="部门名称" width="95">
        </el-table-column>
        <el-table-column prop="" label="入职时间" width="95">
          <template v-slot="{ row }">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column prop="enableState" label="账户状态" width="95">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button
            >
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="edit(row.id)"
              >角色</el-button
            >
            <el-button
              :disabled="checkPermission('DELETE_USER')"
              type="text"
              size="small"
              @click="del(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :page-size="page.size"
          :current-page.sync="page.page"
          :total="page.total"
          @current-change="getEmployeeList"
        />
      </el-row>
    </div>
    <AddEmployee :isShowDialog.sync="isShowDialog"></AddEmployee>
    <el-dialog title="二维码" :visible.sync="isShowQr">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <assignRole
      :showRoleDialog.sync="showRoleDialog"
      ref="role"
      :userId="userId"
    ></assignRole>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees";
import AddEmployee from "./components/add-employee.vue";
import { formatDate } from "@/utils/filters";
import QrCode from "qrcode";
import assignRole from "./components/assign-role.vue";
import mixin from "@/utils/mixin";
export default {
  mixins: [mixin],
  data() {
    return {
      userId: "",
      showRoleDialog: false,
      isShowQr: false,
      isShowDialog: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0, // 总数
      },
    };
  },
  created() {
    this.getEmployeeList();
  },
  components: {
    AddEmployee,
    assignRole,
  },
  methods: {
    async edit(id) {
      this.userId = id;
      await this.$refs.role.getCurrId(id);
      this.showRoleDialog = true;
    },
    showQr(url) {
      this.isShowQr = true;
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.myCanvas, url);
      });
    },
    async toExport() {
      const headers = {
        手机号: "mobile",
        姓名: "username",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      const { export_json_to_excel } = await import(
        /* webackChunkName:'Export' */ "@/utils/Export"
      );
      const { rows } = await getEmployeeList({ page: 1, size: this.total });
      const resData = this.formatterData(rows, headers);

      export_json_to_excel({
        header: Object.keys(headers),
        data: resData, // 具体数据 必填
        filename: "excel-list", //非必填
        autoWidth: true, //非必填
        bookType: "xlsx", //非必填
      });
    },
    formatterData(rows, headers) {
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (["timeOfEntry", "correctionTime"].includes(headers[key])) {
            return formatDate(item[headers[key]]);
          }
          if (headers[key] === "formOfEmployment") {
            return (
              EmployeeEnum.hireType.find(
                (child) => +child.id === +item[headers[key]]
              )?.value || "未知"
            );
          }
          return item[headers[key]];
        });
      });
    },
    async del(id) {
      try {
        await this.$confirm("确认删除？");
        await delEmployee(id);
        this.$message.success("删除成功");
        await this.getEmployeeList();
      } catch (e) {
        console.log(e);
      }
    },
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page);
      this.list = rows;
      this.page.total = total;
    },

    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      // console.log(obj);
      return obj ? obj.value : "未知";
    },
  },
};
</script>

<style></style>
