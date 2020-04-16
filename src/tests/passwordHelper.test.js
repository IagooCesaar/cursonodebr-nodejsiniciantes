const assert = require("assert");
const PasswordHelper = require("../helpers/passwordHelper");

const MOCK_SENHA = "123";
let validHash = "";
const MOCK_HASH_TRUE =
  "$2b$04$4lxqM3x4auYuxZCyugXpWuzPxlPoX0YQxcEn3nbYmQbvMc6FDhcWq";
const MOCK_HASH_FALSE =
  "$2b$04$UZDsJ3xcyuaKyVRoj0SgD.tSCO1tfYd0324sFPNfVOF8s46EF/uei";

describe("## UserHelper Test suite", function () {
  it("Deverá gerar um hash de uma senha", async () => {
    validHash = await PasswordHelper.hashPassword(MOCK_SENHA);
    // console.log("# Hash válido gerado ==> ", validHash);
    assert.ok(validHash.length >= 10);
  });

  it("Deverá validar o hash gerado para uma senha", async () => {
    const result = await PasswordHelper.comparePassword(MOCK_SENHA, validHash);
    // console.log("Resultado => ", result);
    assert.ok(result);
  });

  it("Deverá validar determinado hash", async () => {
    const result = await PasswordHelper.comparePassword(
      MOCK_SENHA,
      MOCK_HASH_TRUE
    );
    assert.ok(result);
  });

  it("NÃO deverá validar o hash gerado para uma senha", async () => {
    const result = await PasswordHelper.comparePassword(
      MOCK_SENHA,
      MOCK_HASH_FALSE
    );
    assert.ok(!result);
  });
});
