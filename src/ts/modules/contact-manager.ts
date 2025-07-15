import { Contact, Group } from "../../types/types";
import { StorageService } from "./storage-service";
import { Toaster } from "./toaster";
import IMask from "imask";

export class ContactManager {
  private storage: StorageService;
  private toaster: Toaster;
  private phoneMask: ReturnType<typeof IMask> | null = null;
  private editingContactId: string | null = null;
  private deleteGroupId: string | null = null;

  constructor() {
    this.storage = new StorageService();
    this.toaster = new Toaster();
    this.initPhoneMask();
    this.renderGroups();
    this.renderContacts();
    this.initAddContactForm();
    this.initGroupEvents();
    this.initEditContact();
    this.initDeleteGroupModal();
    this.initContactDelete();
    this.updateGroupSelect();
    this.initAccordion();
  }

  private initPhoneMask() {
    const phoneInput = document.querySelector(
      '.menu-add-contact__input[placeholder="Введите номер"]'
    ) as HTMLInputElement;
    if (phoneInput) {
      this.phoneMask = IMask(phoneInput, {
        mask: "+{7} (000) 000-00-00",
      });
    }
  }

  private renderGroups() {
    // Рендерим группы в .menu-groups__wrapper и в select/dropdown для контакта
    const groups = this.storage.getGroups();
    // 1. В меню групп
    const wrapper = document.querySelector(".menu-groups__wrapper");
    if (wrapper) {
      // Оставляем только кнопки
      const btns = wrapper.querySelector(".menu-groups__buttons");
      wrapper.innerHTML = "";
      groups.forEach((group) => {
        const div = document.createElement("div");
        div.className = "menu-groups__item";
        div.innerHTML = `
          <input value="${group.name}" class="menu-groups__name" data-id="${group.id}" />
          <button class="btn-delete" data-id="${group.id}">
            <svg
              width="16"
              height="20"
              viewBox="0 0 16 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.3"
                d="M1.66667 17.3889C1.66667 18.55 2.61667 19.5 3.77778 19.5H12.2222C13.3833 19.5 14.3333 18.55 14.3333 17.3889V4.72222H1.66667V17.3889ZM4.26333 9.87333L5.75167 8.385L8 10.6228L10.2378 8.385L11.7261 9.87333L9.48833 12.1111L11.7261 14.3489L10.2378 15.8372L8 13.5994L5.76222 15.8372L4.27389 14.3489L6.51167 12.1111L4.26333 9.87333ZM11.6944 1.55556L10.6389 0.5H5.36111L4.30556 1.55556H0.611111V3.66667H15.3889V1.55556H11.6944Z"
                fill="black"
              />
            </svg>
          </button>
        `;
        wrapper.appendChild(div);
      });
      if (btns) wrapper.appendChild(btns);
    }
    // 2. В select/dropdown для контакта
    const select = document.querySelector(
      ".menu-add-contact__select"
    ) as HTMLSelectElement;
    if (select) {
      select.innerHTML =
        '<option value="">Выберите группу</option>' +
        groups
          .map((g) => `<option value="${g.id}">${g.name}</option>`)
          .join("");
    }
  }

  private renderContacts() {
    const contacts = this.storage.getContacts();
    const groups = this.storage.getGroups();
    const wrapper = document.querySelector(
      ".content__wrapper"
    ) as HTMLElement | null;
    if (!wrapper) return;
    wrapper.innerHTML = "";

    const placeholder = document.querySelector(
      ".content__placeholder"
    ) as HTMLElement | null;
    if (groups.length === 0) {
      if (placeholder) placeholder.style.display = "block";
      document.querySelector(".content")?.classList.add("active");
      wrapper.style.display = "none";
      return;
    }
    if (placeholder) placeholder.style.display = "none";
    document.querySelector(".content")?.classList.remove("active");
    wrapper.style.display = "block";

    groups.forEach((group) => {
      const groupContacts = contacts.filter((c) => c.group === group.id);
      const item = document.createElement("div");
      item.className = "content__item";
      item.innerHTML = `
        <button class="content__header">
          ${group.name}
          <span class="content__icon">
            <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.8849 0.294998L6.29492 4.875L1.70492 0.294998L0.294922 1.705L6.29492 7.705L12.2949 1.705L10.8849 0.294998Z" fill="black"/>
            </svg>
          </span>
        </button>
        <div class="content__content">
          ${
            groupContacts.length === 0
              ? '<div class="content__row"><span>Нет контактов</span></div>'
              : groupContacts
                  .map(
                    (contact) => `
              <div class="content__row">
                <span>${contact.name}</span>
                <div class="content__buttons">
                  <span>${contact.phone}</span>
                  <button class="btn-edit" data-id="${contact.id}">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.3" d="M0 14.25V18H3.75L14.81 6.94L11.06 3.19L0 14.25ZM17.71 4.04C18.1 3.65 18.1 3.02 17.71 2.63L15.37 0.289998C14.98 -0.100002 14.35 -0.100002 13.96 0.289998L12.13 2.12L15.88 5.87L17.71 4.04V4.04Z" fill="black"/></svg>
                  </button>
                  <button class="btn-delete" data-id="${contact.id}">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.3" d="M1.66667 17.3889C1.66667 18.55 2.61667 19.5 3.77778 19.5H12.2222C13.3833 19.5 14.3333 18.55 14.3333 17.3889V4.72222H1.66667V17.3889ZM4.26333 9.87333L5.75167 8.385L8 10.6228L10.2378 8.385L11.7261 9.87333L9.48833 12.1111L11.7261 14.3489L10.2378 15.8372L8 13.5994L5.76222 15.8372L4.27389 14.3489L6.51167 12.1111L4.26333 9.87333ZM11.6944 1.55556L10.6389 0.5H5.36111L4.30556 1.55556H0.611111V3.66667H15.3889V1.55556H11.6944Z" fill="black"/></svg>
                  </button>
                </div>
              </div>
            `
                  )
                  .join("")
          }
        </div>
      `;
      wrapper.appendChild(item);
    });
  }

