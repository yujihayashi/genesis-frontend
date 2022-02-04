import puppeteer from "puppeteer"

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

        // click the button to create a user
        await expect(page).toClick('button', { text: 'Cadastrar' });
    }

    it('should contain "Genesis" in the title', async () => {
        await expect(page.title()).resolves.toContain('Genesis');
        page.screenshot({ path: `screenshot-01.png` })
    });

    it('should be able to open the modal to create a user', async () => {
        // expect to be a button to create a user
        expect(page).toMatch('Criar usuário')

        // click the button to open the modal
        await expect(page).toClick('button', { text: 'Criar usuário' });

        await page.waitForSelector('.modal', { visible: true });

        page.screenshot({ path: `screenshot-02.png` })
    });

    it('show error for required fields', async () => {
        await expect(page).toClick('button', { text: 'Cadastrar' })

        // expect to find at least one error
        expect(page).toMatch('Este campo é obrigatório')

        page.screenshot({ path: `screenshot-03.png` })
    })

    it('show custom error for all the email fields', async () => {
        // fill the name field with one word
        await expect(page).toFillForm('form[id="user-input"]', {
            name: 'John',
            cpf: '22222222222',
            phone: '00000',
            email: 'john',
        })

        await expect(page).toClick('button', { text: 'Cadastrar' })

        // await page.waitForTimeout(2000);
        
        // expect to find a custom error for NAME
        expect(page).toMatch('É necessário informar o nome completo')

        // expect to find a custom error for CPF
        expect(page).toMatch('CPF inválido')

        // expect to find a custom error for PHONE
        expect(page).toMatch('Telefone deve ter no mínimo 10 digitos')

        // expect to find a custom error for EMAIL
        expect(page).toMatch('E-mail inválido')

        page.screenshot({ path: `screenshot-04.png` })
    })

    it('should be able to create a user', async () => {
        await fillTheForm()

        page.screenshot({ path: `screenshot-05.png` })

        await page.waitForSelector('.modal', { visible: false });

        // wait for the modal to close
        await page.waitForTimeout(4000);

        // find the new user by cpf collumn
        expect(page).toMatch('632.259.520-28')

        page.screenshot({ path: `screenshot-06.png` })
    });

    it('should not be able to create a user with the same cpf value', async () => {
        // click the button to open the modal again
        await expect(page).toClick('button', { text: 'Criar usuário' });

        // fill the form with the same values as filled before
        await fillTheForm()

        // expect to find a custom error displaying that has a user with that CPF value already
        expect(page).toMatch('CPF já cadastrado')

        page.screenshot({ path: `screenshot-07.png` })

        // close the modal
        const linkHandlers = await page.$x("//button[text()='x']");
        await linkHandlers[0].click();
        await page.waitForSelector('.modal', { visible: false });

    })

    it('should be able to delete a user', async () => {
        const linkHandlers = await page.$x("//button[contains(text(), 'Excluir')]");
        if (linkHandlers.length === 4) {
            await linkHandlers[3].click();
            page.screenshot({ path: `screenshot-08.png` })
        }
    });
});