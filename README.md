# wordPractice Server Utility Bot

Utility bot for the wordPractice Discord server.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install dependencies.

```bash
npm install
```

## Setup

Create a `config.json` file in the `src` folder of the repository

Including the following in your `config.json` file

```json
{
  "token": "",
  "mongodbURI": "",
  "prefix": ""
}
```

Fill in your Discord bot token, Mongodb connection URI and bot prefix

## Running

```bash
npm start
```
