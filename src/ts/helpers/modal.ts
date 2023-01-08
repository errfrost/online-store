export function openModal() {
    const modalContent = `
      <div class="modal-header">
          <h2>Modal Header</h2>
      </div>
      <div class="modal-body">
          <p>Some text in the Modal Body</p>
          <p>Some other text...</p>
      </div>
      <div class="modal-footer">
          <h3>Modal Footer</h3>
      </div>
    `;

    const modal = document.querySelector('.modal') as HTMLElement;
    const element: HTMLElement = document.createElement('div');
    element.classList.add('modal-content');
    element.innerHTML = modalContent;
    modal.append(element);
    modal.style.display = 'block';
}

export function closeModal() {
    const modal = document.querySelector('.modal') as HTMLDivElement;
    modal.innerHTML = '';
    modal.style.display = 'none';
}
