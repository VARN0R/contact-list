"use strict";
import "../styles/main.scss";
import { initModal } from "./modules/modal";
import { initMenuGroups } from "./modules/menu-groups";
import { initAccordeon } from "./modules/accordeon";
import { ContactManager } from "./modules/contact-manager";
import { initMenuAddContact } from "./modules/menu-add-contact";

window.addEventListener("DOMContentLoaded", () => {
  const { openModal } = initModal();
  initMenuGroups();
  initAccordeon();
  initMenuAddContact();
  new ContactManager();
});
