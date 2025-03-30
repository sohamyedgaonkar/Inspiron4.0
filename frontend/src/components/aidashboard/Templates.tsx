export default [
    {
        name: 'Blog',
        desc: 'An AI tool that writes a comprehensive blog.',
        category: 'Blog',
        icon: 'https://cdn-icons-png.flaticon.com/128/3959/3959542.png',
        aiprompt: 'Write a comprehensive blog based on the title and outline. The blog should include an engaging introduction, detailed main content with subheadings, real-world examples or use cases, and a conclusion with a call to action. Use a professional and conversational tone, ensuring readability and SEO optimization with relevant keywords.',
        slug: 'generate-blog',
        form: [
            {
                label: 'Enter your Blog title',
                field: 'input',
                name: 'title',
                required: true
            },
            {
                label: 'Enter blog outline',
                field: 'textarea',
                name: 'outline'
            }
        ]
    },
    {
        name: 'Essay',
        desc: 'An AI tool that helps you write academic essays.',
        category: 'Writing',
        icon: 'https://cdn-icons-png.flaticon.com/128/3959/3959542.png',
        aiprompt: 'Write an academic essay on the given topic. The essay should have a clear thesis statement, structured arguments, supporting evidence, and a well-rounded conclusion.',
        slug: 'generate-essay',
        form: [
            {
                label: 'Enter essay topic',
                field: 'input',
                name: 'topic',
                required: true
            }
        ]
    },
    {
        name: 'Research Paper',
        desc: 'An AI tool that helps you write research papers.',
        category: 'Writing',
        icon: 'https://cdn-icons-png.flaticon.com/128/3959/3959542.png',
        aiprompt: 'Generate a detailed research paper based on the provided research question. Include a literature review, methodology, results, discussion, and conclusion sections.',
        slug: 'generate-research-paper',
        form: [
            {
                label: 'Enter research topic',
                field: 'input',
                name: 'topic',
                required: true
            }
        ]
    },
    {
        name: 'Study Schedule',
        desc: 'An AI tool that creates a personalized study schedule.',
        category: 'Productivity',
        icon: 'https://cdn-icons-png.flaticon.com/128/3959/3959542.png',
        aiprompt: 'Create a personalized study schedule based on upcoming exams, assignments, and personal availability.',
        slug: 'generate-study-schedule',
        form: [
            {
                label: 'Enter exam/assignment details',
                field: 'textarea',
                name: 'exams_assignments',
                required: true
            },
            {
                label: 'Enter available study hours per day',
                field: 'input',
                name: 'study_hours',
                required: true
            }
        ]
    },
    // {
    //     name: 'Plagiarism Checker',
    //     desc: 'An AI tool to check plagiarism in academic content.',
    //     category: 'Writing',
    //     icon: 'https://cdn-icons-png.flaticon.com/128/3959/3959542.png',
    //     aiprompt: 'Check the provided text for plagiarism and generate a report with percentage similarity and source references.',
    //     slug: 'check-plagiarism',
    //     form: [
    //         {
    //             label: 'Enter your content to check for plagiarism',
    //             field: 'textarea',
    //             name: 'content',
    //             required: true
    //         }
    //     ]
    // },
    // {
    //     name: 'Code Writer',
    //     desc: 'An AI tool to generate code based on requirements.',
    //     category: 'Development',
    //     icon: 'https://cdn-icons-png.flaticon.com/128/3959/3959542.png',
    //     aiprompt: 'Generate code for the provided problem statement or requirements. Include comments and explanations for each part of the code.',
    //     slug: 'generate-code',
    //     form: [
    //         {
    //             label: 'Enter your problem statement',
    //             field: 'textarea',
    //             name: 'problem_statement',
    //             required: true
    //         }
    //     ]
    // },
    // {
    //     name: 'Code Debugger',
    //     desc: 'An AI tool to debug and optimize code.',
    //     category: 'Development',
    //     icon: 'https://cdn-icons-png.flaticon.com/128/3959/3959542.png',
    //     aiprompt: 'Analyze the provided code for errors, suggest fixes, and optimize performance.',
    //     slug: 'debug-code',
    //     form: [
    //         {
    //             label: 'Enter your code to debug',
    //             field: 'textarea',
    //             name: 'code',
    //             required: true
    //         }
    //     ]
    // },
    {
        name: 'Math Problem Solver',
        desc: 'An AI tool to solve math problems and provide step-by-step solutions.',
        category: 'Learning',
        icon: 'https://cdn-icons-png.flaticon.com/128/3959/3959542.png',
        aiprompt: 'Solve the given math problem and provide a step-by-step solution with explanations.',
        slug: 'solve-math-problem',
        form: [
            {
                label: 'Enter math problem',
                field: 'input',
                name: 'math_problem',
                required: true
            }
        ]
    },
    {
        name: 'Time Management Assistant',
        desc: 'An AI tool to help with time management and productivity.',
        category: 'Productivity',
        icon: 'https://cdn-icons-png.flaticon.com/128/3959/3959542.png',
        aiprompt: 'Create a time management plan based on your tasks and deadlines. Provide suggestions to optimize your daily routine.',
        slug: 'generate-time-management-plan',
        form: [
            {
                label: 'Enter your tasks and deadlines',
                field: 'textarea',
                name: 'tasks_deadlines',
                required: true
            }
        ]
    }
]
