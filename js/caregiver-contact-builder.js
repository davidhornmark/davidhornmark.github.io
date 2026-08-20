function addRow() {
  const table = document.getElementById("vcardTable");
  const tbody = table.getElementsByTagName('tbody')[0];
  const newRow = tbody.insertRow();

  const columnInputs = [
    [
      `<input type="text" class="form-control w-100 bg-transparent border-0 p-1" name="childName" placeholder="Name of Child.." />`
    ],
    [
      `<input type="text" class="form-control w-100 bg-transparent border-0 p-1" name="caregiverName" placeholder="Name of Caregiver.."/>`
    ],
    [
      `<select id="caregiverRole" class="form-select bg-transparent border-0" name="caregiverRole">
        <option value="Mother">Mother</option>
        <option value="Father">Father</option>
        <option value="Guardian">Guardian</option>
      </select>`
    ],
    [
      `<input type="text" class="form-control w-100 bg-transparent border-0 p-1" name="phoneNumber" placeholder="Phonenumber.."/>`
    ],
    [
      `<button type="button" class="btn btn-outline-primary me-1" onclick="duplicateRow(this)"><i class="bi bi-copy"></i></button>`,
      `<button type="button" class="btn btn-outline-danger" onclick="deleteRow(this)"><i class="bi bi-trash"></i></button>`
    ]
  ];

  columnInputs.forEach(inputHtmlArray => {
    const content = inputHtmlArray.join();
    const cell = newRow.insertCell();
    cell.classList.add("text-center");
    cell.innerHTML = content;
  });
}

function deleteRow(btn) {
  const row = btn.closest('tr');
  row.remove();
}

function duplicateRow(btn) {
  const row = btn.closest('tr');
  const newRow = row.cloneNode(true);
  const inputs = newRow.querySelectorAll('input, select');
  row.parentNode.insertBefore(newRow, row.nextSibling);
}

function generateVCard() {
  const table = document.getElementById("vcardTable").getElementsByTagName('tbody')[0];
  const rows = table.getElementsByTagName('tr');
  let result = "";

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName('td');

    if (cells.length >= 4) {
      const childsNameInput = cells[0].querySelector(`[name="childName"]`);
      const caregiverNameInput = cells[1].querySelector(`[name="caregiverName"]`);
      const roleSelect = cells[2].querySelector(`[name="caregiverRole"]`);
      const phoneNumberInput = cells[3].querySelector(`[name="phoneNumber"]`);

      if (childsNameInput && caregiverNameInput && roleSelect && phoneNumberInput) {
        const childsName = childsNameInput.value;
        const caregiverName = caregiverNameInput.value;
        const caregiverRole = roleSelect.value;
        const phoneNumber = phoneNumberInput.value;

        const vcard = [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `N:${childsName} ${caregiverRole} (${caregiverName});;;`,
          `FN:${childsName} ${caregiverRole} (${caregiverName})`,
          `TEL;TYPE=CELL:${phoneNumber}`,
          "END:VCARD"
        ]
        result += vcard.join('\n');
        if (i !== rows.length - 1) {
          result += '\n';
        }
      }
    }
  }

  document.getElementById("resultArea").value = result;
  let rowsToShowInResults = rows.length * 5;
  const maxRows = 15;
  if (rowsToShowInResults > maxRows) {
    rowsToShowInResults = maxRows;
  };
  document.getElementById("resultArea").setAttribute('rows', rowsToShowInResults);
}

function downloadVCard() {
  const textarea = document.getElementById("resultArea");
  const content = textarea.value;

  if (!content.trim()) return;

  const blob = new Blob([content], { type: 'text/x-vcard' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `CONTACTS_${new Date().toISOString().substring(0, 19)}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

window.addRow = addRow;
window.deleteRow = deleteRow;
window.duplicateRow = duplicateRow;
window.generateVCard = generateVCard;
window.downloadVCard = downloadVCard;
