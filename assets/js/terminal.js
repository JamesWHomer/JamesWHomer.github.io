// Interactive Terminal
document.addEventListener('DOMContentLoaded', function() {
    const terminalBody = document.querySelector('.terminal-body');
    const terminalInput = document.querySelector('.interactive-input');
    const commandHistory = document.getElementById('command-history');
    const cursorElement = document.querySelector('.blink');
    
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
        
        switch(command.toLowerCase()) {
            case 'help':
                output = 'Available commands:\n' +
                        'help - Display this help message\n' +
                        'about - Learn about James\n' +
                        'skills - View technical skills\n' +
                        'projects - View portfolio projects\n' +
                        'contact - Show contact information\n' +
                        'date - Display current date and time\n' +
                        'ls - List portfolio sections\n' +
                        'pwd - Print current location\n' +
                        'whoami - Display user information\n' +
                        'uname - Show system information\n' +
                        'history - Show command history\n' +
                        'clear - Clear the terminal\n' +
                        'echo [text] - Display text\n' +
                        'man [command] - Display manual for command\n' +
                        'cat [file] - Display file contents\n' +
                        'touch [file] - Create a file\n' +
                        'mkdir [dir] - Create a directory\n' +
                        'rm [file] - Remove a file\n' +
                        'grep [pattern] - Search for pattern\n' +
                        'vim/nano/emacs - Text editors\n' +
                        'top - Display system processes\n' +
                        'sudo [command] - Run command as superuser';
                break;
            case 'about':
                output = 'James Watson Homer\n' +
                        'Software Engineer & Computer Science Student at the University of Sydney\n' +
                        'Born in Sydney, Australia 🇦🇺\n' +
                        'Passionate about technology, music, and martial arts';
                break;
            case 'skills':
                output = '🔧 Core Systems: C++, Java, Linux\n' +
                        '📊 Data & Automation: Python, SQL, Docker\n' +
                        '🌐 Web Development: JavaScript, HTML5, CSS3, React, Node.js\n' +
                        '🔄 Workflow: Git';
                break;
            case 'ls':
            case 'dir':
                output = 'home/\nexperience/\nskills/\ninterests/';
                break;
            case 'pwd':
                output = '/home/james/portfolio';
                break;
            case 'projects':
                output = '1. University of Sydney Rocketry Team\n   - Ground control systems and telemetry software\n   - Real-time data visualization\n\n' +
                        '2. Personal Website\n   - Interactive terminal UI\n   - Responsive design\n\n' +
                        '3. Minecraft Plugins\n   - Java-based game extensions\n   - Server administration tools';
                break;
            case 'contact':
                output = 'Email: jameswatsonhomer@gmail.com\nGitHub: https://github.com/JamesWHomer\nLinkedIn: https://www.linkedin.com/in/jameswatsonhomer/\nTwitter: @JamesWHomer';
                break;
            case 'date':
            case 'time':
                output = new Date().toString();
                break;
            case 'whoami':
                output = 'james (Student, Developer, Musician)';
                break;
            case 'uname':
            case 'uname -a':
                output = 'Portfolio OS v1.0.4 [HTML/CSS/JS] build 2024 #interactive-terminal';
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
            case 'cd':
                output = 'Changed directory to: /home/james/portfolio';
                break;
            case 'cd skills':
                output = 'Changed directory to: /home/james/portfolio/skills';
                document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'cd experience':
                output = 'Changed directory to: /home/james/portfolio/experience';
                document.getElementById('experience').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'cd interests':
                output = 'Changed directory to: /home/james/portfolio/interests';
                document.getElementById('interests').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'cd home':
                output = 'Changed directory to: /home/james/portfolio';
                document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
                break;
            default:
                if (command.toLowerCase().startsWith('echo ')) {
                    output = command.substring(5);
                } else if (command.toLowerCase() === 'sudo') {
                    output = 'Permission denied: Nice try!';
                    isError = true;
                } else if (command.toLowerCase().startsWith('sudo ')) {
                    if (command.toLowerCase().includes('apt')) {
                        output = '[sudo] password for james: \n' +
                                 'Reading package lists... Done\n' +
                                 'Building dependency tree... Done\n' +
                                 'Portfolio is already the newest version (1.0.4)';
                    } else {
                        output = 'Permission denied: You are not in the sudoers file. This incident will be reported.';
                        isError = true;
                    }
                } else if (command.toLowerCase() === 'exit' || command.toLowerCase() === 'quit') {
                    output = 'Cannot exit: You\'re already on the web. Close the browser tab to exit.';
                } else if (command.toLowerCase() === 'top' || command.toLowerCase() === 'htop') {
                    output = 'Tasks: 5 total, 1 running, 4 sleeping\n' +
                             '%Cpu(s): 2.0 us, 1.0 sy, 0.0 ni, 97.0 id\n' +
                             'PID USER     PR  NI  VIRT  RES  SHR S  %CPU %MEM  TIME+ COMMAND\n' +
                             '1   james    20   0  4096 1024  896 S   0.0  0.1  0:00.01 portfolio\n' +
                             '2   james    20   0  8192 2048 1024 S   0.0  0.2  0:02.33 browser\n' +
                             '3   james    20   0  2048  512  256 S   0.0  0.1  0:00.05 terminal\n' +
                             '4   james    20   0  1024  256  128 S   0.0  0.0  0:00.01 css\n' +
                             '5   james    20   0  4096 1024  512 R   2.0  0.1  0:01.23 javascript';
                } else if (command.toLowerCase() === 'vim' || command.toLowerCase() === 'nano' || command.toLowerCase() === 'emacs') {
                    const editor = command.toLowerCase();
                    if (editor === 'vim') {
                        output = 'Opening vim...\nError: Cannot figure out how to exit vim. Refresh the page to escape.';
                    } else if (editor === 'emacs') {
                        output = 'Opening emacs...\nError: Emacs is a great operating system, but it lacks a good text editor.';
                    } else {
                        output = 'Opening nano...\nError: Nano session terminated. Your portfolio developer prefers vim.';
                    }
                } else if (command.toLowerCase().startsWith('man ')) {
                    const manArg = command.substring(4).trim().toLowerCase();
                    if (manArg === 'help' || manArg === 'ls' || manArg === 'pwd' || manArg === 'cd' || 
                        manArg === 'echo' || manArg === 'clear' || manArg === 'whoami' || manArg === 'history') {
                        output = `MANUAL: ${manArg.toUpperCase()}\n\n` +
                                 `NAME\n    ${manArg} - ${getCommandDescription(manArg)}\n\n` +
                                 `SYNOPSIS\n    ${getCommandSynopsis(manArg)}\n\n` +
                                 `DESCRIPTION\n    ${getCommandLongDescription(manArg)}`;
                    } else {
                        output = `No manual entry for ${manArg}`;
                        isError = true;
                    }
                } else if (command.toLowerCase().startsWith('cat ')) {
                    const catArg = command.substring(4).trim().toLowerCase();
                    if (catArg === 'resume.txt') {
                        output = 'James Watson Homer\nSoftware Engineer & Computer Science Student\n\n' +
                                 'Experience:\n- Software Engineer, University of Sydney Rocketry Team (2024-Present)\n' +
                                 'Education:\n- Advanced Computing, University of Sydney (2024-Present)\n' +
                                 '- International Baccalaureate, The International Highschool (2021-2024)';
                    } else if (catArg === 'skills.txt') {
                        output = '🔧 Core Systems: C++, Java, Linux\n' +
                                 '📊 Data & Automation: Python, SQL, Docker\n' +
                                 '🌐 Web Development: JavaScript, HTML5, CSS3, React, Node.js\n' +
                                 '🔄 Workflow: Git';
                    } else if (catArg === 'projects.txt') {
                        output = 'Current Projects:\n1. University of Sydney Rocketry Team\n2. Personal Website\n3. Minecraft Plugins';
                    } else if (catArg === 'contact.txt') {
                        output = 'Email: jameswatsonhomer@gmail.com\nGitHub: https://github.com/JamesWHomer\nLinkedIn: https://www.linkedin.com/in/jameswatsonhomer/';
                    } else {
                        output = `cat: ${catArg}: No such file or directory`;
                        isError = true;
                    }
                } else if (command.toLowerCase().startsWith('touch ')) {
                    const fileName = command.substring(6).trim();
                    output = `Created file: ${fileName}\nNote: This is a simulation, no actual file is created.`;
                } else if (command.toLowerCase().startsWith('mkdir ')) {
                    const dirName = command.substring(6).trim();
                    output = `Created directory: ${dirName}\nNote: This is a simulation, no actual directory is created.`;
                } else if (command.toLowerCase().startsWith('rm ')) {
                    const rmArg = command.substring(3).trim();
                    if (rmArg === '-rf /' || rmArg === '-rf /*') {
                        output = 'Nice try! That would be bad.';
                        isError = true;
                    } else {
                        output = `Removed: ${rmArg}\nNote: This is a simulation, nothing was actually deleted.`;
                    }
                } else if (command.toLowerCase().startsWith('grep ')) {
                    const grepArgs = command.substring(5).trim().split(' ');
                    if (grepArgs.length >= 2) {
                        const pattern = grepArgs[0];
                        const file = grepArgs[1];
                        output = `Searching for "${pattern}" in ${file}...\n` +
                                 `Note: This is a simulation of the grep command.`;
                    } else {
                        output = 'Usage: grep [pattern] [file]';
                        isError = true;
                    }
                } else if (command) {
                    output = `Command not found: ${command}`;
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
    
    // Helper functions for man command
    function getCommandDescription(cmd) {
        const descriptions = {
            'help': 'display help information',
            'ls': 'list directory contents',
            'pwd': 'print name of current directory',
            'cd': 'change the working directory',
            'echo': 'display a line of text',
            'clear': 'clear the terminal screen',
            'whoami': 'print effective userid',
            'history': 'display command history list'
        };
        return descriptions[cmd] || 'unknown command';
    }
    
    function getCommandSynopsis(cmd) {
        const synopsis = {
            'help': 'help',
            'ls': 'ls [directory]',
            'pwd': 'pwd',
            'cd': 'cd [directory]',
            'echo': 'echo [string]',
            'clear': 'clear',
            'whoami': 'whoami',
            'history': 'history'
        };
        return synopsis[cmd] || 'unknown';
    }
    
    function getCommandLongDescription(cmd) {
        const descriptions = {
            'help': 'Display information about available commands in this portfolio terminal.',
            'ls': 'List information about the sections in the current directory.',
            'pwd': 'Print the name of the current working directory within the portfolio.',
            'cd': 'Change the current directory to the specified section of the portfolio.',
            'echo': 'Display a line of text provided as an argument.',
            'clear': 'Clear the terminal screen, removing all previous commands and output.',
            'whoami': 'Print the current user information.',
            'history': 'Display the list of commands executed in this session.'
        };
        return descriptions[cmd] || 'No detailed description available.';
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