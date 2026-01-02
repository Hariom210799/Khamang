import {produce} from 'immer';
import {
  SELECT_DISH,
  DESELECT_DISH,
  ADD_DISH,
  DELETE_DISH,
  EDIT_DISH,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  EDIT_CATEGORY,
  CHECK_DISH,
} from '../actions/actionTypes';

const initialState = {
  menu: [
    {
      categoryId: 0,
      categoryName: 'Pickels and Chutneys',
      dishes: [
        {
          id: 0,
          name: 'Mango Pickle',
          available: false,
          description: 'Made with love for foodies',
        },
        {
          id: 1,
          name: 'Jawas Chutney',
          available: false,
          description: 'Made with love for foodies',
        },
        {
          id: 2,
          name: 'Groundnut Chutney',
          available: false,
          description: 'Made with love for foodies',
        },
      ],
    },
    {
      categoryId: 1,
      categoryName: 'Breads',
      dishes: [
        {
          id: 0,
          name: 'Chapati',
          available: false,
          description: 'Made with love for foodies',
        },
        {
          id: 1,
          name: 'Bhakri',
          available: false,
          description: 'Made with love for foodies',
        },
        {
          id: 2,
          name: 'Phulka',
          available: false,
          description: 'Made with love for foodies',
        },
      ],
    },
  ],
};

const maker_menu = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CATEGORY:
      return produce(state, (newState) => {
        newState.menu.push({
          categoryName: action.payload,
          dishes: null,
        });
      });

    case CHECK_DISH:
      return produce(state, (newState) => {
        newState.menu[action.payload.catId].dishes[
          action.payload.dishId
        ].available = true;
      });

    case ADD_DISH:
      return produce(state, (newState) => {
        newState.menu.push({
          title: action.payload.title,
          dishes: null,
        });
      });

    default:
      return state;
  }
};

export default maker_menu;
