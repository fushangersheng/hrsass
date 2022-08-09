export const imgError = {
  inserted(el, options) {
    // console.log(el);
    el.onerror = function () {
      el.src = options.value;
    };
  },
};
