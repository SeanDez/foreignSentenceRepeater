import SetupRole from "../SetupRole";
import fs from "fs";
import path from "path";

class SetupRoleExposed extends SetupRole {
   public checkForCredentialsFilePublic(filePath: string) {
      return this.checkForCredentialsFile(filePath);
   }
}

test("SetupRole", () => {
   /**** Setup ****/
   const setupRole = new SetupRoleExposed();


   /**** Execute & Assert ****/

   // non-existent file
   const badFilePath = path.join(__dirname, "noFile.bad")
   const shouldBeFalse = setupRole.checkForCredentialsFilePublic(badFilePath);
   expect(shouldBeFalse).toStrictEqual(false);

   // actual file check
   const dummyFile = "./dummyFile.json";
   const fullFilePath = path.join(__dirname, dummyFile);
   fs.writeFileSync(fullFilePath, "");

   const shouldBeTrue = setupRole.checkForCredentialsFilePublic(fullFilePath);
   expect(shouldBeTrue).toStrictEqual(true);

   /**** Teardown ****/
   try {
      fs.unlinkSync(fullFilePath)
   }
   catch(error) { console.log("error: ", error); }
});