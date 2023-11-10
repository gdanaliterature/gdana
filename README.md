# NA Website

## Designed for the Greater Danbury Area

### Created using [Sveltkit](https://kit.svelte.dev/docs/introduction) and [Prisma](https://www.prisma.io/docs)

## Prerequisites

- Docker
- NodeJS

To start an instance of the website:

- Set your database username and password in the docker-compose.yml
- Create the .env file( see the .env.example)
- Set the database host as `db`( this allows the docker website to connect to the database )
- Start the website and database using docker compose up
- Change the host in the connection string to `localhost`( so your machine can connect to the database)
- Initialize the schema using `npx prisma db push`
- Uncomment the register form in `src/routes/login`
- run `npm run dev` to run the website locally
- Go to `localhost:5173` in your browser and register an admin account
- At this point we are done with the local website
- You can now login on `localhost`(:80) use the manage and inventory pages to add meetings, literature, and adjust the inventory as needed

Note: `npx prisma studio` can be used to get a GUI of the database contents, but the host in the .env must be `localhost`
