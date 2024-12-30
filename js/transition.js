const children = document.querySelectorAll('.content-math');

        children.forEach(child => {
            child.addEventListener('click', function (e) {
                e.stopPropagation();
                // Remove active class and results from all children
                children.forEach(c => {
                    c.classList.remove('active');
                    const result = c.querySelector('.result');
                    const options = c.querySelector('.options');
                    if (result) result.remove();
                    if (options) options.remove();
                });

                // Add active class to clicked child
                this.classList.add('active');

                // Create options for answers
                const optionsDiv = document.createElement('div');
                optionsDiv.classList.add('options');

                const generateRandomAnswers = () => {
                    const answers = [correctResult];
                    while (answers.length < 4) {
                        const randomAnswer = Math.floor(Math.random() * (correctResult + 20)) + 1;
                        if (!answers.includes(randomAnswer)) {
                            answers.push(randomAnswer);
                        }
                    }
                    return answers.sort(() => Math.random() - 0.5); // Shuffle
                };

                const answers = generateRandomAnswers();

                answers.forEach(answer => {
                    const button = document.createElement('button');
                    button.textContent = answer;
                    button.addEventListener('click', () => {
                        const resultDiv = document.createElement('div');
                        resultDiv.classList.add('result');
                        if (answer === correctResult) {
                            resultDiv.textContent = "Correct!";
                            resultDiv.style.color = "green";
                        } else {
                            resultDiv.textContent = "Wrong! Try again.";
                            resultDiv.style.color = "red";
                        }
                        this.appendChild(resultDiv);
                        setTimeout(() => resultDiv.remove(), 2000); // Auto remove after 2 seconds
                    });
                    optionsDiv.appendChild(button);
                });

                this.appendChild(optionsDiv);
            });
        });

        // Remove active class when clicking outside
        document.addEventListener('click', function () {
            children.forEach(c => {
                c.classList.remove('active');
                const result = c.querySelector('.result');
                const options = c.querySelector('.options');
                if (result) result.remove();
                if (options) options.remove();
            });
        });