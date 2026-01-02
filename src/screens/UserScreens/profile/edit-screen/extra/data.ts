import { ImageSourcePropType } from 'react-native';

export class Profile {

  constructor(readonly firstName: string,
              readonly lastName: string,
              readonly photo: ImageSourcePropType,
              readonly gender: Gender,
              readonly age: number,
              readonly weight: number,
              readonly height: number,
              readonly FavoriteCusines:string,
              readonly email: string,
              readonly phoneNumber: string,
              ) {
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  static jenniferGreen(): Profile {
    return new Profile(
      'Rohan',
      'Surayavanshi',
      require('../assets/image-profile-1.jpg'),
      Gender.MALE,
      25,
      48,
      174,
      'South Indian',
      'rosurya@gmail.com',
      '+91 9877698991',
      
    );
  }
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}
