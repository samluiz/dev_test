import 'reflect-metadata';
import express from 'express';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Post } from './entity/Post';

const app = express();
app.use(express.json());

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "test_db",
  entities: [User,Post],
  synchronize: true,
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initializeDatabase = async () => {
  await wait(20000);
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (err) {
    console.error("Error during Data Source initialization:", err);
    process.exit(1);
  }
};

initializeDatabase();

app.post('/users', async (req, res) => {
  let savedUser = await AppDataSource.getRepository(User).findOne({ where: { email: req.body.email } });

  if (savedUser) {
    res.sendStatus(409);
    res.json({ message: "User already exists" });
    return;
  }

  savedUser = await AppDataSource.getRepository(User).save(req.body);
  res.json(savedUser);
  res.sendStatus(201);
});

app.post('/posts', async (req, res) => {
  if (!req.body.userId) {
    res.json({ message: "userId is required" });
    res.sendStatus(400);
    return;
  }

  if (!req.body.title || !req.body.description) {
    res.json({ message: "title and description are required" });
    res.sendStatus(400);
    return;
  }

  let user: User | null = await AppDataSource.getRepository(User).findOne(req.body.userId);

  if (!user) {
    res.json({ message: `User with id ${req.body.userId} not found` });
    res.sendStatus(404);
    return;
  }

  let post: Post = {
    id: null,
    title: req.body.title,
    description: req.body.description,
    user: user
  }

  post = await AppDataSource.getRepository(Post).save(post);

  res.json(post);
  res.sendStatus(201);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
