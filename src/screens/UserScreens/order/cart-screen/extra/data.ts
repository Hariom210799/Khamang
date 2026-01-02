import { ImageSourcePropType } from 'react-native';

export class Product {

  constructor(readonly id: number,
              readonly title: string,
              readonly subtitle: string,
              readonly image: ImageSourcePropType,
              readonly price: number,
              readonly amount: number) {
  }

  get formattedPrice(): string {
    return `Rs. ${this.price}`;
  }

  get totalPrice(): number {
    return this.price * this.amount;
  }

  static pinkChair(): Product {
    return new Product(
      0,
      'Gajar Halwa',
      'Sweet',
      require('../../../../../assets/images/halwa.jpg'),
      130,
      1,
    );
  }

  static blackLamp(): Product {
    return new Product(
      1,
      'Bhendi Fry',
      'Veggies',
      require('../../../../../assets/images/bhendi.jpg'),
      80,
      1,
    );
  }
}
