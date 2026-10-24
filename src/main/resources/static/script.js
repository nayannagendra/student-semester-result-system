const API_URL = "/api/students";

const formPanel = document.getElementById("formPanel");
const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const messageBox = document.getElementById("message");
const searchInput = document.getElementById("searchInput");

let students = [];

const markFields = [
    "subject1Mse", "subject1Ese",
    "subject2Mse", "subject2Ese",
    "subject3Mse", "subject3Ese",
    "subject4Mse", "subject4Ese"
];

function showMessage(message, type = "success") {
    messageBox.textContent = message;
    messageBox.className = `message ${type}`;

    window.setTimeout(() => {
        messageBox.className = "message";
        messageBox.textContent = "";
    }, 4000);
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed (${response.status})`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

async function loadStudents() {
    studentTable.innerHTML =
        '<tr><td colspan="7" class="empty">Loading records...</td></tr>';

    try {
        students = await apiRequest(API_URL);
        renderStudents();
        updateStats();
    } catch (error) {
        studentTable.innerHTML =
            '<tr><td colspan="7" class="empty">' +
            'Could not load students. Check that the backend is running.' +
            '</td></tr>';

        showMessage(error.message, "error");
    }
}

function renderStudents() {
    const query = searchInput.value.trim().toLowerCase();

    const filtered = students.filter(student =>
        (student.name || "").toLowerCase().includes(query) ||
        (student.prn || "").toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        studentTable.innerHTML =
            '<tr><td colspan="7" class="empty">' +
            (query ? "No matching students found." :
                "No student records yet. Select Add Student to begin.") +
            '</td></tr>';
        return;
    }

    studentTable.innerHTML = filtered.map(student => {
        const result = student.result || "FAIL";
        const resultClass = result === "PASS" ? "pass" : "fail";

        return `
            <tr>
                <td>
                    <div class="student-name">${escapeHtml(student.name)}</div>
                    <div class="student-prn">Student record</div>
                </td>
                <td>${escapeHtml(student.prn)}</td>
                <td>Semester ${student.semester}</td>
                <td><strong>${student.totalMarks ?? 0}</strong> / 400</td>
                <td>${Number(student.percentage ?? 0).toFixed(2)}%</td>
                <td><span class="result ${resultClass}">${result}</span></td>
                <td>
                    <button class="action-btn edit-btn"
                        data-action="edit" data-id="${student.id}">
                        Edit
                    </button>
                    <button class="action-btn delete-btn"
                        data-action="delete" data-id="${student.id}">
                        Delete
                    </button>
                </td>
            </tr>`;
    }).join("");
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function updateStats() {
    document.getElementById("totalStudents").textContent = students.length;

    const passed = students.filter(s => s.result === "PASS").length;
    document.getElementById("passedStudents").textContent = passed;

    const average = students.length
        ? students.reduce((sum, s) => sum + Number(s.percentage || 0), 0)
            / students.length
        : 0;

    document.getElementById("averagePercentage").textContent =
        `${average.toFixed(1)}%`;
}

function openForm(student = null) {
    studentForm.reset();
    document.getElementById("studentId").value = student?.id ?? "";
    document.getElementById("formTitle").textContent =
        student ? "Edit Student" : "Add Student";
    document.getElementById("saveButton").textContent =
        student ? "Update Student" : "Save Student";

    document.getElementById("prn").value = student?.prn ?? "";
    document.getElementById("name").value = student?.name ?? "";
    document.getElementById("semester").value = student?.semester ?? "";

    markFields.forEach(field => {
        document.getElementById(field).value = student?.[field] ?? 0;
    });

    formPanel.hidden = false;
    formPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeForm() {
    formPanel.hidden = true;
    studentForm.reset();
}

document.getElementById("addButton").addEventListener("click", () => {
    openForm();
});

document.getElementById("closeButton").addEventListener("click", closeForm);
document.getElementById("cancelButton").addEventListener("click", closeForm);

searchInput.addEventListener("input", renderStudents);

studentForm.addEventListener("submit", async event => {
    event.preventDefault();

    const student = {
        prn: document.getElementById("prn").value.trim(),
        name: document.getElementById("name").value.trim(),
        semester: Number(document.getElementById("semester").value)
    };

    for (const field of markFields) {
        const input = document.getElementById(field);
        const value = Number(input.value);
        const max = field.endsWith("Mse") ? 30 : 70;

        if (input.value === "" || !Number.isInteger(value)
                || value < 0 || value > max) {
            showMessage(
                `${field} must be a whole number from 0 to ${max}.`,
                "error"
            );
            input.focus();
            return;
        }

        student[field] = value;
    }

    const id = document.getElementById("studentId").value;
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        await apiRequest(url, {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(student)
        });

        closeForm();
        showMessage(id
            ? "Student record updated successfully."
            : "Student record added successfully.");

        await loadStudents();
    } catch (error) {
        showMessage(error.message, "error");
    }
});

studentTable.addEventListener("click", async event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const student = students.find(s => s.id === id);

    if (action === "edit" && student) {
        openForm(student);
        return;
    }

    if (action === "delete" && student) {
        const confirmed = window.confirm(
            `Delete the record for ${student.name}? This cannot be undone.`
        );

        if (!confirmed) return;

        try {
            await apiRequest(`${API_URL}/${id}`, { method: "DELETE" });
            showMessage("Student record deleted successfully.");
            await loadStudents();
        } catch (error) {
            showMessage(error.message, "error");
        }
    }
});

loadStudents();