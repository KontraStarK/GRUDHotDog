var hotdogs = [];
var currentEditingRow = null;
var editingInput = null;
var editButtons = null;

function apiCall(method, url, callback = null, requestData = null) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      try {
        var responseData = JSON.parse(xmlhttp.responseText);
      } catch {}

      if (callback) {
        if (responseData) {
          callback(responseData);
        } else {
          callback();
        }
      }
    }
  };
  xmlhttp.open(method, url, true);
  if (requestData) {
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(requestData));
  } else {
    xmlhttp.send();
  }
}


function updateUI() {
  var tableBody = document.getElementById('hotdogsTableBody');
  tableBody.innerHTML = '';
  for (var i = 0; i < this.hotdogs.length; i++) {
    var hotdog = this.hotdogs[i];
    var row = tableBody.insertRow(i);
    row.setAttribute('id', hotdog._id);
    row.insertCell(0).innerHTML = hotdog.name;
    row.insertCell(1).innerHTML = '<button class="btn btn-primary" onclick="editHotdog(this)">Edit</button>';
    row.insertCell(2).innerHTML = '<button class="btn btn-danger" onclick="deleteHotdog(this)">Delete</button>';
  }
}

function pullHotdogs() {
  apiCall('GET', '/hotdogs/all', function (hotdogs) {
    if (!hotdogs) {
      this.hotdogs = [];
    } else {
      this.hotdogs = hotdogs;
    }
    updateUI();
  });
}

function addHotdog() {
  var hotdogName = document.getElementById('hotdogName');
  if (!hotdogName.value) {
    return;
  }
  var requestData = {
    name: hotdogName.value
  }
  apiCall('POST', '/hotdogs/add', function (hotdog) {
    if (!hotdog) {
      return;
    }
    this.hotdogs.push(hotdog);
    hotdogName.value = '';
    updateUI();
  }, requestData);
}

function editHotdog(button) {
  var editCell = button.parentNode;
  editing(editCell.parentNode);
  editCell.innerHTML = '';
  editCell.appendChild(this.editButtons);
}


function editing(row) {

  if (this.currentEditingRow && this.currentEditingRow !== row) {
    cancelEditing();
  }

  this.currentEditingRow = row;

  if (!row) {

    return;
  }

  var id = row.getAttribute('id');
  var hotdog = findHotdogById(id);

  if (!hotdog) {
    return;
  }

  var nameCell = row.cells[0];

  this.editingInput.value = hotdog.name;
  nameCell.innerHTML = '';
  nameCell.appendChild(this.editingInput);
}

function saveEditing() {
  var row = this.currentEditingRow;
  if (!row) {
    return;
  }
  var hotdogName = this.editingInput.value;
  if (!hotdogName) {
    return;
  }
  var id = row.getAttribute('id');
  var hotdog = findHotdogById(id);
  if (!hotdog) {
    return;
  }
  var requestData = {
    id: id,
    name: hotdogName
  }
  apiCall('PUT', '/hotdogs/edit', function (item) {
    if (!item) {
      cancelEditing();
      return;
    }
    var hotdog = findHotdogById(item._id);
    hotdog.name = item.name;
    cancelEditing();
    updateUI();
  }, requestData);
}

function cancelEditing() {
  var row = this.currentEditingRow;
  if (!row) {
    return;
  }
  var id = row.getAttribute('id');
  var hotdog = findHotdogById(id);
  if (!hotdog) {
    return;
  }
  var nameCell = row.cells[0];
  this.editingInput.value = '';
  nameCell.innerHTML = hotdog.name;

  var editCell = row.cells[1];
  editCell.innerHTML = '<button class="btn btn-primary" onclick="editHotdog(this)">Edit</button>';

  this.currentEditingRow = null;
}

function deleteHotdog(button) {
  var deleteCell = button.parentNode;
  var row = deleteCell.parentNode;
  var id = row.getAttribute('id');
  var hotdog = findHotdogById(id);
  if (!hotdog) {
    return;
  }
  var requestData = {
    id: hotdog._id
  };
  apiCall('DELETE', '/hotdogs/remove', function () {
    var index = this.hotdogs.indexOf(hotdog);
    if (index > -1) {
      this.hotdogs.splice(index, 1);
    }
    updateUI();
  }, requestData);
}

function findHotdogById(id) {
  for (var i = 0; i < this.hotdogs.length; i++) {
    var hotdog = this.hotdogs[i];
    if (hotdog._id == id) {
      return hotdog;
    }
  }
}

function Initialize() {
  pullHotdogs();
  this.editingInput = document.createElement('input');

  var buttons = document.createElement('div');
  buttons.innerHTML = '<button class="btn btn-primary" onclick="saveEditing()">Save</button><button class="btn btn-secondary" onclick="cancelEditing()">Cancel</button>';
  this.editButtons = buttons;
}

Initialize();