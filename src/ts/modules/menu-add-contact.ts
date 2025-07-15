import { StorageService } from "./storage-service";

export const initMenuAddContact = () => {
  // Открытие/закрытие меню добавления контакта с overlay
  const addContactBtn = document.querySelector(".button_add");
  const menuAddContact = document.querySelector(".menu-add-contact");
  const closeBtn = menuAddContact?.querySelector(".close button");
  const overlay = document.querySelector(".overlay");

  function openMenuAddContact() {
    menuAddContact?.classList.add("active");
    overlay?.classList.add("active");
  }
  function closeMenuAddContact() {
    menuAddContact?.classList.remove("active");
    overlay?.classList.remove("active");
  }

  addContactBtn?.addEventListener("click", openMenuAddContact);
  closeBtn?.addEventListener("click", closeMenuAddContact);
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeMenuAddContact();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuAddContact?.classList.contains("active")) {
      closeMenuAddContact();
    }
  });

  // Кастомный dropdown для выбора группы
  const dropdown = document.querySelector(".menu-add-contact__dropdown");
  if (dropdown) {
    const selected = dropdown.querySelector(
      ".menu-add-contact__dropdown-selected"
    ) as HTMLElement | null;
    const list = dropdown.querySelector(
      ".menu-add-contact__dropdown-list"
    ) as HTMLElement | null;
    let selectedGroupId: string | null = null;
    const storage = new StorageService();
    function renderDropdownGroups() {
      const groups = storage.getGroups();
      if (list) {
        list.innerHTML = groups.length
          ? groups
              .map(
                (g) =>
                  `<div class="menu-add-contact__dropdown-option" data-id="${g.id}">${g.name}</div>`
              )
              .join("")
          : '<div class="menu-add-contact__dropdown-option" style="opacity:.5;">Нет групп</div>';
      }
    }
    renderDropdownGroups();
    // Открытие/закрытие dropdown
    selected?.addEventListener("click", () => {
      dropdown.classList.toggle("open");
    });
    // Выбор группы
    list?.addEventListener("click", (e) => {
      const option = (e.target as HTMLElement).closest(
        ".menu-add-contact__dropdown-option"
      ) as HTMLElement | null;
      if (option && option.dataset.id) {
        selectedGroupId = option.dataset.id;
        if (selected)
          selected.querySelector("span")!.textContent = option.textContent;
        dropdown.classList.remove("open");
      }
    });
    // Клик вне dropdown
    document.addEventListener("mousedown", (e) => {
      if (!dropdown.contains(e.target as Node)) {
        dropdown.classList.remove("open");
      }
    });
    // Для интеграции с формой:
    // При сохранении контакта используйте selectedGroupId как значение группы
    // (можно пробросить selectedGroupId в ContactManager через геттер или событие)
    // При открытии меню добавления контакта — сбрасывать selectedGroupId и текст
    addContactBtn?.addEventListener("click", () => {
      selectedGroupId = null;
      if (selected)
        selected.querySelector("span")!.textContent = "Выберите группу";
      renderDropdownGroups();
    });
    // Для ContactManager: window.selectedGroupId = selectedGroupId;
    (window as any).getSelectedGroupId = () => selectedGroupId;
    (window as any).setSelectedGroupId = (id: string, name: string) => {
      selectedGroupId = id;
      if (selected) selected.querySelector("span")!.textContent = name;
    };
  }
};
