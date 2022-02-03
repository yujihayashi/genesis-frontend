import puppeteer from "puppeteer"

// jest.useFakeTimers();
// jest.spyOn(global, 'setTimeout');
// jest.setTimeout(30000);

describe('Homepage', () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('http://localhost:8080');
    });

    const fillTheForm = async () => {
        // fill the form
        await expect(page).toFillForm('form[id="user-input"]', {
            name: 'John Duo',
            cpf: '63225952028',
            phone: '48999898989',
            email: 'john.duo@email.com',
        })
        await page.screenshot({ path: `screenshot-05.png` })

        // click the button to create a user
        await expect(page).toClick('button', { text: 'Cadastrar' });
    }

    it('should contain "Genesis" in the title', async () => {
        await expect(page.title()).resolves.toContain('Genesis');
        await page.screenshot({ path: `screenshot-01.png` })
    });

    it('should be able to open the modal to create a user', async () => {
        // expect to be a button to create a user
        await expect(page).toMatch('Criar usuário')

        // click the button to open the modal
        await expect(page).toClick('button', { text: 'Criar usuário' });

        await page.waitForSelector('.modal', { visible: true });

        await page.screenshot({ path: `screenshot-02.png` })
    });

    it('show error for required fields', async () => {
        await expect(page).toClick('button', { text: 'Cadastrar' })

        // expect to find at least one error
        await expect(page).toMatch('Este campo é obrigatório')

        await page.screenshot({ path: `screenshot-03.png` })
    })

    it('show custom error for the name field', async () => {
        // fill the name field with one word
        await expect(page).toFillForm('form[id="user-input"]', {
            name: 'John',
        })

        await expect(page).toClick('button', { text: 'Cadastrar' })

        // expect to find a custom error for NAME
        await expect(page).toMatch('É necessário informar o nome completo')

    })

    it('show custom error for the cpf field', async () => {
        // fill the name field with one word
        await expect(page).toFillForm('form[id="user-input"]', {
            cpf: '22222222222',
        })

        await expect(page).toClick('button', { text: 'Cadastrar' })

        // expect to find a custom error for CPF
        await expect(page).toMatch('CPF inválido')

    })

    it('show custom error for the phone field', async () => {
        // fill the name field with one word
        await expect(page).toFillForm('form[id="user-input"]', {
            phone: '00000',
        })

        await expect(page).toClick('button', { text: 'Cadastrar' })

        // expect to find a custom error for PHONE
        await expect(page).toMatch('Telefone deve ter no mínimo 10 digitos')

    })

    it('show custom error for the email field', async () => {
        // fill the name field with one word
        await expect(page).toFillForm('form[id="user-input"]', {
            email: 'john',
        })

        await expect(page).toClick('button', { text: 'Cadastrar' })

        // expect to find a custom error for EMAIL
        await expect(page).toMatch('E-mail inválido')

        await page.screenshot({ path: `screenshot-04.png` })
    })

    it('should be able to create a user', async () => {
        await fillTheForm()
        
        await page.waitForSelector('.modal', { visible: false });

        // wait for the modal to close
        await page.waitForTimeout(3000);

        // find the new user by cpf collumn
        await expect(page).toMatch('632.259.520-28')

        await page.screenshot({ path: `screenshot-06.png` })
    });

    it('should not be able to create a user with the same cpf value', async () => {
        // click the button to open the modal again
        await expect(page).toClick('button', { text: 'Criar usuário' });

        // fill the form with the same values as filled before
        await fillTheForm()

        // expect to find a custom error displaying that has a user with that CPF value already
        await expect(page).toMatch('CPF já cadastrado')

        await page.screenshot({ path: `screenshot-07.png` })

        // close the modal
        const linkHandlers = await page.$x("//button[text()='x']");
        await linkHandlers[0].click();
        await page.waitForSelector('.modal', { visible: false });

    })

    it('should be able to delete a user', async () => {
        const linkHandlers = await page.$x("//button[contains(text(), 'Excluir')]");
        if (linkHandlers.length === 4) {
            await linkHandlers[3].click();
            await page.screenshot({ path: `screenshot-08.png` })
        }
    });
});