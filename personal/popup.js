// 從 localStorage 載入儲存的資料
function loadGoals() {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const goalsContainer = document.getElementById('goals-container');
    goalsContainer.innerHTML = '';  // 清空現有內容
  
    goals.forEach((goal, index) => {
      const goalDiv = document.createElement('div');
      goalDiv.classList.add('goal');
      goalDiv.innerHTML = `
        <p>${goal.name} - NT$${goal.amount}</p>
        <div class="goal-actions">
          <button class="edit-btn" data-index="${index}">編輯</button>
          <button class="delete-btn" data-index="${index}">刪除</button>
        </div>
      `;
      goalsContainer.appendChild(goalDiv);
    });
  
    // 綁定編輯和刪除事件
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
      button.addEventListener('click', function() {
        const index = button.getAttribute('data-index');
        openEditModal(index);  // 打開編輯彈出框
      });
    });
  
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', function() {
        const index = button.getAttribute('data-index');
        deleteGoal(index);  // 刪除目標
      });
    });
  }
  
  // 打開編輯彈出視窗
  function openEditModal(index) {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const goal = goals[index];
  
    // 將目標資料填入編輯表單
    document.getElementById('edit-goal-name').value = goal.name;
    document.getElementById('edit-goal-amount').value = goal.amount;
  
    // 設定表單提交事件
    const editForm = document.getElementById('edit-goal-form');
    editForm.onsubmit = function(e) {
      e.preventDefault();
      saveGoalChanges(index);
    };
  
    // 顯示 modal
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'flex';
  
    // 關閉 modal
    document.getElementById('close-modal').addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }
  
  // 儲存編輯後的目標
  function saveGoalChanges(index) {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const updatedGoal = {
      name: document.getElementById('edit-goal-name').value,
      amount: document.getElementById('edit-goal-amount').value
    };
  
    goals[index] = updatedGoal;
    localStorage.setItem('goals', JSON.stringify(goals));
    loadGoals();  // 重新載入目標資料
  
    // 關閉 modal
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'none';
  }
  
  // 刪除目標
  function deleteGoal(index) {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    goals.splice(index, 1);  // 移除指定索引的目標
    localStorage.setItem('goals', JSON.stringify(goals));
    loadGoals();  // 重新載入目標資料
  }
  
  // 新增目標
  document.getElementById('goal-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const goalName = document.getElementById('goal-name').value;
    const goalAmount = document.getElementById('goal-amount').value;
  
    if (goalName && goalAmount) {
      const goals = JSON.parse(localStorage.getItem('goals')) || [];
      goals.push({ name: goalName, amount: goalAmount });
      localStorage.setItem('goals', JSON.stringify(goals));
  
      // 清空表單並重新載入目標
      document.getElementById('goal-form').reset();
      loadGoals();
    }
  });
  
  // 下載資料
  document.getElementById('download-btn').addEventListener('click', function() {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const blob = new Blob([JSON.stringify(goals, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'goals.json';
    link.click();
  });
  
  // 上傳資料
  document.getElementById('upload-btn').addEventListener('click', function() {
    document.getElementById('upload-input').click(); // 觸發文件選擇器
  });
  
  // 處理文件上傳
  document.getElementById('upload-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        try {
          const uploadedData = JSON.parse(e.target.result);
          if (Array.isArray(uploadedData)) {
            localStorage.setItem('goals', JSON.stringify(uploadedData));
            loadGoals(); // 重新載入目標資料
          } else {
            alert('上傳的資料格式不正確');
          }
        } catch (error) {
          alert('無法解析上傳的文件');
        }
      };
      
      reader.readAsText(file);
    } else {
      alert('請選擇一個有效的 JSON 檔案');
    }
  });
  
  // 載入目標資料
  loadGoals();
  