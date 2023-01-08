function isNameOk(name: string): boolean {
    name = name.trim();
    const names = name.split(' ');
    if (names.length < 2) return false;
    if (names.filter((i) => i.length > 0).filter((i) => i.length < 3).length > 0) return false;
    return true;
}

function isPhoneOk(phone: string): boolean {
    phone = phone.trim();
    if (phone.length < 10) return false;
    if (isNaN(Number(phone.slice(1)))) return false;
    if (phone.slice(0, 1) !== '+') return false;
    return true;
}

function isAddressOk(address: string): boolean {
    address = address.trim();
    const adressArr = address.split(' ');
    if (adressArr.length < 3) return false;
    if (adressArr.filter((i) => i.length > 0).filter((i) => i.length < 5).length > 0) return false;
    return true;
}

function isEmailOk(email: string): boolean {
    email = email.trim();
    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    if (!EMAIL_REGEXP.test(email)) return false;
    return true;
}

export function openModal() {
    const modalContent = `
      <div class="modal-header">
          <h3>Personal Details</h3>
      </div>
      <div class="modal-body">
          <form class="modal-form">
              <input class="modal-input modal-name" type="text" placeholder="Firstname Lastname" size="50" required value="123 123">
              <input class="modal-input modal-tel" type="tel" placeholder="Phone Number" size="50" minlength="10" pattern="^\\+?\\d*$" required value="+123123123">
              <input class="modal-input modal-address" type="text" placeholder="Delivery Address" size="50" required value="11233 12345 12345">
              <input class="modal-input modal-email" type="email" placeholder="EMail" size="50" required value="1@1">
              <input class="confirm-button" type="submit" value="Confirm">
          </form>
      </div>
      <div class="modal-footer">
          <h3>Thanks for shopping!</h3>
      </div>
    `;

    const modal = document.querySelector('.modal') as HTMLElement;
    const element: HTMLElement = document.createElement('div');
    element.classList.add('modal-content');
    element.innerHTML = modalContent;
    modal.append(element);
    modal.style.display = 'block';

    document.querySelector('.modal-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!isNameOk((document.querySelector('.modal-name') as HTMLInputElement).value)) {
            (document.querySelector('.modal-name') as HTMLInputElement).style.backgroundColor = '#ee7777';
        } else {
            (document.querySelector('.modal-name') as HTMLInputElement).style.backgroundColor = '#ffffff';
        }
        if (!isPhoneOk((document.querySelector('.modal-tel') as HTMLInputElement).value)) {
            (document.querySelector('.modal-tel') as HTMLInputElement).style.backgroundColor = '#ee7777';
        } else {
            (document.querySelector('.modal-tel') as HTMLInputElement).style.backgroundColor = '#ffffff';
        }
        if (!isAddressOk((document.querySelector('.modal-address') as HTMLInputElement).value)) {
            (document.querySelector('.modal-address') as HTMLInputElement).style.backgroundColor = '#ee7777';
        } else {
            (document.querySelector('.modal-address') as HTMLInputElement).style.backgroundColor = '#ffffff';
        }
        if (!isEmailOk((document.querySelector('.modal-email') as HTMLInputElement).value)) {
          (document.querySelector('.modal-email') as HTMLInputElement).style.backgroundColor = '#ee7777';
      } else {
          (document.querySelector('.modal-email') as HTMLInputElement).style.backgroundColor = '#ffffff';
      }
  });
}

export function closeModal() {
    const modal = document.querySelector('.modal') as HTMLDivElement;
    modal.innerHTML = '';
    modal.style.display = 'none';
}
