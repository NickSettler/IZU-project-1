export default class Cell {
  constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly f: number,
    private readonly g: number,
    private readonly h: number
  ) {
    // ...
  }

  public get X(): number {
    return this.x;
  }

  public get Y(): number {
    return this.y;
  }

  public get F(): number {
    return this.f;
  }

  public get G(): number {
    return this.g;
  }

  public get H(): number {
    return this.h;
  }
}
