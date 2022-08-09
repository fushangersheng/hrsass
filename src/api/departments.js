/** *
 * 获取组织架构数据
 * **/
import request from "@/utils/request";
export function getDepartments() {
  return request({
    url: "/company/department",
  });
}
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: "delete",
  });
}
/**
 *  新增部门接口
 *
 * ****/
export function addDepartments(data) {
  return request({
    url: "/company/department",
    method: "post",
    data,
  });
}

export function getEmployeeSimple() {
  return request({
    url: "/sys/user/simple",
  });
}

/** *
 * 获取部门详情
 * ***/
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`,
  });
}
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}