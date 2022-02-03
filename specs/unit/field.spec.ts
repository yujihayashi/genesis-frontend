import Field from "../../src/components/field"

let defaultProps = { type: "text", variable: "fullname", placeholder: "Your name", required: false }

describe('Field component', () => {

    // load with the default props
    it('its loaded with default props', () => {
        const element = Field(defaultProps);
        const input = element.querySelector('input')
        
        expect(element.classList).toContain('field__group')
        expect(input.getAttribute('name')).toContain('fullname')
        expect(input.getAttribute('placeholder')).toContain('Your name')
        expect(input.getAttribute('required')).toBeFalsy()
    })

    // load with the default props
    it('its loaded with the second data variation', () => {
        defaultProps.type = "email";
        defaultProps.required = true;
    
        const element = Field(defaultProps);
        const input = element.querySelector('input')

        expect(input.getAttribute('type')).toMatch('email')
        expect(input.getAttribute('required')).toBeTruthy()
    })
})