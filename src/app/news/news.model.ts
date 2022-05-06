export class News {
  public heading: string;
  public description: string;
  public image: string;

  constructor(heading: string, description: string, image: string) {
    this.heading = heading;
    this.description = description;
    this.image = image;
  }
}
