// script.js

document.addEventListener('DOMContentLoaded', () => {
  const createGroupForm = document.getElementById('create-group-form');
  const searchGroupsForm = document.getElementById('search-groups-form');
  const groupNameInput = document.getElementById('group-name');
  const searchQueryInput = document.getElementById('search-query');
  const searchResults = document.getElementById('search-results');

  // Create Group Form Submission
  createGroupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = groupNameInput.value;

    if (name) {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/groups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description: '' })
        });
        const data = await response.json();
        console.log('Group created:', data);
        groupNameInput.value = '';
      } catch (error) {
        console.error('Error creating group:', error);
      }
    }
  });

  // Search Groups Form Submission
  searchGroupsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchQueryInput.value;

    if (query) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/groups?search=${query}`);
        const data = await response.json();
        searchResults.innerHTML = data.map(group => `<li>${group.name} - ${group.description}</li>`).join('');
        searchResults.style.display = 'block';
      } catch (error) {
        console.error('Error searching groups:', error);
      }
    }
  });
});
