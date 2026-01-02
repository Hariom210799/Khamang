import {ImageSourcePropType} from 'react-native';

export class Profile {
  constructor(
    readonly firstName: string,
    readonly lastName: string,
    readonly photo: ImageSourcePropType,
    readonly location: string,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  static helenKuper(): Profile {
    return new Profile(
      'Rohan',
      'S',
      require('../../../../../assets/images/image-profile-1.jpg'),
      'Nanded',
    );
  }

  static jenAustin(): Profile {
    return new Profile(
      'Chinease',
      'Austin',
      require('../../../../../assets/images/image-profile-2.jpg'),
      'Tokyo',
    );
  }

  static jenniferGreen(): Profile {
    return new Profile(
      'South Indian',
      'Green',
      require('../../../../../assets/images/image-profile-3.jpg'),
      'Germany',
    );
  }
  static jenniferGree(): Profile {
    return new Profile(
      'Bengali',
      'Green',
      require('../../../../../assets/images/17.jpg'),
      'Germany',
    );
  }
  static jenniferGre(): Profile {
    return new Profile(
      'Gujarati',
      'Green',
      require('../../../../../assets/images/18.jpg'),
      'Germany',
    );
  }
  static jenniferGr(): Profile {
    return new Profile(
      'Itailian',
      'Green',
      require('../../../../../assets/images/19.jpg'),
      'Germany',
    );
  }
}

export class Post {
  constructor(readonly photo: ImageSourcePropType, readonly category: string) {}

  static plant1(): Post {
    return new Post(
      require('../../../../../assets/images/image-plant-1.jpg'),
      'Plants',
    );
  }

  static plant(): Post {
    return new Post(require('../../../../../assets/images/11.jpg'), 'Plants');
  }
  static plan(): Post {
    return new Post(require('../../../../../assets/images/12.jpg'), 'Plants');
  }

  static pla(): Post {
    return new Post(require('../../../../../assets/images/13.jpg'), 'Plants');
  }

  static pl(): Post {
    return new Post(require('../../../../../assets/images/14.jpg'), 'Plants');
  }

  static plant111(): Post {
    return new Post(require('../../../../../assets/images/15.jpg'), 'Plants');
  }

  static plant14(): Post {
    return new Post(require('../../../../../assets/images/16.jpg'), 'Plants');
  }

  static travel1(): Post {
    return new Post(
      require('../../../../../assets/images/image-travel-1.jpg'),
      'Travel',
    );
  }

  static style1(): Post {
    return new Post(
      require('../../../../../assets/images/image-style-1.jpg'),
      'Style',
    );
  }
}
