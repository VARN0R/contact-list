export const initAccordeon = () => {
  const headers = document.querySelectorAll(".content__header");

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      item?.classList.toggle("active");
    });
  });
};
