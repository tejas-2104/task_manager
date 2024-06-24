
const fs = require('fs');
const path = require('path');
const readline = require('readline');


const tasksFilePath = path.join(__dirname, 'tasks.json');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function loadTasks() {
    if (!fs.existsSync(tasksFilePath)) {
        return [];
    }
    const data = fs.readFileSync(tasksFilePath, 'utf-8');
    return JSON.parse(data);
}


function saveTasks(tasks) {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf-8');
}


function showMenu() {
    console.log(`
    1. Add a new task
    2. View a list of tasks
    3. Mark a task as complete
    4. Remove a task
    5. Exit
    `);
    rl.question('Choose an option: ', handleMenuOption);
}


function handleMenuOption(option) {
    const tasks = loadTasks();
    switch (option.trim()) {
        case '1':
            rl.question('Enter the task description: ', (description) => {
                tasks.push({ description, complete: false });
                saveTasks(tasks);
                console.log('Task added.');
                showMenu();
            });
            break;
        case '2':
            console.log('List of tasks:');
            tasks.forEach((task, index) => {
                console.log(`${index + 1}. [${task.complete ? 'x' : ' '}] ${task.description}`);
            });
            showMenu();
            break;
        case '3':
            rl.question('Enter the task number to mark as complete: ', (number) => {
                const index = parseInt(number.trim(), 10) - 1;
                if (tasks[index]) {
                    tasks[index].complete = true;
                    saveTasks(tasks);
                    console.log('Task marked as complete.');
                } else {
                    console.log('Invalid task number.');
                }
                showMenu();
            });
            break;
        case '4':
            rl.question('Enter the task number to remove: ', (number) => {
                const index = parseInt(number.trim(), 10) - 1;
                if (tasks[index]) {
                    tasks.splice(index, 1);
                    saveTasks(tasks);
                    console.log('Task removed.');
                } else {
                    console.log('Invalid task number.');
                }
                showMenu();
            });
            break;
        case '5':
            rl.close();
            break;
        default:
            console.log('Invalid option. Please try again.');
            showMenu();
            break;
    }
}


showMenu();


rl.on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
});
