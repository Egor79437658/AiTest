interface MenuItem {
  title: string;
  link: string;
  icon: string;
}

export const useMenuItems = (): MenuItem[] => {
  const items: MenuItem[] = [
    {
      title: "Проекты",
      link: "#",
      icon: "#",
    },
    {
      title: "Планировщик",
      link: "#",
      icon: "#",
    },
    {
      title: "Ресурсы",
      link: "#",
      icon: "#",
    },
  ];

  return items;
};
