// ==========================================
// FACULTY DATA
// ==========================================
let faculty = [
    { name: "Dr. Aditi Sharma", department: "Computer Science", limit: 18 },
    { name: "Prof. Rahul Verma", department: "Computer Science", limit: 18 },
    { name: "Dr. Neha Kapoor", department: "Information Technology", limit: 16 },
    { name: "Prof. Arjun Singh", department: "Electronics", limit: 18 },
    { name: "Dr. Meera Iyer", department: "Computer Science", limit: 18 },
    { name: "Prof. Kabir Malhotra", department: "Mathematics", limit: 16 }
];

// ==========================================
// COURSE DATA
// ==========================================
let courses = [
    { name: "Web Development", code: "CSE326", department: "Computer Science", hours: 4 },
    { name: "Data Structures", code: "CSE202", department: "Computer Science", hours: 4 },
    { name: "Database Systems", code: "CSE303", department: "Computer Science", hours: 3 },
    { name: "Computer Networks", code: "CSE405", department: "Computer Science", hours: 3 },
    { name: "Operating Systems", code: "CSE301", department: "Computer Science", hours: 4 },
    { name: "Cloud Computing", code: "CSE410", department: "Computer Science", hours: 3 },
    { name: "Information Security", code: "IT402", department: "Information Technology", hours: 3 },
    { name: "Digital Electronics", code: "ECE201", department: "Electronics", hours: 4 },
    { name: "Discrete Mathematics", code: "MTH204", department: "Mathematics", hours: 3 }
];

// ==========================================
// WORKLOAD ALLOCATIONS
// ==========================================
let allocations = [
    { faculty: 0, course: 0, hours: 4, semester: "Fall 2026" },
    { faculty: 0, course: 1, hours: 4, semester: "Fall 2026" },

    { faculty: 1, course: 2, hours: 3, semester: "Fall 2026" },
    { faculty: 1, course: 3, hours: 3, semester: "Fall 2026" },
    { faculty: 1, course: 4, hours: 4, semester: "Fall 2026" },

    { faculty: 2, course: 6, hours: 3, semester: "Fall 2026" },
    { faculty: 2, course: 5, hours: 3, semester: "Fall 2026" },

    { faculty: 3, course: 7, hours: 4, semester: "Fall 2026" },

    { faculty: 4, course: 0, hours: 4, semester: "Fall 2026" },
    { faculty: 4, course: 2, hours: 3, semester: "Fall 2026" },

    { faculty: 5, course: 8, hours: 3, semester: "Fall 2026" }
];

// ==========================================
// LOCAL STORAGE
// ==========================================
function saveData() {
    localStorage.setItem("plannerFaculty", JSON.stringify(faculty));
    localStorage.setItem("plannerCourses", JSON.stringify(courses));
    localStorage.setItem("plannerAllocations", JSON.stringify(allocations));
}

function loadData() {
    const savedFaculty = localStorage.getItem("plannerFaculty");
    const savedCourses = localStorage.getItem("plannerCourses");
    const savedAllocations = localStorage.getItem("plannerAllocations");

    if (savedFaculty) faculty = JSON.parse(savedFaculty);
    if (savedCourses) courses = JSON.parse(savedCourses);
    if (savedAllocations) allocations = JSON.parse(savedAllocations);
}

// ==========================================
// WORKLOAD CALCULATIONS
// ==========================================
function getTotalHours(facultyIndex) {
    return allocations
        .filter(a => a.faculty === facultyIndex)
        .reduce((sum, a) => sum + Number(a.hours), 0);
}

function getCourseCount(facultyIndex) {
    return allocations.filter(a => a.faculty === facultyIndex).length;
}

function getStatus(facultyIndex) {
    const hours = getTotalHours(facultyIndex);
    const limit = faculty[facultyIndex].limit;

    if (hours > limit) {
        return "Overload";
    }

    if (hours >= limit * 0.85) {
        return "Near Limit";
    }

    return "Balanced";
}

function getStatusClass(status) {
    if (status === "Overload") return "overload";
    if (status === "Near Limit") return "near";
    return "balanced";
}

