import * as inquirer from "inquirer";

const createContent = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Title",
      },
      {
        name: "author",
        type: "input",
        default: "Prakash Raman",
        message: "Author",
      },
    ])
    .then((answers) => {
      console.log({ answers });
    });
};

export { createContent };
