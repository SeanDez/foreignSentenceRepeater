import readLine from "readline-sync";

export default abstract class StepsBase {
    /**** Properties ****/
    public hasSaveableData: boolean = false;
    public needsFileValidation: boolean = false;

    protected header: string;
    protected description: string;
    protected promptMessage: string = `Press any key to continue...
`;

    
    /**** Duck Typed Default Methods ****/

    public explain() {
        console.log(this.header); 
        console.log(this.description);
    }

    public prompt() {
        if (this.promptMessage)
       return readLine.question(this.promptMessage);
    }

    /* Does only a basic exit check
    */
    public validateInput(rawUserInput: string): boolean {
        // if not exited
        return true;
    }


}