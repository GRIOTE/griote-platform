// tests/fixtures/depots.fixture.js
const validDepot = {
  depot_id: 1,
  owner_id: 1,
  title: 'Mon premier dépôt',
  description: 'Description du dépôt',
  category_id: 1,
  status: 'DRAFT',
  created_at: new Date().toISOString()
};

const depots = [
  validDepot,
  {
    depot_id: 2,
    owner_id: 1,
    title: 'Deuxième dépôt',
    description: 'Autre description',
    category_id: 2,
    status: 'PUBLISHED',
    created_at: new Date().toISOString()
  }
];

module.exports = {
  validDepot,
  depots
};