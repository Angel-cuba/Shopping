import { ICustomer } from '../interfaces/customer/Customer'

export const users: ICustomer[] = [
  {
    id: 1,
    name: 'John Doe',
    picture:
      'https://res.cloudinary.com/dqaerysgb/image/upload/v1673656213/Random/main_bg_mab3uj.jpg',
    lastSeen: '01/01/2020',
    orders: 2,
    total_spents: '670.50',
    last_purchase: {
      date: '05/10/2018',
      time: '03:48:45'
    },
    news: false,
    segments: 'Regular'
  },
  {
    id: 2,
    name: 'Jane Doe',
    picture:
      'https://res.cloudinary.com/dqaerysgb/image/upload/v1671549637/New_Feed_React-Native/food_ntuami.jpg',
    lastSeen: '01/01/2020',
    orders: 0,
    total_spents: '0.00',
    last_purchase: {
      date: '',
      time: ''
    },
    news: true,
    segments: ''
  },
  {
    id: 3,
    name: 'Jhon Smith',
    picture:
      'https://res.cloudinary.com/dqaerysgb/image/upload/v1671549586/New_Feed_React-Native/sports_h9ww2l.jpg',
    lastSeen: '01/01/2020',
    orders: 0,
    total_spents: '0.00',
    last_purchase: {
      date: '',
      time: ''
    },
    news: true,
    segments: ''
  },
  {
    id: 4,
    name: 'Ronnie Coleman',
    picture:
      'https://res.cloudinary.com/dqaerysgb/image/upload/v1671549583/New_Feed_React-Native/science_kckiki.jpg',
    lastSeen: '03/01/2000',
    orders: 1,
    total_spents: '0.00',
    last_purchase: {
      date: '',
      time: ''
    },
    news: true,
    segments: ''
  },
  {
    id: 5,
    name: 'William Bonner',
    picture:
      'https://res.cloudinary.com/dqaerysgb/image/upload/v1671549578/New_Feed_React-Native/lifestyle-1_c1c7xz.jpg',
    lastSeen: '01/04/2020',
    orders: 0,
    total_spents: '0.00',
    last_purchase: {
      date: '',
      time: ''
    },
    news: true,
    segments: ''
  },
  {
    id: 6,
    name: 'Fernanda Lima',
    picture:
      'https://res.cloudinary.com/dqaerysgb/image/upload/v1635399087/Cuban-Food-1_mydd1f.jpg',
    lastSeen: '01/02/2020',
    orders: 0,
    total_spents: '0.00',
    last_purchase: {
      date: '',
      time: ''
    },
    news: true,
    segments: ''
  },
  {
    id: 7,
    name: 'Sergio Oliva',
    picture: 'https://res.cloudinary.com/dqaerysgb/image/upload/v1635360680/mexico_h9dcjv.jpg',
    lastSeen: '03/01/2020',
    orders: 2,
    total_spents: '0.00',
    last_purchase: {
      date: '21/03/2019',
      time: '09:22:10'
    },
    news: false,
    segments: ''
  },
  {
    id: 8,
    name: 'Gustavo Lima',
    picture:
      'https://res.cloudinary.com/dqaerysgb/image/upload/v1635360679/italian-food_jsa7c0.jpg',
    lastSeen: '01/06/2020',
    orders: 4,
    total_spents: '361.91',
    last_purchase: {
      date: '22/12/2020',
      time: '06:21:10'
    },
    news: true,
    segments: 'Regular'
  },
  {
    id: 9,
    name: 'Jhon Smith',
    picture: 'https://res.cloudinary.com/dqaerysgb/image/upload/v1635267331/restaurant_p5suef.jpg',
    lastSeen: '01/01/2020',
    orders: 0,
    total_spents: '0.00',
    last_purchase: {
      date: '',
      time: ''
    },
    news: true,
    segments: 'Regular'
  },
  {
    id: 10,
    name: 'Jhon Smith',
    picture: 'https://res.cloudinary.com/dqaerysgb/image/upload/v1632245932/paris_mulhc4.jpg',
    lastSeen: '03/02/2020',
    orders: 1,
    total_spents: '685.27',
    last_purchase: {
      date: '22/12/2019',
      time: '06:39:47'
    },
    news: true,
    segments: 'Ordered once'
  }
]
