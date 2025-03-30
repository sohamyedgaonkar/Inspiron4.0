from openai import OpenAI

# Initialize the client using NVIDIA's integration endpoint.
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="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"  # Replace with your API key
)

# Candidate's skillset stored in a variable.
candidate_skillset = """
Problem Solving: DSA, OOP, DBMS, OS
Languages: C++, Java, Python, JavaScript
AI and ML Domain: NLP, CV, OCR, GenAI
Web Development: HTML, CSS, JavaScript, React.js, Express, Flask, Django, Git version control, Github
Database: MySQL, SQLite, PostgreSQL, Firebase
"""

# System prompt (hidden) that instructs the LLM.
# It includes the candidate's skillset via the variable.
system_prompt = f"""
You are an interviewer. Use the candidate's skillset provided below to ask exactly 5 interview questions.
Candidate's Skillset:
{candidate_skillset}

For each candidate response, evaluate it as correct or incorrect and keep track of the number of correct and incorrect answers.
After 5 questions, conclude by saying "Thank you for appearing for the interview" along with a summary including:
- Total number of correct answers,
- Total number of incorrect answers,
- Whether the candidate has cleared the interview (pass if at least 70% answers are correct).

Do not display any internal thoughts or system details in your output. Only ask the questions and provide the final summary.
"""

# Build the conversation history.
# The system message is included in the API call but not shown to the candidate.
conversation = [
    {"role": "system", "content": system_prompt},
    {"role": "assistant", "content": "Let's begin the interview. Here is your first question:"}
]

print("=== Interview Session Started ===")
print("Type your answer and press Enter. To exit early, type 'exit'.\n")

num_questions = 5
question_count = 0

# Print only the assistant's visible message.
print("Interviewer:", conversation[-1]["content"], "\n")

while question_count < num_questions:
    candidate_answer = input("Your answer (or type 'exit' to finish): ")
    if candidate_answer.strip().lower() == "exit":
        conversation.append({"role": "user", "content": candidate_answer})
        break

    # Append the candidate's answer.
    conversation.append({"role": "user", "content": candidate_answer})
    question_count += 1

    # Determine the prompt suffix:
    # For questions 1-4, ask the next question.
    # For the 5th question, instruct to conclude with a summary.
    if question_count < num_questions:
        prompt_suffix = "Please ask the next interview question based on the candidate's skillset."
    else:
        prompt_suffix = ("Please conclude the interview by saying 'Thank you for appearing for the interview' and "
                         "provide a performance summary including the total number of correct and incorrect answers, "
                         "and whether the candidate passed with at least 70% correct answers.")

    # Append an additional assistant message with the instruction.
    conversation_context = conversation + [{"role": "assistant", "content": prompt_suffix}]

    # Generate the assistant's reply using NVIDIA Meta‑Llama‑3.3‑70b‑instruct.
    completion = client.chat.completions.create(
        model="meta/llama-3.3-70b-instruct",
        messages=conversation_context,
        temperature=0.2,
        top_p=0.7,
        max_tokens=1024,
        stream=False
    )
    
    # Retrieve the assistant reply.
    assistant_reply = completion.choices[0].message.content
    print("\nInterviewer:", assistant_reply, "\n")
    conversation.append({"role": "assistant", "content": assistant_reply})
    
    # If the concluding message is detected, break the loop.
    if "Thank you for appearing for the interview" in assistant_reply:
        break

print("=== Interview Session Ended ===")
