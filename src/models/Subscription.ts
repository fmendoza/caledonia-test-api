type Credit = {
  total: number;
  remaining: number;
}

export class Subscription extends Parse.Object {
  constructor() {
    super('Subscription');
  }

  get name(): string {
    return this.get('name');
  }

  get customerId(): string {
    return this.get('customerId');
  }

  get tier(): number {
    return this.get('tier');
  }

  get expiresAt(): number {
    return this.get('expiresAt');
  }

  get cameras(): string[] {
    return this.get('cameras');
  }

  set cameras(cameras: string[]) {
    this.set('cameras', cameras);
  }

  get cameraSlots(): number {
    return this.get('cameraSlots');
  }

  get imageCredits(): Credit {
    return this.get('imageCredits');
  }

  get videoCredits(): Credit {
    return this.get('videoCredits');
  }
};

Parse.Object.registerSubclass('Subscription', Subscription);
