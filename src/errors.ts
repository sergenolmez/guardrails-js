export class GuardError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GuardError";
        Object.setPrototypeOf(this, GuardError.prototype);
    }
}