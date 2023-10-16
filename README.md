# NA Website

## Designed for the Greater Danbury Area

### Created using [Sveltkit](https://kit.svelte.dev/docs/introduction) and [Prisma](https://www.prisma.io/docs)

To start an instance of the website:

- Initialize a postgres database
- Add connection string added to the .env file
- Initialize the schema using `npx prisma db push`

To begin using the admin features you will need to first create an admin login

For now the method of doing this is uncommenting the register form on `src/routes/login` so the password encryption is applied

`npx prisma studio` can be used to get a GUI of the database contents
