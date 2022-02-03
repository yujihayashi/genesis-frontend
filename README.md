# Apresentação


## Typescript
O projeto utiliza o [TypeScript](https://www.typescriptlang.org/) pensando no crescimento, na manutenção e na agilidade do mesmo para desenvolver e validar sem precisar rodar.

## Cypress

## JEST

# Instalação e rodando o projeto

Primeiramente, utilizando o terminal, instale as dependências:

```bash
yarn install
# ou
npm install
```

Para rodar o projeto localmente, utilize:

```bash
yarn start
# ou
npm run start
```

Se estiver tudo certo, abra seu navegador e acesse [http://localhost:8080](http://localhost:8080) para visualizar o projeto.

# Testing
## Unit tests
```bash
yarn test:unit
#or
npm run test:unit
```

## End-to-end test
```bash
yarn test:e2e
#or
npm run test:e2e
```

If you have some troubleshooting testing the command test:e2e in Windows + WLS2, try to read this article: [https://chaosandpenguins.com/blog/2021/01/15/troubleshooting-puppeteer-in-wsl2/](https://chaosandpenguins.com/blog/2021/01/15/troubleshooting-puppeteer-in-wsl2/)