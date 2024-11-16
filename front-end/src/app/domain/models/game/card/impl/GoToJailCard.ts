import {Card, CardType} from "../Card";
import {GoToJailAction} from "../../action/impl/jail/GoToJailAction";

export class GoToJailCard extends Card {
  private _skipGo: boolean;

  public constructor(
    id: number,
    description: string,
    type: CardType,
    skipGo: boolean
  ) {
    super(GoToJailAction.name, id, description, type);
    this._skipGo = skipGo;
  }

  public get skipGo() {
    return this._skipGo;
  }

  public static trueCopy(action: GoToJailCard): GoToJailCard | null {
    return new GoToJailCard(
      action.id,
      action.description,
      action.type,
      action.skipGo
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(),
      {
        "skipGo": this.skipGo,
      }
    );
  }

  public override toString(): string {
    return `Go to jail, ${this.skipGo ? "" : "not"} requiring a move directly to jail skipping GO.`;
  }

}
