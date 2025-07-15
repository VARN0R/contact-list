"use strict";
import "../styles/main.scss";
import { initModal } from "./modules/modal";
import { initMenuGroups } from "./modules/menu-groups";

window.addEventListener("DOMContentLoaded", () => {
  const { openModal } = initModal();
  initMenuGroups();
});
