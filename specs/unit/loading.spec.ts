import Loading from "../../src/components/loading"

describe('Loading component', () => {

    test('to be there with the default props', () => {
        const element = Loading();
        const icon = element.querySelector('i')

        // expecting the default tag on the span tag
        expect(element.classList).toContain('loading')

        // the i tag needs to be inside the span.loading tag
        expect(icon).toBeTruthy()
    })

    test('to add the loading__primary classname with the prop isPrimary', () => {
        const element = Loading(true);

        // expecting the loading__primary classname on the span tag
        expect(element.classList).toContain('loading__primary')

    })

})