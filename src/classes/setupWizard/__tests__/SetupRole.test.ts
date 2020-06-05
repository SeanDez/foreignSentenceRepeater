import SetupRole from "../SetupRole";
import fs from "fs";

test("SetupRole", () => {
   /**** Setup ****/
   const setupRole = new SetupRole();
   const dummyFilePath = __dirname;


   /**** Execute & Assert ****/

   // non-existent file
   const isFalse = setupRole.validate("nonExistantFile.json");
   expect(isFalse).toStrictEqual(false);

   // actual file
   const dummyFile = "./dummyFile.json";
   fs.writeFileSync(dummyFile, "");
   const isTrue = setupRole.validate("./dummyFile.json");
   expect(isTrue).toStrictEqual(true);

   /**** Teardown ****/
   try {
      fs.unlinkSync(dummyFile)
   }
   catch(error) { console.log("error: ", error); }
})