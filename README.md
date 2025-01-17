Here is the README you can use for your project:

---

# Votex

## Description

This project is a voting system with a dashboard for managing groups. It includes a homepage, login/register popups, and basic models for the voting system.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/project-name.git
cd project-name
```

### 2. Install dependencies

Run the following command to install all necessary dependencies for the project:

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory of the project by copying the contents of the `.env.example` file:

```bash
cp .env.example .env
```

Then, fill in the required values for the environment variables in the `.env` file (such as database credentials, API keys, etc.).

### 4. Run the backend server

To run the server, use the following command:

```bash
node server.js
```

This will start the server on `http://localhost:5000`.

### 5. Run the web page (Next.js)

To run the web page, use the following command:

```bash
npx next dev
```

This will start the Next.js application on `http://localhost:3000`.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to modify it according to your project specifics!
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


// In dashboardModel.js
Dashboard.hasMany(Group, { foreignKey: 'dashboardId' });

// In groupModel.js
Group.belongsTo(Dashboard, { foreignKey: 'dashboardId' });
Group.hasMany(Post, { foreignKey: 'groupId' });

// In postModel.js
Post.belongsTo(Group, { foreignKey: 'groupId' });
Post.hasMany(Vote, { foreignKey: 'postId' });
Post.hasMany(Comment, { foreignKey: 'postId' });

// In voteModel.js
Vote.belongsTo(Post, { foreignKey: 'postId' });
Vote.belongsTo(User, { foreignKey: 'userId' });

// In commentModel.js
Comment.belongsTo(Post, { foreignKey: 'postId' });
Comment.belongsTo(User, { foreignKey: 'userId' });
