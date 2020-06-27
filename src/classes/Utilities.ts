
export default class Utilities {

   /* take a generic callback. Store all return values of the callback until the callback returns false

   Then, end looping. Return an array of all prior return values

   If arguments are passed, use a wrapper function to return the callback, invoked with the desired arguments
   */
   static async loopUntilFalse<CallbackReturn>(callback: Function): Promise<CallbackReturn[]> {
      let continueLooping = true;
      const returnValues: Array<CallbackReturn> = [];

      while (continueLooping === true) {
         let latestReturnValue: CallbackReturn | false;
         try {
            latestReturnValue = await callback();
         }
         catch (error) { console.log(error); }

         if (latestReturnValue === false) { 
            continueLooping = false;
         } else if (typeof latestReturnValue !== "boolean") {
            returnValues.push(latestReturnValue);
         }
      }

      return returnValues;
   }
}