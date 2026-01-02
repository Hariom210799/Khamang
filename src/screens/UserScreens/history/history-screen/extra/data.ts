import {ImageSourcePropType} from 'react-native';

export class Product {
  constructor(
    readonly title: string,
    readonly category: string,
    readonly image: ImageSourcePropType,
    readonly price: number,
    readonly amount: number,
  ) {}

  get formattedPrice(): string {
    return `Rs. ${this.price}`;
  }

  get totalPrice(): number {
    return this.price * this.amount;
  }

  static pinkChair(): Product {
    return new Product(
      'Pohe',
      'Breakfast',
      require('../../../../../assets/images/image-profile-1.jpg'),
      130,
      1,
    );
  }

  static whiteChair(): Product {
    return new Product(
      'Daal Chawal',
      'Lunch',
      require('../../../../../assets/images/image-profile-2.jpg'),
      150,
      1,
    );
  }

  static woodChair(): Product {
    return new Product(
      'Sabbu Vada',
      'Dinner',
      require('../../../../../assets/images/image-profile-3.jpg'),
      125,
      1,
    );
  }

  static blackLamp(): Product {
    return new Product(
      'Pohe',
      'Breakfast',
      require('../../../../../assets/images/halwa.jpg'),
      80,
      1,
    );
  }
}
