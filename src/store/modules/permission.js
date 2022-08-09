import { constantRoutes, asyncRoutes } from "@/router";
const state = {
  routes: constantRoutes,
};

const mutations = {
  setRoute(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes];
  },
};
const actions = {
  filterRoute(context, menus) {
    const resRoutes = asyncRoutes.filter((item) => {
      return menus.includes(item.name);
    });
    context.commit("setRoute", resRoutes);
    return resRoutes;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
