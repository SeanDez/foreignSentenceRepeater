
export default class Utilities {

   /* take a generic callback. Store all return values of the callback until the callback returns false

   Then, end looping. Return an array of all prior return values

   If arguments are passed, use a wrapper function to return the callback, invoked with the desired arguments
   */
   static loopUntilFalse<CallbackReturn>(callback: () => CallbackReturn | false): CallbackReturn[] {
      let continueLooping = true;
      const returnValues: Array<CallbackReturn> = [];

      while (continueLooping === true) {
         const latestReturnValue: CallbackReturn | false = callback();

         if (latestReturnValue === false) { 
            continueLooping = false;
         } else if (typeof latestReturnValue !== "boolean") {
            returnValues.push(latestReturnValue);
         }
      }

      return returnValues;
   }
}