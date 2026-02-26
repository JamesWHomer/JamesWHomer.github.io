// Interactive Terminal
document.addEventListener('DOMContentLoaded', function() {
    const terminalBody = document.querySelector('.terminal-body');
    const terminalInput = document.querySelector('.interactive-input');
    const commandHistory = document.getElementById('command-history');
    const cursorElement = document.querySelector('.blink');
    
    // Ensure command history always starts as an array
    window.commandHistoryArray = Array.isArray(window.commandHistoryArray)
        ? window.commandHistoryArray
        : [];

    // Add history index tracker for arrow-key navigation
    let historyIndex = window.commandHistoryArray.length || 0;
    
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
            if (window.commandHistoryArray.length > 0) {
                if (historyIndex > 0) {
                    historyIndex--;
                } else {
                    historyIndex = 0;
                }
                terminalInput.value = window.commandHistoryArray[historyIndex] || '';
            } else {
                historyIndex = 0;
            }
            updateCursorPosition();
            event.preventDefault();
            return;
        } else if (event.key === 'ArrowDown') {
            if (window.commandHistoryArray.length > 0) {
                if (historyIndex < window.commandHistoryArray.length - 1) {
                    historyIndex++;
                    terminalInput.value = window.commandHistoryArray[historyIndex];
                } else {
                    historyIndex = window.commandHistoryArray.length;
                    terminalInput.value = '';
                }
            } else {
                historyIndex = 0;
                terminalInput.value = '';
            }
            updateCursorPosition();
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
        if (!command) {
            historyIndex = window.commandHistoryArray.length || 0;
            return;
        }

        // Create command line element
        const cmdLine = document.createElement('div');
        cmdLine.className = 'command-line';
        cmdLine.innerHTML = `<span class="prompt">james@homer:~$</span> <span class="command">${escapeHTML(command)}</span>`;
        commandHistory.appendChild(cmdLine);
        
        // Process different commands
        let output;
        let isError = false;
        
        // Store commands in history
        window.commandHistoryArray.push(command);
        
        // Reset history index to the end of the history after storing the command
        historyIndex = window.commandHistoryArray.length || 0;
        
        // Parse command and arguments
        const args = command.trim().split(/\s+/);
        const cmd = args[0].toLowerCase();
        
        switch(cmd) {
            case 'help':
                output = 'Available commands:\n' +
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
                break;
            case 'about':
                output = 'James Watson Homer\n' +
                        'Software Engineer & Computer Science Student at the University of Sydney\n' +
                        'Born in Sydney, Australia 🇦🇺\n' +
                        'Passionate about technology, music, and martial arts';
                break;
            case 'skills':
                output = '🛠️ Core Systems: C++, Rust, Java, Linux\n' +
                        '📊 Data & Automation: Python, OpenAI API, SQL, Docker\n' +
                        '🌐 Web Development: JavaScript, HTML5, CSS3, React, Node.js\n' +
                        '🔄 Workflow: Git';
                break;
            case 'ls':
                output = 'home/\nexperience/\nskills/\ninterests/\nskills.json\nprojects.json\ncontact.json\nabout.json';
                break;
            case 'projects':
                output = '1. University of Sydney Rocketry Team\n   - Ground control systems and telemetry software\n   - Real-time data visualization\n\n' +
                        '2. Personal Website\n   - Interactive terminal UI\n   - Responsive design\n\n' +
                        '3. Minecraft Plugins\n   - Java-based game extensions\n   - Server administration tools';
                break;
            case 'contact':
                output = 'Email: jameswatsonhomer@gmail.com\nGitHub: https://github.com/JamesWHomer\nLinkedIn: https://www.linkedin.com/in/jameswatsonhomer/\nTwitter: @JamesWHomer';
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
                            scrollToElementWithOffset(document.getElementById('skills'));
                            break;
                        case 'experience':
                        case 'experience/':
                            output = 'Navigating to: experience/';
                            scrollToElementWithOffset(document.getElementById('experience'));
                            break;
                        case 'interests':
                        case 'interests/':
                            output = 'Navigating to: interests/';
                            scrollToElementWithOffset(document.getElementById('interests'));
                            break;
                        case 'home':
                        case 'home/':
                            output = 'Navigating to: home/';
                            scrollToElementWithOffset(document.getElementById('home'));
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
                            output = '{\n  "core": ["C++", "Rust", "Java", "Linux"],\n  "data": ["Python", "OpenAI API", "SQL", "Docker"],\n  "web": ["JavaScript", "HTML5", "CSS3", "React", "Node.js"],\n  "workflow": ["Git"]\n}';
                            break;
                        case 'projects.json':
                            output = '[\n  {\n    "name": "University of Sydney Rocketry Team",\n    "details": [\n      "Ground control systems and telemetry software",\n      "Real-time data visualization"\n    ]\n  },\n  {\n    "name": "Personal Website",\n    "details": [\n      "Interactive terminal UI",\n      "Responsive design"\n    ]\n  },\n  {\n    "name": "Minecraft Plugins",\n    "details": [\n      "Java-based game extensions",\n      "Server administration tools"\n    ]\n  }\n]';
                            break;
                        case 'contact.json':
                            output = '{\n  "email": "jameswatsonhomer@gmail.com",\n  "github": "https://github.com/JamesWHomer",\n  "linkedin": "https://www.linkedin.com/in/jameswatsonhomer/",\n  "twitter": "@JamesWHomer"\n}';
                            break;
                        case 'about.json':
                            output = '{\n  "name": "James Watson Homer",\n  "title": "Software Engineer & Computer Science Student",\n  "university": "University of Sydney",\n  "location": "Sydney, Australia 🇦🇺",\n  "interests": ["technology", "music", "martial arts"]\n}';
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
