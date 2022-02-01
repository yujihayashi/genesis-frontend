export function formatPhoneNumber(str: string) {
    var cleaned = ('' + str).replace(/\D/g, ''); // remove all spaces
    var match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return "";
}

export function formatCPF(str: string) {
    var cleaned = ('' + str).replace(/\D/g, ''); // remove all spaces
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
        return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return "";
}