import { Container } from "inversify";
import { UserService } from "./services/User.Service";
import { userController } from "./controllers/User.Controller";
import { autherController } from "./controllers/Auther.Controller";
import { autherService } from "./services/Auther.Service";
import { categoryController } from "./controllers/Category.Controller";
import { categoryService } from "./services/Category.Service";

import { bookService } from "./services/Book.Service";
import { bookController } from "./controllers/Book.Controller";



const container = new Container();
<<<<<<< HEAD

=======
>>>>>>> a0752a0774e74b328403341a3f59f7ac3b365a7e
container.bind<userController>("userController").to(userController)
container.bind<UserService>("UserService").to(UserService)

container.bind<autherController>("autherController").to(autherController)
container.bind<autherService>("autherService").to(autherService)

container.bind<categoryController>("categoryController").to(categoryController);
container.bind<categoryService>("categoryService").to(categoryService);

container.bind<bookController>("bookController").to(bookController)
container.bind<bookService>("bookService").to(bookService)

export { container };