function getInitials(name) {
    return name
        .split(" ")
        .filter(word => !["Dr.", "Prof."].includes(word))
        .map(word => word.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

// ==========================================
// DASHBOARD
// ==========================================
function renderDashboard() {
    // Statistics
    document.getElementById("totalFaculty").textContent = faculty.length;

    document.getElementById("totalCourses").textContent = courses.length;

    const totalHours = allocations.reduce(
        (sum, allocation) => sum + Number(allocation.hours),
        0
    );

    document.getElementById("totalHours").textContent = totalHours;

    const overloads = faculty.filter(
        (member, index) => getStatus(index) === "Overload"
    ).length;

    document.getElementById("overloadCount").textContent = overloads;

    // Search and filter
    const search = document.getElementById("facultySearch")
        .value.toLowerCase();

    const filter = document.getElementById("statusFilter").value;

    const table = document.getElementById("facultyTable");

    table.innerHTML = "";

    faculty.forEach((member, index) => {
        const status = getStatus(index);

        if (
            !member.name.toLowerCase().includes(search) &&
            !member.department.toLowerCase().includes(search)
        ) {
            return;
        }

        if (filter && status !== filter) {
            return;
        }

        const hours = getTotalHours(index);
        const limit = member.limit;

        const percentage = Math.min((hours / limit) * 100, 100);

        const row = `
            <tr>
                <td>
                    <div class="faculty-info">
                        <div class="avatar-small">
                            ${getInitials(member.name)}
                        </div>

                        <div>
                            <b>${member.name}</b>
                            <small>Faculty Member</small>
                        </div>
                    </div>
                </td>

                <td>${member.department}</td>

                <td>${getCourseCount(index)}</td>

                <td>
                    <div class="progress-container">
                        ${hours} / ${limit} hrs

                        <div class="progress-bar">
                            <span style="width:${percentage}%"></span>
                        </div>
                    </div>
                </td>

                <td>
                    <span class="badge ${getStatusClass(status)}">
                        ${status}
                    </span>
                </td>
            </tr>
        `;

        table.innerHTML += row;
    });

    renderCourseSummary();
    renderAlerts();
}

// ==========================================
// FACULTY DIRECTORY
// ==========================================
function renderFacultyDirectory() {
    const search = document.getElementById("directorySearch")
        .value.toLowerCase();

    const table = document.getElementById("directoryTable");

    table.innerHTML = "";

    faculty.forEach((member, index) => {
        if (
            !member.name.toLowerCase().includes(search) &&
            !member.department.toLowerCase().includes(search)
        ) {
            return;
        }

        const hours = getTotalHours(index);
        const status = getStatus(index);

        table.innerHTML += `
            <tr>
                <td>
                    <div class="faculty-info">
                        <div class="avatar-small">
                            ${getInitials(member.name)}
                        </div>
                        <b>${member.name}</b>
                    </div>
                </td>

                <td>${member.department}</td>

                <td>${getCourseCount(index)}</td>

                <td>${hours} hours</td>

                <td>${member.limit} hours</td>

                <td>
                    <span class="badge ${getStatusClass(status)}">
                        ${status}
                    </span>
                </td>
            </tr>
        `;
    });
}

// ==========================================
// COURSE MANAGEMENT
// ==========================================
function renderCourses() {
    const search = document.getElementById("courseSearch")
        .value.toLowerCase();

    const table = document.getElementById("coursesTable");

    table.innerHTML = "";

    courses.forEach((course, index) => {
        if (
            !course.name.toLowerCase().includes(search) &&
            !course.code.toLowerCase().includes(search) &&
            !course.department.toLowerCase().includes(search)
        ) {
            return;
        }

        const assignedFaculty = allocations
            .filter(a => a.course === index)
            .map(a => faculty[a.faculty]?.name)
            .filter(Boolean)
            .join(", ");

        table.innerHTML += `
            <tr>
                <td><b>${course.name}</b></td>
                <td>${course.code}</td>
                <td>${course.department}</td>
                <td>${course.hours} hours</td>
                <td>${assignedFaculty || "Not Assigned"}</td>
            </tr>
        `;
    });
}

// ==========================================
// COURSE SUMMARY
// ==========================================
function renderCourseSummary() {
    const container = document.getElementById("courseSummary");

    container.innerHTML = "";

    courses.slice(0, 5).forEach(course => {
        container.innerHTML += `
            <div class="course-item">
                <div>
                    <strong>${course.name}</strong>
                    <small>${course.code} · ${course.department}</small>
                </div>

                <strong>${course.hours} hrs</strong>
            </div>
        `;
    });
}

// ==========================================
// WORKLOAD ALERTS
// ==========================================
function renderAlerts() {
    const container = document.getElementById("alerts");

    container.innerHTML = "";

    let alertFound = false;

    faculty.forEach((member, index) => {
        const hours = getTotalHours(index);
        const limit = member.limit;
        const status = getStatus(index);

        if (status === "Overload") {
            alertFound = true;

            container.innerHTML += `
                <div class="alert-item danger">
                    <strong>⚠ ${member.name} is overloaded</strong>

                    <small>
                        ${hours} hours assigned against
                        ${limit} hours maximum.
                    </small>
                </div>
            `;
        }

        else if (status === "Near Limit") {
            alertFound = true;

            container.innerHTML += `
                <div class="alert-item">
                    <strong>◷ ${member.name} is near capacity</strong>

                    <small>
                        ${hours} of ${limit} hours assigned.
                    </small>
                </div>
            `;
        }
    });

    if (!alertFound) {
        container.innerHTML = `
            <div class="alert-item">
                <strong>✓ All workloads are balanced</strong>
                <small>No workload issues detected.</small>
            </div>
        `;
    }
}

// ==========================================
// WORKLOAD ALLOCATIONS
// ==========================================
function renderAllocations() {
    const table = document.getElementById("allocationTable");

    table.innerHTML = "";

    allocations.forEach((allocation, index) => {
        const member = faculty[allocation.faculty];
        const course = courses[allocation.course];

        table.innerHTML += `
            <tr>
                <td>${member ? member.name : "Unknown Faculty"}</td>

                <td>${course ? course.name : "Unknown Course"}</td>

                <td>${allocation.hours} hours</td>

                <td>${allocation.semester}</td>

                <td>
                    <button class="secondary-btn"
                        onclick="deleteAllocation(${index})">
                        Remove
                    </button>
                </td>
            </tr>
        `;
    });
}

// ==========================================
// SEMESTER VIEW
// ==========================================
function renderSemester() {
    const container = document.getElementById("semesterBars");

    container.innerHTML = "";

    faculty.forEach((member, index) => {
        const hours = getTotalHours(index);
        const limit = member.limit;
        const percent = Math.min((hours / limit) * 100, 100);

        let color = "#4b77d1";

        if (hours > limit) {
            color = "#d65c64";
        }
        else if (hours >= limit * 0.85) {
            color = "#d7b66a";
        }

        container.innerHTML += `
            <div class="report-bar-row">

                <label>
                    <span>${member.name}</span>
                    <span>${hours} / ${limit} hrs</span>
                </label>

                <div class="progress-bar">
                    <span style="width:${percent}%;background:${color}"></span>
                </div>

            </div>
        `;
    });
}

// ==========================================
// REPORTS
// ==========================================
function renderReports() {
    const container = document.getElementById("reportStats");

    const totalHours = allocations.reduce(
        (sum, a) => sum + Number(a.hours),
        0
    );

    const overloaded = faculty.filter(
        (member, index) => getStatus(index) === "Overload"
    ).length;

    const balanced = faculty.filter(
        (member, index) => getStatus(index) === "Balanced"
    ).length;

    container.innerHTML = `
        <div class="report-card">
            <h4>Total Faculty</h4>
            <h2>${faculty.length}</h2>
            <p>Faculty members in system</p>
        </div>

        <div class="report-card">
            <h4>Total Teaching Hours</h4>
            <h2>${totalHours}</h2>
            <p>Weekly allocated hours</p>
        </div>

        <div class="report-card">
            <h4>Overload Faculty</h4>
            <h2 style="color:#d65c64">${overloaded}</h2>
            <p>${balanced} faculty balanced</p>
        </div>
    `;

    const bars = document.getElementById("reportBars");

    bars.innerHTML = "";

    faculty.forEach((member, index) => {
        const hours = getTotalHours(index);
        const percent = Math.min((hours / member.limit) * 100, 100);

        let color = "#4b77d1";

        if (hours > member.limit) {
            color = "#d65c64";
        }
        else if (hours >= member.limit * 0.85) {
            color = "#d7b66a";
        }

        bars.innerHTML += `
            <div class="report-bar-row">
                <label>
                    <span>${member.name}</span>
                    <span>${hours}/${member.limit} hours</span>
                </label>

                <div class="progress-bar">
                    <span style="width:${percent}%;background:${color}"></span>
                </div>
            </div>
        `;
    });
}

// ==========================================
// PAGE NAVIGATION
// ==========================================
function showPage(pageId, button) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    const titles = {
        dashboard: "Dashboard Overview",
        faculty: "Faculty Profiles",
        courses: "Course Management",
        allocation: "Workload Allocation",
        semester: "Semester Overview",
        reports: "Summary Reports"
    };

    document.getElementById("pageTitle").textContent =
        titles[pageId];

    renderAll();
}

// ==========================================
// MODALS
// ==========================================
function openFacultyModal() {
    document.getElementById("facultyModal").classList.add("show");
}

function openCourseModal() {
    document.getElementById("courseModal").classList.add("show");
}

function openAllocationModal() {
    populateDropdowns();
    document.getElementById("allocationModal").classList.add("show");
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("show");
}

// Close modal if user clicks outside it
document.querySelectorAll(".modal-overlay").forEach(modal => {
    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });
});

