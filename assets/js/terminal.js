document.addEventListener('DOMContentLoaded', function() {
    const terminalBody = document.querySelector('.terminal-body');
    const terminalInput = document.querySelector('.interactive-input');
    const commandHistory = document.getElementById('command-history');
    const cursorElement = document.querySelector('.blink');

    const history = [];
    let historyIndex = 0;

    const sections = ['home', 'experience', 'skills', 'interests'];

    const commands = {
        help: () => ({
            text: 'Available commands:\n' +
                  'help             - Display this help message\n' +
                  'about            - Learn about James\n' +
                  'ls               - List portfolio sections\n' +
                  'cd [section]     - Navigate to a section\n' +
                  'clear            - Clear the terminal'
        }),
        about: () => ({
            html: 'James Watson Homer<br>' +
                  'Software Engineer &amp; Computer Science Student at the University of Sydney<br>' +
                  'Born in Sydney, Australia<br><br>' +
                  'Email:    <a href="mailto:jameswatsonhomer@gmail.com" target="_blank" rel="noopener">jameswatsonhomer@gmail.com</a><br>' +
                  'GitHub:   <a href="https://github.com/JamesWHomer" target="_blank" rel="noopener">github.com/JamesWHomer</a><br>' +
                  'LinkedIn: <a href="https://www.linkedin.com/in/jameswatsonhomer/" target="_blank" rel="noopener">linkedin.com/in/jameswatsonhomer</a>'
        }),
        ls: () => ({
            text: sections.map(s => s + '/').join('\n') + '\ntech-stack.sh'
        }),
        cd: (args) => {
            if (args.length === 0) {
                return { text: 'Usage: cd [section]\nAvailable: ' + sections.join(', ') };
            }
            const target = args[0].replace(/\/$/, '').toLowerCase();
            if (sections.includes(target)) {
                document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
                return { text: `Navigating to: ${target}/` };
            }
            return { text: `cd: directory not found: ${args[0]}`, error: true };
        },
        sudo: (args) => {
            if (args.join(' ') === 'rm -rf /') {
                return { text: 'Nice try! Permission denied.', error: true };
            }
            if (args.length === 0) {
                return { text: 'sudo: no command specified', error: true };
            }
            return runCommand(args[0], args.slice(1));
        },
        whoami: () => ({
            text: 'james'
        }),
        date: () => ({
            text: new Date().toString()
        }),
        'tech-stack.sh': () => ({
            text: 'Core Systems:       C++, Rust, Java, Linux\n' +
                  'Data & Automation:  Python, OpenAI API, SQL, Docker\n' +
                  'Web Development:    JavaScript, HTML5, CSS3\n' +
                  'Workflow:           Git'
        }),
        clear: () => {
            commandHistory.innerHTML = '';
            document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
            return null;
        }
    };

    const commandNames = Object.keys(commands);

    function runCommand(cmd, args) {
        const normalized = cmd.toLowerCase().replace(/^\.\//, '');
        const handler = commands[normalized];
        if (!handler) {
            return { text: `Command not found: ${cmd}\nType 'help' to see available commands.`, error: true };
        }
        return handler(args);
    }

    function processCommand(input) {
        if (!input) return;

        const cmdLine = document.createElement('div');
        cmdLine.className = 'command-line';
        cmdLine.innerHTML = `<span class="prompt">james@homer:~$</span> <span class="command">${escapeHTML(input)}</span>`;
        commandHistory.appendChild(cmdLine);

        history.push(input);
        historyIndex = history.length;

        const parts = input.trim().split(/\s+/);
        const result = runCommand(parts[0], parts.slice(1));

        if (result) {
            const el = document.createElement('div');
            el.className = result.error ? 'error-output' : 'command-output';
            if (result.html) {
                el.innerHTML = result.html;
            } else {
                el.textContent = result.text;
            }
            commandHistory.appendChild(el);
        }

        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // --- Tab completion ---
    function getCompletions(input) {
        const parts = input.split(/\s+/);
        const cmd = parts[0].toLowerCase();

        if (parts.length === 1) {
            return commandNames.filter(c => c.startsWith(cmd));
        }

        if (cmd === 'cd' && parts.length === 2) {
            const partial = parts[1].replace(/\/$/, '').toLowerCase();
            return sections.filter(s => s.startsWith(partial));
        }

        return [];
    }

    // --- Typing animation ---
    function playIntroAnimation() {
        const introCmd = document.getElementById('intro-command');
        const introOutput = document.getElementById('intro-output');
        const cmdSpan = introCmd.querySelector('.command');
        const text = './tech-stack.sh';
        let i = 0;

        introCmd.style.display = '';

        function typeChar() {
            if (i < text.length) {
                cmdSpan.textContent += text[i];
                i++;
                setTimeout(typeChar, 40 + Math.random() * 40);
            } else {
                setTimeout(() => {
                    introOutput.style.display = '';
                    introOutput.style.opacity = '0';
                    introOutput.style.transform = 'translateY(8px)';
                    requestAnimationFrame(() => {
                        introOutput.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        introOutput.style.opacity = '1';
                        introOutput.style.transform = 'translateY(0)';
                    });
                }, 200);
            }
        }

        setTimeout(typeChar, 400);
    }

    const terminalEl = document.querySelector('.terminal');
    let introPlayed = false;

    const introObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !introPlayed) {
            introPlayed = true;
            playIntroAnimation();
            introObserver.disconnect();
        }
    }, { threshold: 0.3 });

    introObserver.observe(terminalEl);

    // --- Utilities ---
    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function updateCursorPosition() {
        const promptEl = document.querySelector('.interactive-line .prompt');
        const promptWidth = promptEl.getBoundingClientRect().width;

        const measure = document.createElement('span');
        measure.style.cssText = 'visibility:hidden;position:absolute;white-space:pre';
        measure.style.font = window.getComputedStyle(terminalInput).font;
        measure.textContent = terminalInput.value || '';
        document.body.appendChild(measure);
        const inputWidth = measure.getBoundingClientRect().width;
        document.body.removeChild(measure);

        cursorElement.style.left = `${promptWidth + inputWidth + 14}px`;
    }

    // --- Event listeners ---
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
        terminalBody.classList.add('focused');
    });

    document.addEventListener('click', (e) => {
        if (!terminalBody.contains(e.target)) {
            terminalBody.classList.remove('focused');
        }
    });

    terminalInput.addEventListener('focus', () => { cursorElement.style.display = 'inline-block'; });
    terminalInput.addEventListener('blur', () => { cursorElement.style.display = 'none'; });
    terminalInput.addEventListener('input', updateCursorPosition);

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const val = terminalInput.value;
            const matches = getCompletions(val);
            if (matches.length === 1) {
                const parts = val.split(/\s+/);
                if (parts.length <= 1) {
                    terminalInput.value = matches[0] + ' ';
                } else {
                    parts[parts.length - 1] = matches[0];
                    terminalInput.value = parts.join(' ') + (parts[0].toLowerCase() === 'cd' ? '/' : ' ');
                }
                updateCursorPosition();
            }
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) historyIndex--;
            terminalInput.value = history[historyIndex] || '';
            updateCursorPosition();
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < history.length) historyIndex++;
            terminalInput.value = historyIndex < history.length ? history[historyIndex] : '';
            updateCursorPosition();
            return;
        }
        if (e.key === 'Enter') {
            processCommand(terminalInput.value.trim());
            terminalInput.value = '';
        }
        updateCursorPosition();
    });

    document.querySelector('#skills').addEventListener('click', (e) => {
        if (!e.target.closest('a, button, input')) terminalInput.focus();
    });

    updateCursorPosition();
    window.addEventListener('resize', updateCursorPosition);
});
