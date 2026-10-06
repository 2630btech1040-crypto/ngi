document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    const loginSection = document.getElementById('login-section');
    const portalSection = document.getElementById('portal-section');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const toggleTableBtn = document.getElementById('toggle-table-btn');
    const changeHeadingBtn = document.getElementById('change-heading-btn');
    const portalTitle = document.getElementById('portal-title');
    const tableContainer = document.getElementById('table-container');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userInput = document.getElementById('username').value.trim();
        const passInput = document.getElementById('password').value.trim();

        fetch('users.xml')
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch users file');
                return response.text();
            })
            .then(xmlString => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
                const users = xmlDoc.getElementsByTagName('user'); 
                
                let isAuthenticated = false;

                for (let i = 0; i < users.length; i++) {
                    const u = users[i].getElementsByTagName('username')[0].textContent;
                    const p = users[i].getElementsByTagName('password')[0].textContent;

                    if (u === userInput && p === passInput) {
                        isAuthenticated = true;
                        break;
                    }
                }

                if (isAuthenticated) {
                    loginSection.classList.add('hidden');
                    portalSection.classList.remove('hidden');
                    loadStudentData(); 
                } else {
                    loginMessage.innerHTML = 'Invalid username or password.';
                    loginMessage.classList.add('error-message');
                }
            })
            .catch(error => {
                loginMessage.innerHTML = 'Error loading user authentication data.';
                loginMessage.classList.add('error-message');
                console.error(error);
            });
    });

    function loadStudentData() {
        fetch('students.xml')
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch students file');
                return response.text();
            })
            .then(xmlString => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
                const students = xmlDoc.getElementsByTagName('student');

                const tableBody = document.getElementById('students-table-body');
                tableBody.innerHTML = ''; 

                let topStudent = { name: '', marks: -1, course: '' };
                
                document.getElementById('total-students-count').textContent = `Total Students Enrolled: ${students.length}`;

                for (let i = 0; i < students.length; i++) {
                    const name = students[i].getElementsByTagName('name')[0].textContent;
                    const course = students[i].getElementsByTagName('course')[0].textContent;
                    const semester = students[i].getElementsByTagName('semester')[0].textContent;
                    const marks = parseInt(students[i].getElementsByTagName('marks')[0].textContent, 10);

                    if (marks > topStudent.marks) {
                        topStudent = { name, marks, course };
                    }

                    const row = document.createElement('tr');

                    const nameTd = document.createElement('td');
                    nameTd.textContent = name;
                    row.appendChild(nameTd);

                    const courseTd = document.createElement('td');
                    courseTd.textContent = course;
                    row.appendChild(courseTd);

                    const semTd = document.createElement('td');
                    semTd.textContent = semester;
                    row.appendChild(semTd);

                    const marksTd = document.createElement('td');
                    marksTd.textContent = marks;
                    row.appendChild(marksTd);

                    tableBody.appendChild(row);
                }

                const topStudentDiv = document.getElementById('top-student-info');
                topStudentDiv.innerHTML = `<strong>${topStudent.name}</strong> (${topStudent.course}) - <strong>${topStudent.marks} Marks</strong>`;
            })
            .catch(error => console.error('Error parsing student XML:', error));
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
    });

    toggleTableBtn.addEventListener('click', () => {
        if (tableContainer.style.display === 'none') {
            tableContainer.style.display = 'block'; 
            toggleTableBtn.textContent = 'Hide Student Table';
        } else {
            tableContainer.style.display = 'none';
            toggleTableBtn.textContent = 'Show Student Table';
        }
    });

    changeHeadingBtn.addEventListener('click', () => {
        portalTitle.textContent = 'Active Student Performance Dashboard';
    });
});