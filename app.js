let orders = [];

function addOrder() {
    const menuName = document.getElementById('menuName').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);

    if (!menuName || quantity <= 0 || price < 0) {
        alert("Please enter valid information");
        return;
    }

    orders.push({ menuName, quantity, price });
    renderTable();
}

function removeOrder(index) {
    orders.splice(index, 1);
    renderTable();
}

function renderTable() {
    const tbody = document.querySelector('#orderTable tbody');
    tbody.innerHTML = '';
    let total = 0;

    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        const subtotal = order.quantity * order.price;
        total += subtotal;

        row.innerHTML = `
            <td>${order.menuName}</td>
            <td>${order.quantity}</td>
            <td>${order.price.toFixed(2)}</td>
            <td>${subtotal.toFixed(2)}</td>
            <td><button onclick="removeOrder(${index})">Remove</button></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('totalPrice').innerText = `Total: $${total.toFixed(2)}`;
}

function generatePDF() {
    if (orders.length === 0) {
        alert("No orders found");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    // Set standard font for English readability
    doc.setFont('helvetica', 'normal');

    // Header
    doc.setFontSize(22);
    doc.text("Earth Coffee Shop", 300, 50, { align: "center" });
    doc.setFontSize(12);
    doc.text("Address: 68/10 Street, Rayong City", 300, 70, { align: "center" });
    doc.text("Phone: 064 303 4012", 300, 85, { align: "center" });

    doc.setLineWidth(1);
    doc.line(40, 95, 555, 95);

    // Prepare table data
    const tableColumn = ["Menu", "Quantity", "Price/unit ($)", "Subtotal ($)"];
    const tableRows = [];
    let total = 0;

    orders.forEach(order => {
        const subtotal = order.quantity * order.price;
        total += subtotal;
        tableRows.push([order.menuName, order.quantity.toString(), order.price.toFixed(2), subtotal.toFixed(2)]);
    });

    // Use autoTable with proper font and grid theme
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 110,
        theme: 'grid',
        headStyles: { fillColor: [222, 184, 135], textColor: 0, fontStyle: 'bold' },
        styles: { font: 'helvetica', fontSize: 12 }
    });

    doc.setFontSize(14);
    doc.text(`Total: $${total.toFixed(2)}`, 400, doc.lastAutoTable.finalY + 25);

    doc.setFontSize(10);
    doc.text("Wishing you warmth and happiness in every sip. ☕", 300, doc.lastAutoTable.finalY + 50, { align: "center" });

    doc.save("receipt.pdf");
}


