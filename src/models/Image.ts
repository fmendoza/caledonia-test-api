

export class Image extends Parse.Object {
  constructor() {
    super('Image');
  }

  get uuid(): string {
    return this.get('uuid');
  }

  get customer_id(): number {
    return this.get('customer_id');
  }

  get imei(): string {
    return this.get('imei');
  }

  get snap_time(): string {
    return this.get('snap_time');
  }

  get link(): string {
    return this.get('link');
  }

  get latDecimal(): number {
    return this.get('latDecimal');
  }

  get lonDecimal(): number {
    return this.get('lonDecimal');
  }

  get ts(): number {
    return this.get('ts');
  }

  get created_at(): string {
    return this.get('created_at');
  }

  get rid(): string {
    return this.get('rid');
  }

  get detections(): any {
    return this.get('detections');
  }

  get video(): any {
    return this.get('video');
  }
};

Parse.Object.registerSubclass('Image', Image);
