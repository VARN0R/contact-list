import { Contact, Group } from "../../types/types";

export class StorageService {
  private static CONTACTS_KEY = "contacts";
  private static GROUPS_KEY = "groups";

  getContacts(): Contact[] {
    return JSON.parse(
      localStorage.getItem(StorageService.CONTACTS_KEY) || "[]"
    );
  }

  getGroups(): Group[] {
    return JSON.parse(localStorage.getItem(StorageService.GROUPS_KEY) || "[]");
  }

  saveContacts(contacts: Contact[]) {
    localStorage.setItem(StorageService.CONTACTS_KEY, JSON.stringify(contacts));
  }

  saveGroups(groups: Group[]) {
    localStorage.setItem(StorageService.GROUPS_KEY, JSON.stringify(groups));
  }

  addContact(contact: Contact): boolean {
    const contacts = this.getContacts();
    if (contacts.some((c) => c.phone === contact.phone)) return false;
    contacts.push(contact);
    this.saveContacts(contacts);
    return true;
  }

  updateContact(updated: Contact): boolean {
    const contacts = this.getContacts();
    const idx = contacts.findIndex((c) => c.id === updated.id);
    if (idx === -1) return false;

    if (contacts.some((c) => c.phone === updated.phone && c.id !== updated.id))
      return false;
    contacts[idx] = updated;
    this.saveContacts(contacts);
    return true;
  }

  deleteContact(id: string) {
    const contacts = this.getContacts().filter((c) => c.id !== id);
    this.saveContacts(contacts);
  }

  addGroup(group: Group): boolean {
    const groups = this.getGroups();
    if (groups.some((g) => g.name.toLowerCase() === group.name.toLowerCase()))
      return false;
    groups.push(group);
    this.saveGroups(groups);
    return true;
  }

  updateGroup(updated: Group): boolean {
    const groups = this.getGroups();
    const idx = groups.findIndex((g) => g.id === updated.id);
    if (idx === -1) return false;
    // проверка на дубликаты
    if (
      groups.some(
        (g) =>
          g.name.toLowerCase() === updated.name.toLowerCase() &&
          g.id !== updated.id
      )
    )
      return false;
    groups[idx] = updated;
    this.saveGroups(groups);
    return true;
  }

  deleteGroup(id: string) {
    const groups = this.getGroups().filter((g) => g.id !== id);
    this.saveGroups(groups);
    const contacts = this.getContacts().filter((c) => c.group !== id);
    this.saveContacts(contacts);
  }
}
