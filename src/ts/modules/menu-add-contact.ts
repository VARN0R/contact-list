export const initMenuAddContact = () => {
  const menuAddContact = document.querySelector(
    ".menu-add-contact"
  ) as HTMLElement;
  const addButton = document.querySelector(".button_add") as HTMLElement;
  const closeButtons = document.querySelectorAll(
    ".menu-add-contact .close button"
  );
  const overlay = document.querySelector(".overlay") as HTMLElement;

  const openMenuAddContact = () => {
    menuAddContact?.classList.add("active");
    overlay?.classList.add("active");
  };

  const closeMenuAddContact = () => {
    menuAddContact?.classList.remove("active");
    overlay?.classList.remove("active");
  };

  addButton?.addEventListener("click", openMenuAddContact);

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeMenuAddContact);
  });

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeMenuAddContact();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuAddContact?.classList.contains("active")) {
      closeMenuAddContact();
    }
  });

  // Дропдаун логика
  const contacts = [{ name: "Друзья" }, { name: "Коллеги" }];
  const dropdown = document.querySelector(".menu-add-contact__dropdown");

  if (dropdown) {
    const selected = dropdown.querySelector(
      ".menu-add-contact__dropdown-selected"
    ) as HTMLElement | null;
    const list = dropdown.querySelector(
      ".menu-add-contact__dropdown-list"
    ) as HTMLElement | null;
    const arrow = dropdown.querySelector(".menu-add-contact__dropdown-arrow");

    let isOpen = false;
    if (list) {
      list.innerHTML = contacts
        .map(
          (c) =>
            `<div class="menu-add-contact__dropdown-option">${c.name} </div>`
        )
        .join("");
    }
    if (selected && list) {
      selected.addEventListener("click", () => {
        isOpen = !isOpen;
        dropdown.classList.toggle("open", isOpen);
      });
      list.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const option = target.closest(".menu-add-contact__dropdown-option");
        if (option && selected.querySelector("span")) {
          (selected.querySelector("span") as HTMLElement).textContent =
            option.textContent;
          isOpen = false;
          dropdown.classList.remove("open");
        }
      });
      document.addEventListener("mousedown", (e) => {
        const eventTarget = e.target as Node;
        if (!dropdown.contains(eventTarget)) {
          isOpen = false;
          dropdown.classList.remove("open");
        }
      });
    }
  }
  return { openMenuAddContact, closeMenuAddContact };
};
