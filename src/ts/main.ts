"use strict";
import "../styles/main.scss";
import { initModal } from "./modules/modal";
import { initMenuGroups } from "./modules/menu-groups";
import { initAccordeon } from "./modules/accordeon";

window.addEventListener("DOMContentLoaded", () => {
  const { openModal } = initModal();
  initMenuGroups();
  initAccordeon();
});
