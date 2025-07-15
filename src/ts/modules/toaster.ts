export class Toaster {
  private container: HTMLElement;

  constructor() {
    let el = document.getElementById("toaster-container");
    if (!el) {
      el = document.createElement("div");
      el.id = "toaster-container";
      document.body.appendChild(el);
    }
    this.container = el;
  }

  show(message: string, type: "success" | "error" = "success") {
    const toast = document.createElement("div");
    toast.className = "toaster toaster-" + type;
    toast.textContent = message;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(30px)";
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
}
