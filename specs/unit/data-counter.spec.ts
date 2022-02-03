import DataCounter from "../../src/components/data-counter"

describe('DataCounter component', () => {

    test('show the default message', () => {
        const sentence = DataCounter();

        // expecting the default message
        expect(sentence).toMatch('Não há usuários cadastrados no sistema')

    })

    test('show the message with 1 item', () => {
        const sentence = DataCounter(1);

        // expecting the message with 1 item
        expect(sentence).toMatch('Foi encontrado 1 usuário')
    })

    test('show the message with 2 or more item', () => {
        const itemLength = 40;
        const sentence = DataCounter(itemLength);

        // expecting the message with 2 or more item
        expect(sentence).toMatch(`Foram encontrados ${itemLength} usuários`)
    })

})