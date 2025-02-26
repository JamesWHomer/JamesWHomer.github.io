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
                        'ls - List portfolio sections\n' +
                        'cd [section] - Navigate to a section\n' +
                        'clear - Clear the terminal\n' +
                        'print - Print this webpage\n' +
                        'history - Show command history';
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
                output = 'home/\nexperience/\nskills/\ninterests/';
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
                output = 'Usage: cd [section]\nAvailable sections: home, experience, skills, interests';
                break;
            case 'cd skills':
                output = 'Navigating to: skills section';
                document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'cd experience':
                output = 'Navigating to: experience section';
                document.getElementById('experience').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'cd interests':
                output = 'Navigating to: interests section';
                document.getElementById('interests').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'cd home':
                output = 'Navigating to: home section';
                document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'sudo':
            case 'sudo rm -rf /':
                output = 'Nice try! Permission denied.';
                isError = true;
                break;
            case 'exit':
            case 'quit':
                output = 'This is just a browser window. Close the tab to exit.';
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