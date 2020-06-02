export default abstract class StepsBase {
   public header: string = `
   ******************************************
       FOREIGN SENTENCE AUDIO TRANSLATOR 
   ******************************************
   `;

   constructor() {
      
   }

   // --------------- Defaults

   public prompt() {
      console.log(`

      Press Enter to continue...
      
      `);
   }

}