# TypeScript API Boilerplate

The boilerplate for creating a new API project with TypeScript.

## Usage this template
1. Go to [https://github.com/wisesight/typescript-api-template](https://github.com/wisesight/typescript-api-template)
2. Click the button **'Use this template'**
3. Name your repository **without** checking the **'Include all branches'** option
4. Click the button **'Create repository from template'**

## Installation

Use the package manager [npm](https://www.npmjs.com) to install this project.

```bash
npm install
```

## Usage
If you run locally, do not forget to prepare .env in the root of project.
* Run nodemon
```bash
npm run dev
```
* Build (result package will be stored at ./dist)
```bash
npm run build
```
* Run built package
```bash
npm start
```
* Run test
```bash
# Unit Test
npm run test:unit

# Integration Test
npm run test:integration

# All Tests
npm run test
```

## Running in container

```
docker build -t typescript-api-template:<env> --build-arg SEVER_ENV=<env> .

docker run -p <map_port>:<map_port>  typescript-api-template:<env>
```

Detail => https://drive.google.com/file/d/1wJAuMiC3M_C4AQM0ozQVKqQYApWtW__D/view
