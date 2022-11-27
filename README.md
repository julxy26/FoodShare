# FoodShare

### What is FoodShare?

The concept of this application is a mobile first platform where users are able to post their leftover, homecooked meals to prevent food from being wasted. Every user has the option to post and/or buy a meal. Up to four images can be uploaded when creating or editing a post and the posts can be filtered based on the users preferences.

Click here to see the <a href="https://foodshare.fly.dev/">deployed version</a>.
For the optimal experience, please set the window to a mobile screen size.

### Ideas & Planning

![Inspirations](public/inspo.png)
![Moodboard](public/moodboard.png)

### Layout & Designing

![Layout in grey scale](public/layout-grey.png)
![Layout in color](public/layout-color.png)

### Figma Prototype

![User flow prototype](public/user-flow.png)

### Database Schema

![DrawSQL database schema](public/database-schema.png)

### Setup instructions

<ol>
<li>Clone the repository with git clone <repo></li>
<li>Setup the database by downloading and installing PostgreSQL</li>
<li>Create a user and a database</li>
<li>Create a new file .env</li>
<li>Copy the environment variables from .env-example into .env</li>
<li>Replace the placeholders xxxxx with your username, password and name of database</li>
<li>Sign up to cloudinary and paste the account name in the .env and next.config.js file</li>
<li>Install dotenv-cli with `yarn add dotenv-cli`</li>
<li>Run `yarn install` in your command line</li>
<li>Run the migrations with `yarn migrate up`</li>
<li>Start the server by running `yarn dev`</li>

<li>Open <a href="http://localhost:3000">localhost</a> with your browser to see the result</li>
</ol>

### Deploy on Fly.io

<ol>
<li>Generate a Fly.io Token, called GitHub Actions Deploy Token and copy the token</li>
<li>Create a new repository secret in the GitHub repo, named FLY_API_TOKEN</li>
<li>Log into Fly.io on the command line with `flyctl auth login`</li>
<li>Create an app flyctl apps create --name <app name>
</li>
<li>Create the Fly.io config files</li>
<li>Add database credentials using Fly.io secrets flyctl secrets set PGHOST=localhost PGDATABASE=$(openssl rand -hex 16) PGUSERNAME=upleveled$(openssl rand -hex 16) PGPASSWORD=$(openssl rand -base64 32)</li>
<li>Add built time environment variables to the config files (fly.toml, Dockerfile) as described on <a href="https://fly.io/docs/languages-and-frameworks/nextjs/#what-about-build-time-environment-variables">Fly.io</a></li>
<li>Create a 1GB volume for the PostgreSQL database in Frankfurt flyctl volumes create postgres --size 1 --region fra</li>
<li>Run `flyctl deploy`in your command line to deploy</li>
</ol>
