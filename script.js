const defaultCustomers = [
    { name: "Acme Corp", plan: "Enterprise", revenue: 12400, status: "Active" },
    { name: "Nova Systems", plan: "Pro", revenue: 9800, status: "Active" },
    { name: "BrightPath", plan: "Business", revenue: 7300, status: "Pending" },
    { name: "UrbanEdge", plan: "Starter", revenue: 2100, status: "Inactive" }
  ];
  
  const monthlyRevenue = [92000, 98000, 104000, 110000, 119000, 128400];
  
  let customers = JSON.parse(localStorage.getItem("customers")) || defaultCustomers;
  let editingIndex = null;
  
  const customerTable = document.getElementById("customerTable");
  const totalRevenue = document.getElementById("totalRevenue");
  const totalCustomers = document.getElementById("totalCustomers");
  const activeCustomers = document.getElementById("activeCustomers");
  const activeUsers = document.getElementById("activeUsers");
  const topCustomersList = document.getElementById("topCustomersList");
  const customerForm = document.getElementById("customerForm");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const sortHighBtn = document.getElementById("sortHighBtn");
  const sortLowBtn = document.getElementById("sortLowBtn");
  const themeToggle = document.getElementById("themeToggle");
  const resetBtn = document.getElementById("resetBtn");
  const exportBtn = document.getElementById("exportBtn");
  const chartContainer = document.querySelector(".chart-placeholder");
  const formSubmitBtn = document.getElementById("formSubmitBtn");
  
  const customerName = document.getElementById("customerName");
  const customerPlan = document.getElementById("customerPlan");
  const customerRevenue = document.getElementById("customerRevenue");
  const customerStatus = document.getElementById("customerStatus");
  
  function saveCustomers() {
    localStorage.setItem("customers", JSON.stringify(customers));
  }
  
  function renderChart() {
    chartContainer.innerHTML = "";
  
    monthlyRevenue.forEach((revenue) => {
      const bar = document.createElement("div");
      bar.classList.add("bar");
      bar.style.height = `${revenue / 600}px`;
      bar.title = `$${revenue.toLocaleString()}`;
      chartContainer.appendChild(bar);
    });
  }
  
  function renderDashboard() {
    customerTable.innerHTML = "";
  
    const searchTerm = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;
  
    let revenueTotal = 0;
    let activeCount = 0;
  
    customers.forEach((customer, index) => {
      revenueTotal += customer.revenue;
  
      if (customer.status === "Active") {
        activeCount++;
      }
  
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.plan.toLowerCase().includes(searchTerm) ||
        customer.status.toLowerCase().includes(searchTerm);
  
      const matchesStatus =
        selectedStatus === "All" || customer.status === selectedStatus;
  
      if (matchesSearch && matchesStatus) {
        customerTable.innerHTML += `
          <tr>
            <td>${customer.name}</td>
            <td>${customer.plan}</td>
            <td>$${customer.revenue.toLocaleString()}</td>
            <td>
              <span class="status ${customer.status.toLowerCase()}">
                ${customer.status}
              </span>
            </td>
            <td>
              <button class="edit-btn" onclick="editCustomer(${index})">Edit</button>
              <button class="delete-btn" onclick="deleteCustomer(${index})">Delete</button>
            </td>
          </tr>
        `;
      }
    });
  
    totalRevenue.textContent = `$${revenueTotal.toLocaleString()}`;
    totalCustomers.textContent = customers.length;
    activeCustomers.textContent = activeCount;
    activeUsers.textContent = (customers.length * 5000).toLocaleString();
  
    updateTopCustomers();
    renderChart();
  }
  
  function updateTopCustomers() {
    const sortedCustomers = [...customers].sort((a, b) => b.revenue - a.revenue);
    const topThree = sortedCustomers.slice(0, 3);
  
    topCustomersList.innerHTML = "";
  
    topThree.forEach((customer) => {
      topCustomersList.innerHTML += `
        <li>${customer.name} — $${customer.revenue.toLocaleString()}</li>
      `;
    });
  }
  
  function addOrUpdateCustomer(event) {
    event.preventDefault();
  
    const customerData = {
      name: customerName.value.trim(),
      plan: customerPlan.value,
      revenue: Number(customerRevenue.value),
      status: customerStatus.value
    };
  
    if (editingIndex === null) {
      customers.push(customerData);
    } else {
      customers[editingIndex] = customerData;
      editingIndex = null;
      formSubmitBtn.textContent = "Add Customer";
    }
  
    saveCustomers();
    renderDashboard();
    customerForm.reset();
  }
  
  function editCustomer(index) {
    const customer = customers[index];
  
    customerName.value = customer.name;
    customerPlan.value = customer.plan;
    customerRevenue.value = customer.revenue;
    customerStatus.value = customer.status;
  
    editingIndex = index;
    formSubmitBtn.textContent = "Update Customer";
  }
  
  function deleteCustomer(index) {
    const confirmed = confirm("Are you sure you want to delete this customer?");
  
    if (!confirmed) return;
  
    customers.splice(index, 1);
    saveCustomers();
    renderDashboard();
  }
  
  function resetDemoData() {
    const confirmed = confirm(
      "Reset all customer data back to the original demo data?"
    );
  
    if (!confirmed) return;
  
    localStorage.removeItem("customers");
  
    customers = [...defaultCustomers];
    editingIndex = null;
  
    customerForm.reset();
    formSubmitBtn.textContent = "Add Customer";
  
    saveCustomers();
    renderDashboard();
  
    alert("Demo data restored!");
  }
  
  function sortByHighestRevenue() {
    customers.sort((a, b) => b.revenue - a.revenue);
    saveCustomers();
    renderDashboard();
  }
  
  function sortByLowestRevenue() {
    customers.sort((a, b) => a.revenue - b.revenue);
    saveCustomers();
    renderDashboard();
  }
  
  function exportReport() {
    let csvContent = "Customer,Plan,Revenue,Status\n";
  
    customers.forEach((customer) => {
      csvContent += `${customer.name},${customer.plan},${customer.revenue},${customer.status}\n`;
    });
  
    const blob = new Blob([csvContent], {
      type: "text/csv"
    });
  
    const url = URL.createObjectURL(blob);
  
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "customer-report.csv";
  
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  
    URL.revokeObjectURL(url);
  }
  
  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
  
    if (document.body.classList.contains("dark-mode")) {
      themeToggle.textContent = "Light Mode";
      localStorage.setItem("theme", "dark");
    } else {
      themeToggle.textContent = "Dark Mode";
      localStorage.setItem("theme", "light");
    }
  }
  
  function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
  
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.textContent = "Light Mode";
    }
  }
  
  customerForm.addEventListener("submit", addOrUpdateCustomer);
  searchInput.addEventListener("input", renderDashboard);
  statusFilter.addEventListener("change", renderDashboard);
  sortHighBtn.addEventListener("click", sortByHighestRevenue);
  sortLowBtn.addEventListener("click", sortByLowestRevenue);
  themeToggle.addEventListener("click", toggleTheme);
  resetBtn.addEventListener("click", resetDemoData);
  exportBtn.addEventListener("click", exportReport);
  
  loadTheme();
  renderDashboard();