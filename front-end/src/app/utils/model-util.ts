/**
 * A utility class with:
 *  the function to check the equality of instances of a object.
 *
 * @author Hamza el Haouti
 */
export class ModelUtil {

  private constructor() {
  }

  /**
   * Checks whether 2 models are equal to one another.
   *
   * @param o1 The object that needs to be compared to o2.
   * @param o2 The object that needs to be compared to o1.
   */
  public static equals(o1: object, o2: object): boolean {
    if (o1 == null || o2 == null) return false;

    return o1 === o2 || JSON.stringify(o1) === JSON.stringify(o2);
  }
}