  private updateGroupSelect() {
    this.renderGroups();
  }

  private initAddContactForm() {
    const form = document.querySelector(".menu-add-contact__wrapper");
    if (!form) return;
    const nameInput = form.querySelector(
      '.menu-add-contact__input[placeholder="Введите ФИО"]'
    ) as HTMLInputElement;
    const phoneInput = form.querySelector(
      '.menu-add-contact__input[placeholder="Введите номер"]'
    ) as HTMLInputElement;
    const saveBtn = form.querySelector(".button_blue-bg") as HTMLButtonElement;
    saveBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const group = (window as any).getSelectedGroupId
        ? (window as any).getSelectedGroupId()
        : "";
      if (!name || !phone || !group) {
        this.showError("Заполните все поля");
        return;
      }
      if (this.editingContactId) {
        // изменение контакта
        const contact: Contact = {
          id: this.editingContactId,
          name,
          phone,
          group,
        };
        const ok = this.storage.updateContact(contact);
        if (!ok) {
          this.showError("Контакт с таким номером уже существует");
        } else {
          this.showSuccess("Контакт обновлен");
          this.editingContactId = null;
          (form.closest(".menu-add-contact") as HTMLElement)?.classList.remove(
            "active"
          );
          const overlay = document.querySelector(".overlay") as HTMLElement;
          overlay?.classList.remove("active");
          this.renderContacts();
        }
      } else {
        // добавление контакта
        const contact: Contact = {
          id: Date.now().toString(),
          name,
          phone,
          group,
        };
        const ok = this.storage.addContact(contact);
        if (!ok) {
          this.showError("Контакт с таким номером уже существует");
        } else {
          this.showSuccess("Контакт добавлен");
          (form.closest(".menu-add-contact") as HTMLElement)?.classList.remove(
            "active"
          );
          const overlay = document.querySelector(".overlay") as HTMLElement;
          overlay?.classList.remove("active");
          this.renderContacts();
        }
      }
      nameInput.value = "";
      phoneInput.value = "";
      if ((window as any).setSelectedGroupId)
        (window as any).setSelectedGroupId("", "Выберите группу");
    });
  }

  private initGroupEvents() {
    const wrapper = document.querySelector(".menu-groups__wrapper");
    if (!wrapper) return;
    // добавление группы
    const addBtn = document.querySelector(
      ".menu-groups__buttons .button_without-bg"
    );
    addBtn?.addEventListener("click", () => {
      const groups = this.storage.getGroups();
      groups.push({ id: Date.now().toString(), name: "" });
      this.storage.saveGroups(groups);
      this.renderGroups();
      this.renderContacts();
    });
    // удаление группы
    wrapper.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest(".btn-delete");
      if (btn) {
        const id = btn.getAttribute("data-id");
        if (id) {
          this.deleteGroupId = id;
          const modal = document.querySelector(".modal") as HTMLElement;
          modal?.classList.add("active");
          const overlay = document.querySelector(".overlay") as HTMLElement;
          overlay?.classList.add("active");
        }
      }
    });
    // изменение имени группы
    wrapper.addEventListener("change", (e) => {
      const input = e.target as HTMLInputElement;
      if (input.classList.contains("menu-groups__name")) {
        const id = input.getAttribute("data-id");
        if (id) {
          const ok = this.storage.updateGroup({ id, name: input.value });
          if (!ok) {
            this.showError("Группа с таким именем уже существует");
            this.renderGroups();
          } else {
            this.showSuccess("Группа обновлена");
            this.renderGroups();
          }
        }
      }
    });

    // Сохранить группы
    const saveBtn = document.querySelector(
      ".menu-groups__buttons .button_blue-bg"
    );
    // При нажатии на кнопку "Сохранить"
    saveBtn?.addEventListener("click", () => {
      const inputs = wrapper.querySelectorAll(
        ".menu-groups__name"
      ) as NodeListOf<HTMLInputElement>;

      const groups: Group[] = [];
      let hasDuplicate = false;
      const namesSet = new Set<string>();

      inputs.forEach((input) => {
        const name = input.value.trim();
        const id = input.getAttribute("data-id") || Date.now().toString();
        if (!name) return;
        if (namesSet.has(name.toLowerCase())) {
          hasDuplicate = true;
        }
        namesSet.add(name.toLowerCase());
        groups.push({ id, name });
      });

      if (hasDuplicate) {
        this.showError("Группа с таким именем уже существует");
        return;
      }

      this.storage.saveGroups(groups);
      this.renderGroups();
      this.renderContacts();
      this.showSuccess("Группы сохранены");

      // Закрываем меню
      const menu = document.querySelector(".menu-groups") as HTMLElement;
      const overlay = document.querySelector(".overlay") as HTMLElement;
      menu?.classList.remove("active");
      overlay?.classList.remove("active");
    });
  }

  private initEditContact() {
    const wrapper = document.querySelector(".content__wrapper");
    if (!wrapper) return;
    wrapper.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest(".btn-edit");
      if (btn) {
        const id = btn.getAttribute("data-id");
        if (id) {
          const contact = this.storage.getContacts().find((c) => c.id === id);
          if (contact) {
            this.editingContactId = id;
            const menu = document.querySelector(
              ".menu-add-contact"
            ) as HTMLElement;
            menu.classList.add("active");
            const overlay = document.querySelector(".overlay") as HTMLElement;
            overlay?.classList.add("active");
            const form = menu.querySelector(".menu-add-contact__wrapper");
            if (form) {
              const nameInput = form.querySelector(
                '.menu-add-contact__input[placeholder="Введите ФИО"]'
              ) as HTMLInputElement;
              const phoneInput = form.querySelector(
                '.menu-add-contact__input[placeholder="Введите номер"]'
              ) as HTMLInputElement;
              nameInput.value = contact.name;
              phoneInput.value = contact.phone;
              if ((window as any).setSelectedGroupId)
                (window as any).setSelectedGroupId(
                  contact.group,
                  this.getGroupName(contact.group)
                );
              if (this.phoneMask) this.phoneMask.value = contact.phone;
            }
          }
        }
      }
    });
  }

  private initDeleteGroupModal() {
    const modal = document.querySelector(".modal");
    if (!modal) return;
    const confirmBtn = modal.querySelector(".button_blue-bg");
    const cancelBtn = modal.querySelector(".button_without-bg");
    confirmBtn?.addEventListener("click", () => {
      if (this.deleteGroupId) {
        this.storage.deleteGroup(this.deleteGroupId);
        this.showSuccess("Группа и все контакты удалены");
        this.renderGroups();
        this.renderContacts();
        this.deleteGroupId = null;
      }
      modal.classList.remove("active");
      const overlay = document.querySelector(".overlay") as HTMLElement;
      overlay?.classList.remove("active");
    });
    cancelBtn?.addEventListener("click", () => {
      modal.classList.remove("active");
      const overlay = document.querySelector(".overlay") as HTMLElement;
      overlay?.classList.remove("active");
      this.deleteGroupId = null;
    });
  }

  private initContactDelete() {
    const wrapper = document.querySelector(".content__wrapper");
    if (!wrapper) return;
    wrapper.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest(".btn-delete");
      if (btn) {
        const id = btn.getAttribute("data-id");
        if (id) {
          this.storage.deleteContact(id);
          this.showSuccess("Контакт удален");
          this.renderContacts();
        }
      }
    });
  }

  private initAccordion() {
    // Открытие/закрытие групп (аккордеон)
    const wrapper = document.querySelector(".content__wrapper");
    if (!wrapper) return;
    wrapper.addEventListener("click", (e) => {
      const header = (e.target as HTMLElement).closest(".content__header");
      if (header) {
        const item = header.parentElement as HTMLElement;
        if (item.classList.contains("active")) {
          item.classList.remove("active");
        } else {
          // Можно сделать только одну открытую группу:
          wrapper
            .querySelectorAll(".content__item.active")
            .forEach((el) => el.classList.remove("active"));
          item.classList.add("active");
        }
      }
    });
  }

  private getGroupName(groupId: string): string {
    const group = this.storage.getGroups().find((g) => g.id === groupId);
    return group ? group.name : "Выберите группу";
  }

  showSuccess(msg: string) {
    this.toaster.show(msg, "success");
  }
  showError(msg: string) {
    this.toaster.show(msg, "error");
  }
}
