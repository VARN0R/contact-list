export const initModal = () => {
  const modal = document.querySelector(".modal") as HTMLElement;
  const overlay = document.querySelector(".overlay") as HTMLElement;
  const closeButtons = document.querySelectorAll(
    ".close button, .modal__buttons .button_without-bg"
  );

  const openModal = () => {
    modal?.classList.add("active");
    overlay?.classList.add("active");
  };

  const closeModal = () => {
    modal?.classList.remove("active");
    overlay?.classList.remove("active");
  };

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("active")) {
      closeModal();
    }
  });

  return { openModal, closeModal };
};
