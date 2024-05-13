import { Container } from "inversify";
import { UserService } from "./services/User.Service";
import { userController } from "./controllers/User.Controller";
import { authorController } from "./controllers/Author.Controller";
import { authorService } from "./services/Author.Service";
import { categoryController } from "./controllers/Category.Controller";
import { categoryService } from "./services/Category.Service";
import { bookService } from "./services/Book.Service";
import { bookController } from "./controllers/Book.Controller";

import { TYPES } from "./types/types";



const container = new Container();
//     container.bind<userController>("userController").to(userController)
// // container.bind<userController>("userController").toSelf();
// container.bind<UserService>("UserService").to(UserService)

// container.bind<authorController>("authorController").to(authorController)
// container.bind<authorService>("authorService").to(authorService)

// container.bind<categoryController>("categoryController").to(categoryController);
// container.bind<categoryService>("categoryService").to(categoryService);

// container.bind<bookController>("bookController").to(bookController)
// container.bind<bookService>("bookService").to(bookService)


container.bind<userController>(TYPES.UserController).to(userController);
container.bind<UserService>(TYPES.UserService).to(UserService);

container.bind<authorController>(TYPES.AuthorController).to(authorController);
container.bind<authorService>(TYPES.AuthorService).to(authorService);

container.bind<categoryController>(TYPES.CategoryController).to(categoryController);
container.bind<categoryService>(TYPES.CategoryService).to(categoryService);

container.bind<bookController>(TYPES.BookController).to(bookController);
container.bind<bookService>(TYPES.BookService).to(bookService);


export { container };