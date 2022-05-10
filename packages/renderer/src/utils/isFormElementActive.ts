function isFormElementActive(activeElement: HTMLElement) {
  switch (activeElement.tagName) {
    case "INPUT":
    case "TEXTAREA":
      return true;
    default:
      return false;
  }
}

export { isFormElementActive };
