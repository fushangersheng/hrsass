import request from "@/utils/request";

export function login(data) {
  return request({
    method: "POST",
    url: "/sys/login",
    data,
  });
}
export function getUserInfo() {
  return request({
    url: "/sys/profile",
    method: "post",
  });
}
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`,
  });
}

export function getInfo(token) {}

export function logout() {}
