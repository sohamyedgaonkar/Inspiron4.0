from openai import OpenAI
import json

# Initialize the client
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="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"
)

# Define the prompt to explicitly request a JSON response
prompt = """
Generate a 9 MCQ Quiz on the topic Artificial Intelligence
The response should be valid JSON format.
The JSON object should have the following structure:
{
  "Question1": "The generated Question1 text here" ,"Option11":"The generated Option1 text here ",
  "Answer1": "The correct answer1 here"
}
Answer Should be one of the option number (1,2,3,4)
Dont include Additional text except the json in the response.
"""

# Make the API request
completion = client.chat.completions.create(
    model="meta/llama3-70b-instruct",
    messages=[{"role": "user", "content": prompt}],
    temperature=0.5,
    top_p=1,
    max_tokens=1024,
    stream=False  # Disable streaming for easier handling
)

# Extract the response text
response_text = completion.choices[0].message.content

# Try to parse the response as JSON
try:
    response_json = json.loads(response_text)
    print("Valid JSON response:")
    print(json.dumps(response_json, indent=2))  # Pretty-print the JSON
except json.JSONDecodeError:
    print("The response is not in valid JSON format. Response text:")
    print(response_text)