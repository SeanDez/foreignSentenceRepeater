import SetupRole from "../SetupRole";
import fs from "fs";

class SetupRoleExposed extends SetupRole {
   public checkForCredentialsFilePublic() {
      return this.checkForCredentialsFile();
   }
}

test("SetupRole", () => {
   /**** Setup ****/
   const setupRole = new SetupRoleExposed();
   const dummyFilePath = __dirname;


   /**** Execute & Assert ****/

   // non-existent file
   const isFalse = setupRole.checkForCredentialsFilePublic();
   expect(isFalse).toStrictEqual(false);

   // actual file
   const dummyFile = "./dummyFile.json";
   fs.writeFileSync(dummyFile, "");
   const isTrue = setupRole.checkForCredentialsFilePublic();
   expect(isTrue).toStrictEqual(true);

   /**** Teardown ****/
   try {
      fs.unlinkSync(dummyFile)
   }
   catch(error) { console.log("error: ", error); }
})