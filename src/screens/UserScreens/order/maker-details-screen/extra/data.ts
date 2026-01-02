import { ImageSourcePropType } from 'react-native';

export class Product {

  constructor(readonly title: string,
              readonly description: string,
              readonly price: ProductPrice,
              readonly primaryImage: ImageSourcePropType,
              readonly images: ImageSourcePropType[],
              readonly details: string[],
              readonly options: ProductOption[]) {
  }

  static centralParkApartment(): Product {
    return new Product(
      'Chef Pooja',
      'A standard thali will have three veggies, kadhi, dal rice, dal khichdi, chapati, bhakri, thalipeeth, dahi wada, papad, cucumber salad and two sweets.\n' +
      '\n' +
      'On Sundays, the thali has puri and chapati, masala rice, dhokla, bhaji, three veggies, dahi wada, papad, salad and two sweets.',
      ProductPrice.tenDollarsPerNight(),
      require('../../../../../assets/images/halwa.jpg'),
      [
        require('../../../../../assets/images/bhendi.jpg'),
        require('../../../../../assets/images/chole-bhature.jpg'),
        require('../../../../../assets/images/vadapav.jpg'),
        require('../../../../../assets/images/puranpoli.jpg'),
        require('../../../../../assets/images/image-profile-1.jpg'),
        require('../../../../../assets/images/halwa.jpg'),
      ],
      [
        'SALAD',
        'BUTTER MILK',
        'SWEET',
      ],
      [
        ProductOption.wifiOption(),
        //ProductOption.tvOption(),
        ProductOption.parkingOption(),
      ],
    );
  }
}

export class ProductPrice {

  constructor(readonly value: number,
              readonly currency: string,
              readonly scale: string) {
  }

  get formattedValue(): string {
    return `${this.currency}${this.value}`;
  }

  get formattedScale(): string {
    return `/${this.scale}`;
  }

  static tenDollarsPerNight(): ProductPrice {
    return new ProductPrice(80, 'Rs.', 'person');
  }
}

export class ProductOption {

  constructor(readonly icon: string,
              readonly title: string) {
  }

  static wifiOption(): ProductOption {
    return new ProductOption('wifi', 'VEGITARIAN');
  }

  // static tvOption(): ProductOption {
  //   return new ProductOption('tv', '');
  // }

  static parkingOption(): ProductOption {
    return new ProductOption('car', 'NON-VEGITARIAN');
  }
}

