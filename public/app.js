document.addEventListener('DOMContentLoaded', function() {
  const usersContainer = document.getElementById('users-container');
  const searchInput = document.getElementById('searchInput');
  const pagination = document.getElementById('pagination');
  const loadingSpinner = document.getElementById('loading');
  
  let currentPage = 1;
  const limit = 10000;
  function showLoading() {
      loadingSpinner.style.display = 'block';
      usersContainer.innerHTML = '';
  }
  
  function hideLoading() {
      loadingSpinner.style.display = 'none';
  }
  
  function showError(message) {
      usersContainer.innerHTML = `
          <div class="error-message">
              <i class="fas fa-exclamation-triangle"></i>
              ${message || 'Failed to load users. Please try again later.'}
          </div>
      `;
  }
  
  async function fetchUsers(page = 1, search = '') {
    try {
      showLoading();
      const response = await fetch(`http://localhost:3007/v1/api/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const { data, success, message } = await response.json();
      
      if (!success) {
          throw new Error(message || 'Failed to fetch data');
      }
      
      renderUsers(data.users);
      renderPagination(data.totalPages, page);
    } catch (error) {
      console.error('Error fetching users:', error);
      showError(error.message);
    } finally {
      hideLoading();
    }
  }
    function renderUsers(users) {
      usersContainer.innerHTML = '';
      
      if (users.length === 0) {
          usersContainer.innerHTML = `
              <div class="no-results">
                  <i class="far fa-folder-open"></i>
                  No users found matching your criteria
              </div>
          `;
          return;
      }
      
      users.forEach(user => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
              <div class="avatar">${getInitials(user.first_name, user.last_name)}</div>
              <div class="username">${user.username}</div>
              <div class="info">
                  <span class="label">Name:</span>
                  <span class="value">${user.first_name} ${user.last_name}</span>
              </div>
              <div class="info">
                  <span class="label">Email:</span>
                  <span class="value">${user.email}</span>
              </div>
              <div class="info">
                  <span class="label">Age:</span>
                  <span class="value">${user.age || 'N/A'}Y</span>
              </div>
            <div class="info">
                 <span class="label">Role:</span>
                 <span class="value">${user.role || 'Not specified'}</span>
            </div>
              <button class="action-btn">View Profile</button>
          `;
          
          const viewProfileBtn = card.querySelector('.action-btn');
          viewProfileBtn.addEventListener('click', (e) => {
              e.preventDefault();
              alert(`Viewing profile of ${user.first_name} ${user.last_name}`);
              // You can implement actual profile viewing logic here
          });
          
          usersContainer.appendChild(card);
      });
  }
    function renderPagination(totalPages, currentPage) {
      pagination.innerHTML = '';
      
      if (totalPages <= 1) return;
            if (currentPage > 1) {
          const prevBtn = document.createElement('button');
          prevBtn.className = 'page-btn prev';
          prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
          prevBtn.addEventListener('click', (e) => {
              e.preventDefault();
              currentPage--;
              fetchUsers(currentPage, searchInput.value);
          });
          pagination.appendChild(prevBtn);
      }
      
      const maxVisiblePages = 50;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
          const btn = document.createElement('button');
          btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
          btn.textContent = i;
          btn.addEventListener('click', (e) => {
              e.preventDefault();
              currentPage = i;
              fetchUsers(currentPage, searchInput.value);
          });
          pagination.appendChild(btn);
      }
      
      if (currentPage < totalPages) {
          const nextBtn = document.createElement('button');
          nextBtn.className = 'page-btn next';
          nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
          nextBtn.addEventListener('click', (e) => {
              e.preventDefault();
              currentPage++;
              fetchUsers(currentPage, searchInput.value);
          });
          pagination.appendChild(nextBtn);
      }
  }
  
  function getInitials(firstName, lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  function debounce(func, wait) {
      let timeout;
      return function() {
          const context = this, args = arguments;
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(context, args), wait);
      };
  }
  searchInput.addEventListener('input', debounce(() => {
      currentPage = 1;
      fetchUsers(currentPage, searchInput.value);
  }, 300));
  
  fetchUsers(currentPage);
});