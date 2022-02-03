# Presentation
This is a simple app which you can create, list, edit and exclude users according to the project specifications, BUT I took the liberty to change some things.

- In the style guide, the document said to use the `#efeeed` color for text in the input tags without focusing and the border color. The problem was that the `#efeeed` color barely showed up on the white background. So I changed it to a darker color like `#999`.
- Instead of creating two pages, I took the liberty of using only one page listing the users and the form used for creating/editing users is inside of a modal.

## Typescript
The project has the [TypeScript](https://www.typescriptlang.org/) to making easier on coding, reading and debuging.

## JEST
[JEST](https://jestjs.io/) is a userful test framework tool for Javascript. Here we use to run unit and end-to-end tests for the project.

## PUPPETEER
[Puppeteer](https://pptr.dev/) is a Node library which simulate many things that you can do in the browser like filling all the fields of the form and submit these data or generate screenshot of the page. Here we're using to integrate with JEST and run end-to-end tests.

# Installing and running the project

First, install the modules:

```bash
yarn install
# ou
npm install
```

To run the project locally, execute:

```bash
yarn start
# ou
npm run start
```

If it's allright, open your browser and type [http://localhost:8080](http://localhost:8080) to view the project.

If you need to reset and get the initial values from the api again, just delete the USER_LIST key from the localStorage. So, after that, refresh the page.

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