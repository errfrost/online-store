import { Promocodes } from '../types/interface';
export async function loadPromocodes() {
    const res = await fetch(`data/promocodes.json`);
    const data = await res.json();
    return data.promocodes;
}

export async function checkPromocode(promocode: string) {
    let isCorrect = false;
    const promocodesList: Promocodes[] = await loadPromocodes();
    promocodesList.forEach(function (el) {
        if (el.code === promocode) {
            isCorrect = true;
        }
    });
    return isCorrect;
}
export async function getPromocode(promocode: string, list: Promocodes[]) {
    const promocodesList: Promocodes[] = await loadPromocodes();
    if (await checkPromocode(promocode)) {
        let result = null;
        promocodesList.forEach(function (el) {
            if (el.code === promocode) {
                result = el;
            }
        });
        list.forEach(function (el) {
            if (el.code === promocode) {
                result = null;
            }
        });
        return result;
    }
}
