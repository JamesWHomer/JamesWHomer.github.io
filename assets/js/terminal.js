// Interactive Terminal
document.addEventListener('DOMContentLoaded', function() {
    const terminalBody = document.querySelector('.terminal-body');
    const terminalInput = document.querySelector('.interactive-input');
    const commandHistory = document.getElementById('command-history');
    const cursorElement = document.querySelector('.blink');
    
    // Add history index tracker for arrow-key navigation
    let historyIndex = 0;

    const terminalData = {
        profile: {
            name: 'James Watson Homer',
            title: 'Software Engineer & Computer Science Student',
            university: 'University of Sydney',
            location: 'Sydney, Australia 🇦🇺',
            interests: ['AI research', 'mathematics', 'rocketry']
        },
        skills: {
            core_systems: ['C++', 'Rust', 'Java', 'Linux'],
            data_automation: ['Python', 'OpenAI API', 'SQL', 'Docker'],
            web_development: ['JavaScript', 'HTML5', 'CSS3'],
            workflow: ['Git']
        },
        contact: {
            email: 'jameswatsonhomer@gmail.com',
            github: 'https://github.com/JamesWHomer',
            linkedin: 'https://www.linkedin.com/in/jameswatsonhomer/'
        },
        projects: [
            {
                name: 'University of Sydney Rocketry Team',
                details: [
                    'Ground control systems and telemetry software',
                    'Real-time data visualization'
                ]
            },
            {
                name: 'Personal Website',
                details: ['Interactive terminal UI', 'Responsive design']
            },
            {
                name: 'Minecraft Plugins',
                details: ['Java-based game extensions', 'Server administration tools']
            }
        ]
    };

    const terminalViews = {
        about: terminalData.profile,
        skills: terminalData.skills,
        contact: terminalData.contact,
        aboutJson: terminalData.profile,
        skillsJson: terminalData.skills,
        contactJson: terminalData.contact,
        projectsJson: terminalData.projects
    };

    function runConsistencyCheck() {
        const sameAbout = Object.is(terminalViews.about, terminalViews.aboutJson);
        const sameSkills = Object.is(terminalViews.skills, terminalViews.skillsJson);
        const sameContact = Object.is(terminalViews.contact, terminalViews.contactJson);

        return sameAbout && sameSkills && sameContact;
    }

    function renderHelp() {
        return 'Available commands:\n' +
                'help               - Display this help message\n' +
                'about              - Learn about James\n' +
                'skills             - View technical skills\n' +
                'projects           - View portfolio projects\n' +
                'contact            - Show contact information\n' +
                'ls                 - List portfolio sections\n' +
                'cd [section]       - Navigate to a section\n' +
                'cat [file]         - Display file contents\n' +
                'echo [text]        - Print text to the terminal\n' +
                'sudo [command]     - Run a command with elevated (mock) privileges\n' +
                'clear              - Clear the terminal\n' +
                'print              - Print this webpage\n' +
                'history            - Show command history\n' +
                'exit | quit        - Display exit instructions';
    }

    function renderAbout() {
        const { name, title, university, location, interests } = terminalViews.about;
        return `${name}\n${title} at the ${university}\nBased in ${location}\nInterests: ${interests.join(', ')}`;
    }

    function renderSkills() {
        const { core_systems, data_automation, web_development, workflow } = terminalViews.skills;
        return '🛠️ Core Systems: ' + core_systems.join(', ') + '\n' +
                '📊 Data & Automation: ' + data_automation.join(', ') + '\n' +
                '🌐 Web Development: ' + web_development.join(', ') + '\n' +
                '🔄 Workflow: ' + workflow.join(', ');
    }

    function renderProjects() {
        return terminalData.projects
            .map((project, index) => {
                const details = project.details.map((detail) => `   - ${detail}`).join('\n');
                return `${index + 1}. ${project.name}\n${details}`;
            })
            .join('\n\n');
    }

    function renderContact() {
        const { email, github, linkedin } = terminalViews.contact;
        return `Email: ${email}\nGitHub: ${github}\nLinkedIn: ${linkedin}`;
    }

    function renderJson(dataset) {
        return JSON.stringify(dataset, null, 2);
    }
    
    // Make terminal clickable
    terminalBody.addEventListener('click', function() {
        terminalInput.focus();
        terminalBody.classList.add('focused');
    });
    
    // Remove focus indicator when clicking elsewhere
    document.addEventListener('click', function(event) {
        if (!terminalBody.contains(event.target)) {
            terminalBody.classList.remove('focused');
        }
    });
    
    // Focus input on terminal click
    terminalInput.addEventListener('focus', function() {
        cursorElement.style.display = 'inline-block';
    });
    
    // Hide system cursor when typing in the input
    terminalInput.addEventListener('blur', function() {
        cursorElement.style.display = 'none';
    });
    
    // Process commands on Enter
    terminalInput.addEventListener('keydown', function(event) {
        // ↑ / ↓ command history navigation
        if (event.key === 'ArrowUp') {
            if (window.commandHistoryArray && window.commandHistoryArray.length) {
                if (historyIndex > 0) {
                    historyIndex--;
                } else {
                    historyIndex = 0;
                }
                terminalInput.value = window.commandHistoryArray[historyIndex] || '';
                updateCursorPosition();
            }
            event.preventDefault();
            return;
        } else if (event.key === 'ArrowDown') {
            if (window.commandHistoryArray && window.commandHistoryArray.length) {
                if (historyIndex < window.commandHistoryArray.length - 1) {
                    historyIndex++;
                    terminalInput.value = window.commandHistoryArray[historyIndex];
                } else {
                    historyIndex = window.commandHistoryArray.length;
                    terminalInput.value = '';
                }
                updateCursorPosition();
            }
            event.preventDefault();
            return;
        }
        
        if (event.key === 'Enter') {
            const command = terminalInput.value.trim();
            processCommand(command);
            terminalInput.value = '';
        }
        
        // Position cursor after input text
        updateCursorPosition();
    });
    
    // Update cursor position on input
    terminalInput.addEventListener('input', updateCursorPosition);
    
    function updateCursorPosition() {
        // Get the prompt width
        const promptElement = document.querySelector('.interactive-line .prompt');
        const promptWidth = promptElement.getBoundingClientRect().width;
        
        // Using a temp element to measure input text width
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'pre';
        tempSpan.style.font = window.getComputedStyle(terminalInput).font;
        tempSpan.textContent = terminalInput.value || '';
        document.body.appendChild(tempSpan);
        
        // Get exact measurements
        const inputWidth = tempSpan.getBoundingClientRect().width;
        document.body.removeChild(tempSpan);
        
        // Set cursor position exactly after the input text with some extra spacing for visibility
        const offset = 14;  // Fine-tuning the cursor position
        cursorElement.style.left = `${promptWidth + inputWidth + offset}px`;
    }
    
    function processCommand(command) {
        // Create command line element
        const cmdLine = document.createElement('div');
        cmdLine.className = 'command-line';
        cmdLine.innerHTML = `<span class="prompt">james@homer:~$</span> <span class="command">${escapeHTML(command)}</span>`;
        commandHistory.appendChild(cmdLine);
        
        // Process different commands
        let output;
        let isError = false;
        
        // Store commands in history if not empty
        if (command) {
            if (!window.commandHistoryArray) {
                window.commandHistoryArray = [];
            }
            window.commandHistoryArray.push(command);
        }
        
        // Reset history index to the end of the history after storing the command
        historyIndex = window.commandHistoryArray.length;
        
        // Parse command and arguments
        const args = command.trim().split(/\s+/);
        const cmd = args[0].toLowerCase();

        if (!runConsistencyCheck()) {
            output = 'Data consistency error: terminal datasets are out of sync.';
            isError = true;
        } else {
        
        switch(cmd) {
            case 'help':
                output = renderHelp();
                break;
            case 'about':
                output = renderAbout();
                break;
            case 'skills':
                output = renderSkills();
                break;
            case 'ls':
                output = 'home/\nexperience/\nskills/\ninterests/\nskills.json\nprojects.json\ncontact.json\nabout.json';
                break;
            case 'projects':
                output = renderProjects();
                break;
            case 'contact':
                output = renderContact();
                break;
            case 'history':
                if (window.commandHistoryArray && window.commandHistoryArray.length > 0) {
                    output = window.commandHistoryArray.map((cmd, index) => 
                        `${index + 1}  ${cmd}`).join('\n');
                } else {
                    output = 'No command history found';
                }
                break;
            case 'clear':
                commandHistory.innerHTML = '';
                return;
            case 'print':
                output = 'Preparing to print webpage...';
                setTimeout(() => {
                    window.print();
                }, 500);
                break;
            case 'cd':
                if (args.length === 1) {
                    output = 'Usage: cd [section]\nAvailable sections: home/, experience/, skills/, interests/';
                } else {
                    const section = args[1].toLowerCase();
                    switch(section) {
                        case 'skills':
                        case 'skills/':
                            output = 'Navigating to: skills/';
                            document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
                            break;
                        case 'experience':
                        case 'experience/':
                            output = 'Navigating to: experience/';
                            document.getElementById('experience').scrollIntoView({ behavior: 'smooth' });
                            break;
                        case 'interests':
                        case 'interests/':
                            output = 'Navigating to: interests/';
                            document.getElementById('interests').scrollIntoView({ behavior: 'smooth' });
                            break;
                        case 'home':
                        case 'home/':
                            output = 'Navigating to: home/';
                            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
                            break;
                        default:
                            output = `cd: directory not found: ${section}`;
                            isError = true;
                            break;
                    }
                }
                break;
            case 'sudo': {
                const sudoCommand = args.slice(1).join(' ');
                if (sudoCommand === 'rm -rf /') {
                    // Gag for the classic dangerous command
                    output = 'Nice try! Permission denied.';
                    isError = true;
                } else if (!sudoCommand) {
                    output = 'sudo: no command specified';
                    isError = true;
                } else {
                    // Execute the underlying command without the sudo prefix
                    processCommand(sudoCommand);
                    return; // Skip further processing in this call
                }
                break;
            }
            case 'exit':
            case 'quit':
                output = 'This is just a browser window. Close the tab to exit.';
                break;
            case 'cat':
                if (args.length === 1) {
                    output = 'Usage: cat [file]\nDisplays the contents of a file.';
                    isError = true;
                } else {
                    const filename = args[1].toLowerCase();
                    switch(filename) {
                        case 'skills.json':
                            output = renderJson(terminalViews.skillsJson);
                            break;
                        case 'projects.json':
                            output = renderJson(terminalViews.projectsJson);
                            break;
                        case 'contact.json':
                            output = renderJson(terminalViews.contactJson);
                            break;
                        case 'about.json':
                            output = renderJson(terminalViews.aboutJson);
                            break;
                        default:
                            output = `cat: ${filename}: No such file or directory`;
                            isError = true;
                            break;
                    }
                }
                break;
            default:
                if (command.toLowerCase().startsWith('echo ')) {
                    output = command.substring(5);
                } else if (command) {
                    output = `Command not found: ${command}\nType 'help' to see available commands.`;
                    isError = true;
                } else {
                    return;
                }
        }
        }
        
        // Create and append output
        const outputElement = document.createElement('div');
        outputElement.className = isError ? 'error-output' : 'command-output';
        outputElement.textContent = output;
        commandHistory.appendChild(outputElement);
        
        // Scroll to bottom of terminal
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    // Escape HTML to prevent XSS
    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Initial focus and positioning
    updateCursorPosition();
    
    // Also position cursor on window resize
    window.addEventListener('resize', updateCursorPosition);
    
    // Focus the terminal if user clicks anywhere in the skills section
    document.querySelector('#skills').addEventListener('click', function(event) {
        // Only focus if clicking on the section but not on links or other interactive elements
        if (event.target.closest('a, button, input') === null) {
            terminalInput.focus();
        }
    });
    
    // Initialize with an empty prompt
    terminalInput.value = '';
    updateCursorPosition();
}); 