// ==========================================
// DROPDOWN POPULATION
// ==========================================
function populateDropdowns() {
    const facultySelect = document.getElementById("facultySelect");
    const courseSelect = document.getElementById("courseSelect");

    facultySelect.innerHTML = "";
    courseSelect.innerHTML = "";

    faculty.forEach((member, index) => {
        facultySelect.innerHTML += `
            <option value="${index}">
                ${member.name} (${getTotalHours(index)}/${member.limit} hrs)
            </option>
        `;
    });

    courses.forEach((course, index) => {
        courseSelect.innerHTML += `
            <option value="${index}">
                ${course.code} - ${course.name}
            </option>
        `;
    });
}

// ==========================================
// ADD FACULTY FORM
// ==========================================
document.getElementById("facultyForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    const newFaculty = {
        name: formData.get("name").trim(),
        department: formData.get("department").trim(),
        limit: Number(formData.get("limit"))
    };

    faculty.push(newFaculty);

    saveData();
    renderAll();

    this.reset();

    closeModal("facultyModal");

    showToast("Faculty member added successfully!");
});

// ==========================================
// ADD COURSE FORM
// ==========================================
document.getElementById("courseForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    const newCourse = {
        name: formData.get("name").trim(),
        code: formData.get("code").trim(),
        department: formData.get("department").trim(),
        hours: Number(formData.get("hours"))
    };

    // Prevent duplicate course codes
    const exists = courses.some(
        course => course.code.toLowerCase() === newCourse.code.toLowerCase()
    );

    if (exists) {
        showToast("Course code already exists!");
        return;
    }

    courses.push(newCourse);

    saveData();
    renderAll();

    this.reset();

    closeModal("courseModal");

    showToast("Course added successfully!");
});

