## Development

```bash
$ cp .env.example .env # Copy and set environment variables
$ yarn
$ yarn dev
```

## Secrets

1. Create bot and get token for telegram
2. Create project and setup account for GCP

## Demo

[![Demo](https://user-images.githubusercontent.com/729374/163004213-c88cfe6d-9114-4682-8142-ecb18e9037cd.png)](https://user-images.githubusercontent.com/729374/163003767-1540179a-580f-4017-8cd2-f2a094415bb7.mp4)

[![Demo](https://user-images.githubusercontent.com/729374/156602024-0266f853-f2ca-4175-9ff6-b3762fed1458.png)](https://user-images.githubusercontent.com/729374/156603671-aadf0f50-ae10-4949-90f3-b158c40544b8.mp4)

[![Demo](https://user-images.githubusercontent.com/729374/156756387-72493114-de82-42b1-801b-55e93e20cf95.png)](https://user-images.githubusercontent.com/729374/156756114-1be186e3-315a-48f2-be4f-7d8fac0e3849.mp4)

## Usage

1. Make your spreadsheets public or share them with special email (ask admin).
2. Open the [app](https://sheets-matcher-ui.vercel.app).
3. Enter id of spreadhseet and name of sheet for requests and proposals.
4. For advanced settings use this [url](https://sheets-matcher-ui.vercel.app/?config=true).

### Telegram notifications

1. Add @sheetsmatcher_bot to your group.
2. Use this [url](https://sheets-matcher-ui.vercel.app/?config=true&connect=true&chatid=true) for app.
3. Set your group chat id in text field (could be found at [web.telegram.org](https://web.telegram.org)).
4. Click Connect to make bot send a message to chat with contacts of people matched.

### Setup from scratch

1. Create users for github (sources, auth), vercel (deploy), gcp (sheets API), airtable (API), discord (auth), supabase (db, auth). Set up 2fa.
2. Create new app in Github, Discord. Get OAuth client id / secret.
3. Setup auth in supabase. Create db, turn on RLS, add default policies.
4. Fork this repo for your github user.
5. Connect vercel to your repo. Add env variables. Deploy.
