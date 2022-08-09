import { getToken, setToken, removeToken, setTime } from "@/utils/auth";
import { login, getUserInfo, getUserDetailById } from "@/api/user";
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {},
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = { ...userInfo };
    },
    setToken(state, token) {
      state.token = token;
      setToken(token);
    },
    removeToken(state) {
      (state.token = null), removeToken();
    },
    removeUserInfo(state) {
      state.userInfo = {};
    },
  },
  actions: {
    async login(context, data) {
      const res = await login(data);
      // console.log(res);
      context.commit("setToken", res);
      setTime();
    },
    async getUserInfo(context) {
      const res = await getUserInfo();
      const baseInfo = await getUserDetailById(res.userId);
      context.commit("setUserInfo", { ...res, ...baseInfo });
      return { ...baseInfo, ...res };
    },
    logout(context) {
      context.commit("removeUserInfo");
      context.commit("removeToken");
      // resetRouter();
      context.commit("permission/setRoute", [], { root: true });
    },
  },
};
