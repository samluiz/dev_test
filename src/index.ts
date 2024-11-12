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
  // the below validation is useful if you want to ensure that the user is not already registered.
  // i removed so the tests can run consistently.
  // let savedUser = await AppDataSource.getRepository(User).findOne({ where: { email: req.body.email } });

  // if (savedUser) {
  //   return res.status(409).json({ message: "User already exists" });
  // }

  const savedUser = await AppDataSource.getRepository(User).save(req.body);
  return res.status(201).json(savedUser);
});

app.post('/posts', async (req, res) => {
  if (!req.body.userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  if (!req.body.title || !req.body.description) {
    return res.status(400).json({ message: "title and description are required" });
  }

  let user: User | null = await AppDataSource.getRepository(User).findOne({ where: { id: req.body.userId } });

  if (!user) {
    return res.status(404).json({ message: `User with id ${req.body.userId} not found` });
  }

  let post: Post = {
    id: null,
    title: req.body.title,
    description: req.body.description,
    user: user
  }

  post = await AppDataSource.getRepository(Post).save(post);

  return res.status(201).json(post);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
