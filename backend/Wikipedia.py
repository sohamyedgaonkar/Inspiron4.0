import wikipediaapi

# Define a user agent string that describes your bot
user_agent = "MyWikipediaBot/1.0 (sohamyedgaonkar@gmail.com)"

# Pass the user agent to the Wikipedia class constructor
wiki_wiki = wikipediaapi.Wikipedia(
    language='en',
    user_agent=user_agent # Specify the user agent here
)

page = wiki_wiki.page("Python programming")

if page.exists():
    print(f"Title: {page.title}")
    #print(page.text)
else:
    print("Page does not exist.")
from openai import OpenAI

client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = "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"
)

completion = client.chat.completions.create(
  model="meta/llama3-70b-instruct",
  messages=[{"role":"user","content":"Generate 10 MCQ on this context in mind context :"+page.text[:10000]}],
  temperature=0.5,
  top_p=1,
  max_tokens=1024,
  stream=True
)

for chunk in completion:
  if chunk.choices[0].delta.content is not None:
    print(chunk.choices[0].delta.content, end="")

