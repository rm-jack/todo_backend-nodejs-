const path = require("path");
const myBatisMapper = require("mybatis-mapper");

myBatisMapper.createMapper([path.resolve(__dirname, "")]);

const Query = (nameSpace, sqlID, params) => {
  return myBatisMapper.getStatement(nameSpace, sqlID, params, {
    language: "sql",
    indent: "",
  });
};

module.exports = Query;
