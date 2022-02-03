import { FieldInterface, UserInterface } from "../config/types";


export function validate(obj: UserInterface, fieldsConfig: FieldInterface[]) {
    let validatedObj: { [key: string]: string } = {}
    fieldsConfig.forEach((f) => {
        const key = f.variable;
        const value = obj[key as keyof UserInterface];

        if (!value && f.required) validatedObj[key] = "Este campo é obrigatório";
        else {
            if (key === 'name' && validateFullname(value)) validatedObj[key] = validateFullname(value)
            if (key === 'cpf' && validateCPF(value)) validatedObj[key] = validateCPF(value)
            if (key === 'phone' && validatePhone(value)) validatedObj[key] = validatePhone(value)
            if (key === 'email' && validateEmail(value)) validatedObj[key] = validateEmail(value)
        }
    })
    return validatedObj;
}

// validate the cpf value for the brazilian document
export function validateCPF(strCPF: string) {
    const msg = "CPF inválido";
    const numbers = strCPF.split('');
    if (strCPF.length < 11) return "CPF deve ter 11 dígitos";
    if (strCPF.length > 11) return "CPF não deve ter mais de 11 dígitos";
    if (numbers.filter(i => i === numbers[0]).length === 11) {
        return msg;
    }

    let Soma;
    let Resto;
    Soma = 0;

    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(9, 10))) return msg;

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) Resto = 0;
    if (Resto !== parseInt(strCPF.substring(10, 11))) return msg;

        return "";
}

// validate the phone number for brazilian formats (mobile and landline)
export function validatePhone(value: string) {
    var re = /(.)\1{8}/g;
    var ddd = value.substring(0, 2);
    var firstPhoneNumber = value.substring(2, 3);
    var expectedLength = firstPhoneNumber === '9' ? 11 : 10;
    const validDDD = [
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "24", "27", "28", "31", "32", "33", "34", "35", "37", "38", "41", "42", "43", "44", "45", "46", "47", "48", "49", "51", "53", "54", "55", "61", "62", "63", "64", "65", "66", "67", "68", "69", "71", "73", "74", "75", "77", "79", "81", "82", "83", "84", "85", "86", "87", "88", "89", "91", "92", "93", "94", "95", "96", "97", "98", "99"];

    if (value.length < expectedLength) {
        return `Telefone deve ter no mínimo ${expectedLength} digitos`
    } else if (!validDDD.includes(ddd)) {
        return "DDD inválido!";
    } else if (
        value.match(re) ||
        (value.length === 11 && parseInt(firstPhoneNumber) !== 9)
    ) {
        return "Telefone inválido!";
    }
    return "";
}

export function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) return "E-mail inválido";
    
    return "";
}

function validateFullname(value: string) {
    // split value into words
    const words = value.split(" ");
    if (
        value.indexOf(" ") < 1 ||
        value.indexOf(" ") >= value.length - 1 ||
        !words[1]
    ) {
        return "É necessário informar o nome completo";
    } else if (!!value && words[0] && words[0].length < 3) {
        return "Primeiro nome deve ter mais de 3 caracteres!";
    } else if (
        !!value &&
        value.match(
            /[^a-zA-Z ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ]+/g
        )
    ) {
        return "Nome não pode conter caracteres especiais e numeros!"
    }
    return "";
}