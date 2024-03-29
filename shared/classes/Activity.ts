import { ActivityType } from "../types/ActivityType";
import { VariableType } from "../types/VariableType";

export class Activity implements ActivityType {
    _id: string;
    label: string;
    description?: string;
    color: string;
    start: Date;
    variables: VariableType[];
    status: string;

    constructor(activity: any) {
        this._id = activity._id;
        this.label = activity.label;
        this.description = activity.description;
        this.color = activity.color;
        if (!this.isValidColor(this.color)) {
            this.color = '#262729';
        }
        this.start = new Date(activity.start);
        this.variables = activity.variables;
        this.status = activity.status;
    }

    setColor(color: string) {
        if (!this.isValidColor(color)) {
            throw new Error('La couleur n\'est pas valide. seuls les codes hexadécimaux sont autorisés.');
        }
        this.color = color;
    }

    isValidColor(color: string): boolean {
        return !!color.match(/^#[0-9a-fA-F]{3,6}$/);
    }
}
