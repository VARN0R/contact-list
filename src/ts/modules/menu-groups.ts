export const initMenuGroups = () => {
  const menuGroups = document.querySelector(".menu-groups") as HTMLElement;
  const filterButton = document.querySelector(".button_filter") as HTMLElement;
  const closeButtons = document.querySelectorAll(".menu-groups .close button");
  const overlayGroups = document.querySelector(".overlay") as HTMLElement;

  const openMenuGroups = () => {
    menuGroups?.classList.add("active");
    overlayGroups?.classList.add("active");
  };

  const closeMenuGroups = () => {
    menuGroups?.classList.remove("active");
    overlayGroups?.classList.remove("active");
  };

  filterButton?.addEventListener("click", openMenuGroups);

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeMenuGroups);
  });

  overlayGroups?.addEventListener("click", (e) => {
    if (e.target === overlayGroups) {
      closeMenuGroups();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuGroups?.classList.contains("active")) {
      closeMenuGroups();
    }
  });

  return { openMenuGroups, closeMenuGroups };
};
