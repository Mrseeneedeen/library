const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

module.exports = async function (plop) {
  const { default: autocompletePrompt } = await import(
    "inquirer-autocomplete-prompt"
  );

  plop.setPrompt("autocomplete", autocompletePrompt);

  plop.setPartial("success", 'success(res, "สร้างข้อมูลสำเร็จ");');
  plop.setPartial("failed", 'failed(res, "สร้างข้อมูลไม่สำเร็จ", error);');
  // สร้าง Helper
  plop.setHelper("camelCase", (text) => {
    return text
      .replace(/\d+/g, "") // Remove all numbers
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (/\s+/.test(match)) return ""; // Remove spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
      });
  });

  const versionChoices = ["v1", "v2"];
  const sourceFunction = (_answersSoFar, input) => {
    input = input || "";
    const filteredChoices = versionChoices.filter((choice) =>
      choice.toLowerCase().includes(input.toLowerCase())
    );
    return filteredChoices;
  };

  const readdir = promisify(fs.readdir);

  const functionChoicesNameAPI = async (answersSoFar, input) => {
    const folders = (
      await readdir(`./src/api/${answersSoFar?.version}`)
    ).filter((f) => !f.includes("."));

    const apiChoices = folders.map((folder) => folder);
    input = input || "";
    const filteredChoices = apiChoices.filter((choice) =>
      choice.toLowerCase().includes(input.toLowerCase())
    );
    return filteredChoices;
  };

  // สร้าง Action Type ใหม่
  plop.setActionType("checkExistence", (answers) => {
    const filesToCheck = [
      `src/api/${answers.version}/${plop.getHelper("camelCase")(
        answers.name
      )}/${plop.getHelper("camelCase")(answers.name)}Controller.js`,
      `src/api/${answers.version}/${plop.getHelper("camelCase")(
        answers.name
      )}/${plop.getHelper("camelCase")(answers.name)}Routes.js`,
      `src/api/${answers.version}/${plop.getHelper("camelCase")(
        answers.name
      )}/${plop.getHelper("camelCase")(answers.name)}Model.js`,
      `src/api/${answers.version}/${plop.getHelper("camelCase")(
        answers.name
      )}/${plop.getHelper("camelCase")(answers.name)}Schema.js`,
    ];

    const existingFiles = filesToCheck.filter((file) => fs.existsSync(file));
    if (existingFiles.length > 0) {
      return `ไฟล์ต่อไปนี้มีอยู่แล้ว: ${existingFiles.join(", ")}`;
    }
    return "ทุกไฟล์สามารถสร้างได้";
  });

  // Generator สำหรับสร้าง API
  plop.setGenerator("api", {
    description: "สร้าง api ใหม่",
    prompts: [
      {
        type: "autocomplete",
        name: "version",
        message: "เลือก version",
        source: sourceFunction,
      },
      {
        type: "input",
        name: "name",
        message: "ชื่อของ api คืออะไร?",
      },
    ],
    actions: [
      {
        type: "checkExistence", // ใช้ Action Type ที่สร้างขึ้น
      },
      {
        type: "add",
        path: "src/api/{{version}}/{{camelCase name}}/{{camelCase name}}Controller.js",
        templateFile: "plop-templates/controller.js.hbs",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "src/api/{{version}}/{{camelCase name}}/{{camelCase name}}Routes.js",
        templateFile: "plop-templates/routes.js.hbs",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "src/api/{{version}}/{{camelCase name}}/{{camelCase name}}Model.js",
        templateFile: "plop-templates/model.js.hbs",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "src/api/{{version}}/{{camelCase name}}/{{camelCase name}}Schema.js",
        templateFile: "plop-templates/schema.js.hbs",
        skipIfExists: true,
      },
    ],
  });

  plop.setGenerator("remove-api", {
    description: "ลบ api",
    prompts: [
      {
        type: "autocomplete",
        name: "version",
        message: "เลือก version",
        source: sourceFunction,
      },
      {
        type: "autocomplete",
        name: "name",
        message: "ชื่อของ api คืออะไร?",
        source: functionChoicesNameAPI,
      },
    ],
    actions: [
      {
        type: "remove",
        path: "src/api/{{version}}/{{camelCase name}}",
      },
    ],
  });
};
