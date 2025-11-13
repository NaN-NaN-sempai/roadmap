const age = calculateAge('2001-05-18');

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birth.getDate()))
        age--;

    return age;
}

import domain from "$lib/domain";


export default {
    age,

    site: domain,

    link: (text, href, target="_blank", attributes="") => {
        return `<a href="${href}" target="${target}" ${attributes}>${text}</a>`
    }
};