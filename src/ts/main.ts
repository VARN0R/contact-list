"use strict";
import "../styles/main.scss";
import { initModal } from "./modules/modal";
import { initMenuGroups } from "./modules/menu-groups";
import { initAccordeon } from "./modules/accordeon";
import { initMenuAddContact } from "./modules/menu-add-contact";

window.addEventListener("DOMContentLoaded", () => {
  const { openModal } = initModal();
  initMenuGroups();
  initAccordeon();
  initMenuAddContact();
});
