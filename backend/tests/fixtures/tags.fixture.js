// tests/fixtures/tags.fixture.js
const validTag = {
  tag_id: 1,
  name: 'Important',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const tags = [
  validTag,
  {
    tag_id: 2,
    name: 'Urgent',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    tag_id: 3,
    name: 'Archive',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

module.exports = {
  validTag,
  tags
};