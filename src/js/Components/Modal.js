export default class Modal {
  constructor(classes) {
    this.classes = classes;
    this.modal = '';
    this.modalContent = '';
    this.modalCloseBtn = '';
    this.backrop = '';
  }

  genereateModal(content) {
    this.backrop = this.createDomNode(this.backrop, 'div', 'backdrop');
    this.modal = this.createDomNode(this.modal, 'div', 'modal');
    this.modalContent = this.createDomNode(
      this.modalContent,
      'div',
      'modal__content'
    );

    this.setContent(content);
    this.appendModalElements();
    this.handleOpen();
  }
  createDomNode(node, element, ...classes) {
    node = document.createElement(element);
    node.classList.add(...classes);
    return node;
  }

  setContent(content) {
    typeof content === 'string'
      ? (this.modalContent.innerHTML = content)
      : ((this.modalContent.innerHTML = ''),
        this.modalContent.appendChild(content));
  }

  handleKeyPress(e) {
    e.code !== 'Escape' ? undefined : this.handleClose();
  }
  handleBackdropClick(e) {
    e.target !== e.currentTarget ? undefined : this.handleClose();
  }

  handleClose() {
    this.backrop.remove();
    window.removeEventListener('keydown', this.handleKeyPress.bind(this));

    this.backrop.removeEventListener(
      'click',
      this.handleBackdropClick.bind(this)
    );
  }

  handleOpen() {
    document.body.append(this.backrop);
    window.addEventListener('keydown', this.handleKeyPress.bind(this));

    this.backrop.addEventListener('click', this.handleBackdropClick.bind(this));
  }

  appendModalElements() {
    this.modal.append(this.modalCloseBtn);
    this.modal.append(this.modalContent);
    this.backrop.append(this.modal);
  }
}
