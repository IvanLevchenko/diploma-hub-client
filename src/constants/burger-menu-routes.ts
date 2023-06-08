export type menuRoutesList = {
  route: string;
  routeName: {
    [key: string]: string;
  };
  adminOnly?: boolean;
};

const burgerMenuRoutes: menuRoutesList[] = [
  {
    route: "/",
    routeName: {
      en: "Main",
      ua: "Головна",
    },
  },
  {
    route: "/groups",
    routeName: {
      ua: "Групи",
      en: "Groups",
    },
    adminOnly: true,
  },
  {
    route: "/students",
    routeName: {
      ua: "Студенти",
      en: "Students",
    },
    adminOnly: true,
  },
  {
    route: "/logout",
    routeName: {
      ua: "Вийти",
      en: "Log out",
    },
  },
];

export default burgerMenuRoutes;
