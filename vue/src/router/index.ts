import { createRouter, createWebHistory } from "vue-router";
const modules = import.meta.glob("../views/**/**.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/:cathchAll(.*)",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
  ],
});

const user: any = JSON.parse(
  JSON.parse(JSON.stringify(localStorage.getItem("userInfo")))
);

const setRoute = () => {
  const user: any = JSON.parse(
    JSON.parse(JSON.stringify(localStorage.getItem("userInfo")))
  );
  const menu = user.menuList;
  const children: any = [];
  menu.map((item: any) => {
    const menuItem = {
      path: item.m_path,
      name: item.m_id,
      component: modules[`../views/pages/${item.m_component}View.vue`],
    };
    children.push(menuItem);
    router.addRoute({
      path: "/layout",
      name: "layout",
      component: () => import("../views/LayoutView.vue"),
      children: children,
    });
  });
};

if (user != null) {
  setRoute();
}

const asyncRoutesMark: any = JSON.parse(
  JSON.stringify(localStorage.getItem("asyncRoutesMark"))
);
if (asyncRoutesMark) {
  setRoute();
}

export default router;
