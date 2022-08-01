<p align="center">
  <a href="https://github.com/$username-github/$nome-repositorio">
    <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f399-fe0f.svg" alt="readme-logo" width="80" height="80"> <!-- src="image-link" -->
  </a>

  <h3 align="center">
    Sing me a Song
  </h3>
</p>

## Description:

This is a full-stack project that store, rate and play YouTube links. It also come with e2e, integration and unit tests.

<!-- ## Database deploy link

https://back-end-template-example.com/ -->

## Instalation:

```bash
$ git clone https://github.com/Masih-Saldanha/projeto21-singmeasong.git

$ cd projeto21-singmeasong/back-end/

$ npm install

$ cd ..

$ cd projeto21-singmeasong/front-end/

$ npm install
```

## Usage:

- On a first bash:

```bash
$ cd projeto21-singmeasong/back-end/

$ npm run dev
```

- On a second bash:

```bash
$ cd projeto21-singmeasong/front-end/

$ npm start
```

## Back-end tests:

- Integration test:

```bash
$ cd projeto21-singmeasong/back-end/

$ npm run test:integration
```

- Unit test:

```bash
$ cd projeto21-singmeasong/back-end/

$ npm run test:unit
```

- Full test:

```bash
$ cd projeto21-singmeasong/back-end/

$ npm run test
```

## Front-end tests:

- On a first bash:

```bash
$ cd projeto21-singmeasong/back-end/

$ npm run dev:test
```

- On a second bash:

```bash
$ cd projeto21-singmeasong/front-end/

$ npm start
```

- On a third bash:

```bash
$ cd projeto21-singmeasong/front-end/

$ npx cypress open
```

## API:


### localhost:5000/recommendations/

- General routes:

```
- POST /
    - Route to register a new recommendation link
    - headers: {}
    - body: {
        "name": "Some no-repeated name",
        "youtubeLink": "https://youtu.be/..."
    }
```
```
- GET /
    - Route to get a list of 10 recommendations
    - headers: {}
    - body: {}
```
```
- GET /top/:amount
    - Route to get a list of the top amount of recommendations
    - headers: {}
    - body: {}
```
```
- GET /:id
    - Route to get the recommendation with the corresponding id
    - headers: {}
    - body: {}
```
```
- POST /:id/upvote
    - Route to increase the score of the recommendation with the corresponding id by 1
    - headers: {}
    - body: {}
```
```
- POST /:id/downvote
    - Route to decrement the score of the recommendation with the corresponding id by 1
    - headers: {}
    - body: {}
```

- Dev:test routes (Only avaiable trought 'npm run dev:test'):

```
- DELETE /reset
    - Route to erase all database
    - headers: {}
    - body: {}
```
```
- POST /seed
    - Route to add 1 random recommendation to the database
    - headers: {}
    - body: {}
```
