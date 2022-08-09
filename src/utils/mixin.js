import store from "@/store";
const mixin = {
  checkPermission(key) {
    return !store.state.user.userInfo.roles.points.includes(key);
  },
};
export default {
  mixins: [mixin],
};