// ==========================================
// ASSIGN WORKLOAD FORM
// ==========================================
document.getElementById("allocationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    const facultyIndex = Number(formData.get("faculty"));
    const courseIndex = Number(formData.get("course"));
    const hours = Number(formData.get("hours"));
    const semester = formData.get("semester");

    // Duplicate allocation check
    const duplicate = allocations.some(allocation =>
        allocation.faculty === facultyIndex &&
        allocation.course === courseIndex &&
        allocation.semester === semester
    );

    if (duplicate) {
        showToast("Conflict: Course already assigned to this faculty!");
        return;
    }

    // Workload limit validation
    const currentHours = getTotalHours(facultyIndex);
    const workloadLimit = faculty[facultyIndex].limit;

    if (currentHours + hours > workloadLimit) {
        const confirmOverload = confirm(
            "Warning! This allocation exceeds the faculty workload limit.\n\n" +
            "Current Hours: " + currentHours +
            "\nNew Hours: " + hours +
            "\nLimit: " + workloadLimit +
            "\n\nDo you still want to assign?"
        );

        if (!confirmOverload) {
            return;
        }
    }

    // Add allocation
    allocations.push({
        faculty: facultyIndex,
        course: courseIndex,
        hours: hours,
        semester: semester
    });

    saveData();
    renderAll();

    this.reset();

    closeModal("allocationModal");

    showToast("Workload assigned successfully!");
});

// ==========================================
// DELETE ALLOCATION
// ==========================================
function deleteAllocation(index) {
    const confirmDelete = confirm(
        "Are you sure you want to remove this allocation?"
    );

    if (!confirmDelete) {
        return;
    }

    allocations.splice(index, 1);

    saveData();
    renderAll();

    showToast("Allocation removed successfully!");
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

// ==========================================
// RENDER EVERYTHING
// ==========================================
function renderAll() {
    renderDashboard();
    renderFacultyDirectory();
    renderCourses();
    renderAllocations();
    renderSemester();
    renderReports();
}

// ==========================================
// START APPLICATION
// ==========================================
loadData();
renderAll();
