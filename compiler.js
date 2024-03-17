function lexer(input) {
  const tokens = [];

  let cursor = 0;

  while (cursor < input.length) {
    let char = input[cursor];

    //skip whitespace
    if (/\s/.test(char)) {
      cursor++;
      continue;
    }

    //if word
    if (/[a-zA-Z]/.test(char)) {
      let word = "";
      while (/[a-zA-Z0-9]/.test(char)) {
        word = word + char;
        char = input[++cursor];
      }

      if (word === "ye" || word === "bol") {
        tokens.push({ type: "keyword", value: word });
      } else {
        tokens.push({ type: "identifier", value: word });
      }

      continue;
    }

    //if number
    if (/[0-9]/.test(char)) {
      let num = "";
      while (/[0-9]/.test(char)) {
        num = num + char;
        char = input[++cursor];
      }

      tokens.push({ type: "number", value: parseInt(num) });
      continue;
    }

    //if operator
    if (/[\+\-\*\/=]/.test(char)) {
      tokens.push({ type: "operator", value: char });
      cursor++;
      continue;
    }
  }

  return tokens;
}

function parser(tokens) {
  const ast = {
    type: "Program",
    body: [],
  };

  while (tokens.length > 0) {
    let token = tokens.shift(); //Returns first value of the array

    //check for keywords
    if (token.type === "keyword" && token.value === "ye") {
      let declarations = {
        type: "Declaration",
        name: tokens.shift().value,
        value: null,
      };

      //check for =
      if (tokens[0].type === "operator" && tokens[0].value === "=") {
        tokens.shift();

        //check for expressions
        let expression = "";
        while (tokens.length > 0 && tokens[0].type !== "keyword") {
          expression = expression + tokens.shift().value;
        }
        declarations.value = expression.trim();
      }

      ast.body.push(declarations);
    }

    if (token.type === "keyword" && token.value === "bol") {
      ast.body.push({
        type: "Print",
        expression: tokens.shift().value,
      });
    }
  }

  return ast;
}

function codeGen(node) {
  switch (node.type) {
    case "Program":
      return node.body.map(codeGen).join("\n");
    case "Declaration":
      return `const ${node.name} = ${node.value}`;
    case "Print":
      return `console.log(${node.expression})`;
  }
}

function runner(input) {
  eval(input);
}

function compiler(input) {
  const tokens = lexer(input);
  const ast = parser(tokens);
  const executableCode = codeGen(ast);
  return executableCode;
}

const code = `
ye num1=1
ye num2=2
ye sum=num1+num2
bol sum
`;

const executableCode = compiler(code);
runner(executableCode);
