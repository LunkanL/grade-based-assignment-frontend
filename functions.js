export function $(selector, element) {
  return element
    ? element.querySelector(selector)
    : document.querySelector(selector);
}
