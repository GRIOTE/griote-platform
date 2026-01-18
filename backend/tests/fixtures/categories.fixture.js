// tests/fixtures/categories.fixture.js
const validCategory = {
  category_id: 1,
  name: 'Documents administratifs',
  description: 'Documents liés à l\'administration'
};

const categories = [
  validCategory,
  {
    category_id: 2,
    name: 'Documents techniques',
    description: 'Documents techniques et spécifications'
  },
  {
    category_id: 3,
    name: 'Documents juridiques',
    description: 'Contrats et documents légaux'
  }
];

module.exports = {
  validCategory,
  categories
};